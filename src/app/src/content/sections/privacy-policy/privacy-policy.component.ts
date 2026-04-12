import { Component, computed, effect, inject } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { SectionHeaderComponent } from '../shared/section-header.component';
import { PrivacyLanguage, PrivacyPolicyState } from '../../../state/state-privacy-policy';
import { TranslationManagerService } from '../../../state/translation-manager.service';

@Component({
  selector: 'app-privacy-policy',
  imports: [TranslatePipe, SectionHeaderComponent],
  templateUrl: './privacy-policy.component.html',
  styleUrls: ['./privacy-policy.component.scss'],
})
export class PrivacyPolicyComponent {
  readonly privacyPolicyState = inject(PrivacyPolicyState);
  readonly translationManager = inject(TranslationManagerService);

  readonly documents = this.privacyPolicyState.documentsViewModel;

  constructor() {
    this.privacyPolicyState.loadPrivacyIndexAsset();

    effect(() => {
      const language = this.translationManager.lang() as PrivacyLanguage;
      this.privacyPolicyState.loadPrivacyMarkdownAssets(language);
    });
  }
}
