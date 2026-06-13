import { NgOptimizedImage } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject
} from '@angular/core';
import { Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { MenuState } from 'src/app/src/state/state-menu';
import {
  RealisationItem,
  RealisationTranslation,
  RealisationsState,
} from 'src/app/src/state/state-realisations';
import { TranslationManagerService } from 'state';

type RealisationCardViewModel = RealisationItem & {
  translation: RealisationTranslation;
};

type RealisationMapMarker = {
  id: string;
  slug: string;
  title: string;
  location: string;
  region: string;
  x: number;
  y: number;
};

@Component({
  selector: 'app-realisations',
  templateUrl: './realisations.component.html',
  styleUrls: ['./realisations.component.scss'],
  imports: [TranslatePipe, NgOptimizedImage],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RealisationsComponent {
  private readonly router = inject(Router);
  private readonly menuState = inject(MenuState);
  private readonly translationManager = inject(TranslationManagerService);

  protected readonly realisationsState = inject(RealisationsState);

  protected readonly realisations = computed(() => this.realisationsState.realisations());
  protected readonly cards = computed<ReadonlyArray<RealisationCardViewModel>>(() =>
    this.realisations().map((item) => ({
      ...item,
      translation: item.i18n[this.translationManager.lang()] ?? item.i18n['pl'],
    })),
  );

  protected readonly mapMarkers = computed<ReadonlyArray<RealisationMapMarker>>(() =>
    this.cards()
      .map((card) => {
        const position = card.mapPosition;

        if (!position) {
          return null;
        }

        return {
          id: card.id,
          slug: card.slug,
          title: card.translation.title,
          location: this.locationFromTitle(card.translation.title),
          region: card.region,
          ...position,
        };
      })
      .filter((marker): marker is RealisationMapMarker => marker !== null),
  );

  constructor() {
    void this.realisationsState.loadRealisationsAsset();
  }

  protected openDetails(slug: string): void {
    const currentLang = this.translationManager.lang();
    const realisationsMenuItem = this.menuState
      .menuItems()
      .find((item) => item.key === 'menu.realisations');
    const listPath = realisationsMenuItem?.urls[currentLang]?.url ?? 'realisations';

    void this.router.navigate(['/', currentLang, listPath, slug]);
  }

  protected assetUrl(path: string): string {
    return `assets/${path}`;
  }

  private locationFromTitle(title: string): string {
    return title.split(/\s+[–-]\s+/).at(-1) ?? title;
  }
}
