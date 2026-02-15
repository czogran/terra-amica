import { Component, computed, inject } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { TranslatePipe } from '@ngx-translate/core';
import { RouterLink } from '@angular/router';
import { SectionHeaderComponent } from '../shared/section-header.component';
import { MenuState } from '../../../state/state-menu';
import { TranslationManagerService } from '../../../state/translation-manager.service';

@Component({
  selector: 'app-about-company',
  templateUrl: './about-company.component.html',
  styleUrls: ['./about-company.component.scss'],
  imports: [TranslatePipe, SectionHeaderComponent, RouterLink],
})
export class AboutCompanyComponent {
  private readonly menuState = inject(MenuState);
  private readonly translationManager = inject(TranslationManagerService);

  readonly offerLink = computed(() => {
    const language = this.translationManager.lang();
    const offerItem = this.menuState.menuItems().find((item) => item.key === 'menu.offer');
    const offerUrl = offerItem?.urls[language]?.url ?? 'offer';

    return ['/', language, offerUrl];
  });
}
