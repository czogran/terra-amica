import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { marked } from 'marked';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { inject } from '@angular/core';

export type PrivacyLanguage = 'pl' | 'en' | 'de';

export type PrivacyDocumentVersion = {
  pdf: string;
  markdownFile: string;
};

export type PrivacyDocument = {
  id: string;
  titleKey?: string;
  downloadAriaKey?: string;
  pdf?: string;
  markdownFile?: string;
  versions?: Partial<Record<PrivacyLanguage, PrivacyDocumentVersion>>;
};

export type PrivacyPolicyState = {
  documents: PrivacyDocument[];
  markdownHtmlById: Record<string, SafeHtml>;
};

const privacyPolicyInitialState: PrivacyPolicyState = {
  documents: [],
  markdownHtmlById: {},
};

const defaultTitleKeyById: Record<string, string> = {
  contractors: 'privacy.contractors.title',
  monitoring: 'privacy.monitoring.title',
};

const defaultDownloadAriaKeyById: Record<string, string> = {
  contractors: 'privacy.contractors.download-aria',
  monitoring: 'privacy.monitoring.download-aria',
};

function normalizeDocument(document: PrivacyDocument): PrivacyDocument {
  const fallbackVersion = document.versions?.pl ?? {
    pdf: document.pdf ?? '',
    markdownFile: document.markdownFile ?? '',
  };

  return {
    ...document,
    titleKey: document.titleKey ?? defaultTitleKeyById[document.id] ?? '',
    downloadAriaKey: document.downloadAriaKey ?? defaultDownloadAriaKeyById[document.id] ?? '',
    pdf: document.pdf ?? fallbackVersion.pdf,
    markdownFile: document.markdownFile ?? fallbackVersion.markdownFile,
  };
}

export const PrivacyPolicyState = signalStore(
  withState<PrivacyPolicyState>(privacyPolicyInitialState),
  withMethods((store) => ({
    async loadPrivacyIndexAsset(): Promise<void> {
      if (store.documents().length > 0) return;
      try {
        const res = await fetch('/assets/privacy-policy/index.json');
        if (!res.ok) return;

        const documentsRaw = (await res.json()) as PrivacyDocument[];
        const documents = documentsRaw.map(normalizeDocument);
        patchState(store, (state) => ({
          ...state,
          documents,
        }));
      } catch (_err: unknown) {
        // ignore (optional: add a user-facing fallback state)
      }
    },

    async loadPrivacyMarkdownAssets(
      language: PrivacyLanguage,
      sanitizer = inject(DomSanitizer),
    ): Promise<void> {
      const documents = store.documents();
      if (documents.length === 0) return;
      if (Object.keys(store.markdownHtmlById()).length > 0) return;
      await Promise.all(
        documents.map(async (document) => {
          const localized = document.versions?.[language] ?? {
            pdf: document.pdf ?? '',
            markdownFile: document.markdownFile ?? '',
          };

          if (!localized.markdownFile) {
            return;
          }

          try {
            const res = await fetch(`/assets/privacy-policy/${localized.markdownFile}`);
            if (!res.ok) return;

            const markdown = await res.text();
            const html = marked.parse(markdown) as string;
            const safeHtml = sanitizer.bypassSecurityTrustHtml(html);
            patchState(store, (state) => ({
              ...state,
              markdownHtmlById: {
                ...state.markdownHtmlById,
                [document.id]: safeHtml,
              },
            }));
          } catch (_err: unknown) {
            // ignore (optional: add a user-facing fallback state)
          }
        }),
      );
    },
  })),
);
