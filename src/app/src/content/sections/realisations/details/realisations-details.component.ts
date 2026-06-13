import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  RealisationItem,
  RealisationPhase,
  RealisationPhaseTranslation,
  RealisationTranslation,
  RealisationsState,
} from 'src/app/src/state/state-realisations';
import { TranslationManagerService } from 'src/app/src/state/translation-manager.service';
import { RealisationsCarouselComponent } from './realisations-carousel.component';
import { RealisationsDetailsMetaComponent } from './realisations-details-meta.component';
import { RealisationsDetailsNavigationComponent } from './realisations-details-navigation.component';
import { RealisationsDetailsPhasesComponent } from './realisations-details-phases.component';

type RealisationCardViewModel = RealisationItem & {
  translation: RealisationTranslation;
};

type RealisationPhaseViewModel = RealisationPhase & {
  translation: RealisationPhaseTranslation;
};

@Component({
  selector: 'app-realisations-details',
  templateUrl: './realisations-details.component.html',
  styleUrl: './realisations-details.component.scss',
  imports: [
    TranslatePipe,
    RealisationsDetailsMetaComponent,
    RealisationsDetailsNavigationComponent,
    RealisationsDetailsPhasesComponent,
    RealisationsCarouselComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RealisationsDetailsComponent implements AfterViewInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly translationManager = inject(TranslationManagerService);

  protected readonly realisationsState = inject(RealisationsState);
  protected readonly selectedSlug = signal<string | null>(null);
  protected readonly activePhase = signal<number>(1);
  private phaseObserver: IntersectionObserver | null = null;

  protected readonly cards = computed<ReadonlyArray<RealisationCardViewModel>>(() => {
    const language = this.translationManager.lang();
    return this.realisationsState.realisations().map((item) => ({
      ...item,
      translation: item.i18n[language] ?? item.i18n['pl'],
    }));
  });

  protected readonly card = computed<RealisationCardViewModel | null>(() => {
    const slug = this.selectedSlug();

    return this.cards().find((item) => item.slug === slug) ?? null;
  });

  protected readonly phases = computed<ReadonlyArray<RealisationPhaseViewModel>>(() => {
    const language = this.translationManager.lang();
    const realisation = this.card();

    if (!realisation) {
      return [];
    }

    const phases = realisation.phases ?? [
      {
        number: 1,
        icon: 'flag' as const,
        images: realisation.images.length > 0 ? realisation.images : [realisation.cover],
        i18n: {
          pl: { name: realisation.translation.title, description: realisation.translation.description },
          en: { name: realisation.translation.title, description: realisation.translation.description },
          de: { name: realisation.translation.title, description: realisation.translation.description },
        },
      },
    ];

    return phases.map((phase) => ({
      ...phase,
      translation: phase.i18n[language] ?? phase.i18n['pl'],
    }));
  });

  constructor() {
    void this.realisationsState.loadRealisationsAsset();
    this.destroyRef.onDestroy(() => this.phaseObserver?.disconnect());

    effect(() => {
      if (this.card()) {
        setTimeout(() => this.observePhaseSections());
      }
    });

    this.route.paramMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params) => {
      const slug = params.get('slug');
      const fragment = this.route.snapshot.fragment;

      this.selectedSlug.set(slug);
      if (fragment) {
        const phaseNumber = parseInt(fragment.replace('phase-', ''), 10);
        if (!isNaN(phaseNumber)) {
          this.activePhase.set(phaseNumber);
          setTimeout(() => this.scrollToPhase(phaseNumber), 100);
        }
      }
    });

    this.route.fragment.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((fragment) => {
      if (fragment) {
        const phaseNumber = parseInt(fragment.replace('phase-', ''), 10);
        if (!isNaN(phaseNumber)) {
          this.activePhase.set(phaseNumber);
          setTimeout(() => this.scrollToPhase(phaseNumber), 100);
        }
      }
    });
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.observePhaseSections());
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

  phaseCarouselInputs(phaseNumber: number): { images: string[]; alt: string } | null {
    const realisation = this.card();
    if (!realisation) {
      return null;
    }

    const phase = this.phases().find((item) => item.number === phaseNumber);
    const images = phase?.images.map((image) => this.assetUrl(image)) ?? this.imagePaths();
    if (images.length === 0) {
      return null;
    }

    return {
      images,
      alt: `${realisation.translation.title} - ${phaseNumber}`,
    };
  }

  scrollToPhase(phaseNumber: number): void {
    if (typeof document === 'undefined') {
      return;
    }

    const element = document.getElementById(`phase-${phaseNumber}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  goToPhase(phaseNumber: number): void {
    this.activePhase.set(phaseNumber);
    this.router.navigate([], {
      fragment: `phase-${phaseNumber}`,
      queryParamsHandling: 'preserve',
    });
  }

  private observePhaseSections(): void {
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      return;
    }

    this.phaseObserver?.disconnect();

    const sections = Array.from(
      document.querySelectorAll<HTMLElement>('.realisations-details__phase-section'),
    );

    if (sections.length === 0 || !('IntersectionObserver' in window)) {
      return;
    }

    this.phaseObserver = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort((first, second) => second.intersectionRatio - first.intersectionRatio)[0];

        const phaseNumber = Number(visibleEntry?.target.id.replace('phase-', ''));
        if (phaseNumber) {
          this.activePhase.set(phaseNumber);
        }
      },
      {
        rootMargin: '-30% 0px -55% 0px',
        threshold: [0.15, 0.35, 0.6],
      },
    );

    sections.forEach((section) => this.phaseObserver?.observe(section));
  }
}
