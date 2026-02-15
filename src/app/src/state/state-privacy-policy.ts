import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';

export type PrivacyLanguage = 'pl' | 'en' | 'de';

export type PrivacyDocumentVersion = {
  pdf: string;
  markdown: string;
};

export type PrivacyDocument = {
  id: string;
  titleKey?: string;
  downloadAriaKey?: string;
  pdf?: string;
  markdown?: string;
  versions?: Partial<Record<PrivacyLanguage, PrivacyDocumentVersion>>;
};

export type PrivacyPolicyState = {
  documents: PrivacyDocument[];
  markdownById: Record<string, string>;
};

const privacyPolicyInitialState: PrivacyPolicyState = {
  documents: [],
  markdownById: {},
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
    markdown: document.markdown ?? '',
  };

  return {
    ...document,
    titleKey: document.titleKey ?? defaultTitleKeyById[document.id] ?? '',
    downloadAriaKey: document.downloadAriaKey ?? defaultDownloadAriaKeyById[document.id] ?? '',
    pdf: document.pdf ?? fallbackVersion.pdf,
    markdown: document.markdown ?? fallbackVersion.markdown,
  };
}

export const PrivacyPolicyState = signalStore(
  withState<PrivacyPolicyState>(privacyPolicyInitialState),
  withMethods((store) => ({
    setPrivacyDocuments(documents: PrivacyDocument[]): void {
      patchState(store, (state) => ({
        ...state,
        documents,
      }));
    },

    setPrivacyMarkdown(id: string, markdown: string): void {
      patchState(store, (state) => ({
        ...state,
        markdownById: {
          ...state.markdownById,
          [id]: markdown,
        },
      }));
    },

    resolveDocumentVersion(
      document: PrivacyDocument,
      language: PrivacyLanguage,
    ): PrivacyDocumentVersion {
      const localized = document.versions?.[language];
      if (localized) {
        return localized;
      }

      return {
        pdf: document.pdf ?? '',
        markdown: document.markdown ?? '',
      };
    },

    async loadPrivacyIndexAsset(): Promise<void> {
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

    async loadPrivacyMarkdownAssets(language: PrivacyLanguage): Promise<void> {
      const documents = store.documents();
      if (documents.length === 0) return;

      patchState(store, (state) => ({
        ...state,
        markdownById: {},
      }));

      await Promise.all(
        documents.map(async (document) => {
          const localized = document.versions?.[language] ?? {
            pdf: document.pdf ?? '',
            markdown: document.markdown ?? '',
          };

          if (!localized.markdown) {
            return;
          }

          try {
            const res = await fetch(`/assets/privacy-policy/${localized.markdown}`);
            if (!res.ok) return;

            const markdown = await res.text();
            patchState(store, (state) => ({
              ...state,
              markdownById: {
                ...state.markdownById,
                [document.id]: markdown,
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
