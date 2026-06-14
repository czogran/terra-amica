import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { TranslationManagerService } from 'src/app/src/state/translation-manager.service';

type NavigationCard = {
  slug: string;
};

@Component({
  selector: 'app-realisations-details-navigation',
  standalone: true,
  templateUrl: './realisations-details-navigation.component.html',
  styleUrl: './realisations-details-navigation.component.scss',
  imports: [TranslatePipe],
  host: {
    class: 'realisations-details__navigation',
    role: 'navigation',
    '[attr.aria-label]': 'navigationAriaLabel()',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RealisationsDetailsNavigationComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly translate = inject(TranslateService);
  private readonly translationManager = inject(TranslationManagerService);

  cards = input.required<ReadonlyArray<NavigationCard>>();
  currentSlug = input<string | null>(null);

  navigationAriaLabel(): string {
    this.translationManager.lang();

    return this.translate.instant('realisations.details.navigation.aria-label');
  }

  private readonly currentIndex = computed(() => {
    const slug = this.currentSlug();

    if (!slug) {
      return -1;
    }

    return this.cards().findIndex((item) => item.slug === slug);
  });

  private readonly previousCard = computed<NavigationCard | null>(() => {
    const cards = this.cards();
    const index = this.currentIndex();

    if (cards.length === 0 || index < 0) {
      return null;
    }

    if (index === 0) {
      return cards[cards.length - 1] ?? null;
    }

    return cards[index - 1] ?? null;
  });

  private readonly nextCard = computed<NavigationCard | null>(() => {
    const cards = this.cards();
    const index = this.currentIndex();

    if (cards.length === 0 || index < 0) {
      return null;
    }

    if (index === cards.length - 1) {
      return cards[0] ?? null;
    }

    return cards[index + 1] ?? null;
  });

  openPreviousDetails(): void {
    const previousCard = this.previousCard();
    if (!previousCard) {
      return;
    }

    this.openDetails(previousCard.slug);
  }

  closeDetails(): void {
    void this.router.navigate(['..'], { relativeTo: this.route });
  }

  openNextDetails(): void {
    const nextCard = this.nextCard();
    if (!nextCard) {
      return;
    }

    this.openDetails(nextCard.slug);
  }

  private openDetails(slug: string): void {
    if (!slug) {
      return;
    }

    void this.router.navigate(['..', slug], { relativeTo: this.route });
  }
}
