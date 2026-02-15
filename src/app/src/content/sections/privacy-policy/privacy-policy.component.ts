import { Component, computed, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { marked } from 'marked';
import { TranslatePipe } from '@ngx-translate/core';
import { SectionHeaderComponent } from '../shared/section-header.component';
import { PrivacyLanguage, PrivacyPolicyState } from '../../../state/state-privacy-policy';
import { TranslationManagerService } from '../../../state/translation-manager.service';

@Component({
  selector: 'app-privacy-policy',
  standalone: true,
  imports: [CommonModule, TranslatePipe, SectionHeaderComponent],
  templateUrl: './privacy-policy.component.html',
  styleUrls: ['./privacy-policy.component.scss'],
})
export class PrivacyPolicyComponent {
  private readonly sanitizer = inject(DomSanitizer);
  readonly privacyPolicyState = inject(PrivacyPolicyState);
  readonly translationManager = inject(TranslationManagerService);

  readonly documents = this.privacyPolicyState.documents;
  readonly documentsWithMarkdown = computed(() =>
    this.documents().map((document) => ({
      ...document,
      markdownHtml: this.toSafeHtml(this.privacyPolicyState.markdownById()[document.id] ?? null),
    })),
  );

  constructor() {
    void this.privacyPolicyState.loadPrivacyIndexAsset();

    effect(() => {
      const language = this.translationManager.lang() as PrivacyLanguage;
      const documents = this.documents();

      if (documents.length === 0) {
        return;
      }

      void this.privacyPolicyState.loadPrivacyMarkdownAssets(language);
    });
  }

  private toSafeHtml(markdown: string | null): SafeHtml | null {
    if (!markdown) {
      return null;
    }

    const html = marked.parse(markdown) as string;
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }
}
