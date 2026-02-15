import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  computed,
  inject,
  signal,
} from '@angular/core';
import { NgComponentOutlet } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  RealisationItem,
  RealisationLanguage,
  RealisationTranslation,
  RealisationsState,
} from 'src/app/src/state/state-realisations';
import { TranslationManagerService } from 'src/app/src/state/translation-manager.service';
import { RealisationsCarouselComponent } from './realisations-carousel.component';
import { RealisationsDetailsMetaComponent } from './realisations-details-meta.component';
import { RealisationsDetailsNavigationComponent } from './realisations-details-navigation.component';

type RealisationCardViewModel = RealisationItem & {
  translation: RealisationTranslation;
};

@Component({
  selector: 'app-realisations-details',
  standalone: true,
  templateUrl: './realisations-details.component.html',
  styleUrl: './realisations-details.component.scss',
  imports: [
    NgComponentOutlet,
    TranslatePipe,
    RealisationsDetailsMetaComponent,
    RealisationsDetailsNavigationComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RealisationsDetailsComponent {
  private readonly destroyRef = inject(DestroyRef);
  private readonly route = inject(ActivatedRoute);
  private readonly translationManager = inject(TranslationManagerService);

  protected readonly carouselComponent = RealisationsCarouselComponent;

  protected readonly realisationsState = inject(RealisationsState);
  protected readonly selectedSlug = signal<string | null>(null);

  protected readonly cards = computed<ReadonlyArray<RealisationCardViewModel>>(() => {
    const language = this.normalizeLanguage(this.translationManager.lang());
    return this.realisationsState.realisations().map((item) => ({
      ...item,
      translation: item.i18n[language] ?? item.i18n.pl,
    }));
  });

  protected readonly card = computed<RealisationCardViewModel | null>(() => {
    const slug = this.selectedSlug();

    return this.cards().find((item) => item.slug === slug) ?? null;
  });

  constructor() {
    void this.realisationsState.loadRealisationsAsset();
    this.route.paramMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params) => {
      const slug = params.get('slug');

      this.selectedSlug.set(slug);
    });
  }

  assetUrl(path: string): string {
    return `assets/${path}`;
  }

  imagePaths(): string[] {
    const realisation = this.card();
    if (!realisation) {
      return [];
    }

    const images = realisation.images;
    if (images.length > 0) {
      return images.map((image) => this.assetUrl(image));
    }

    return [this.assetUrl(realisation.cover)];
  }

  carouselInputs(): { images: string[]; alt: string } | null {
    const realisation = this.card();
    if (!realisation) {
      return null;
    }

    return {
      images: this.imagePaths(),
      alt: realisation.translation.title,
    };
  }

  private normalizeLanguage(lang: string): RealisationLanguage {
    if (lang === 'en' || lang === 'de') {
      return lang;
    }

    return 'pl';
  }
}
