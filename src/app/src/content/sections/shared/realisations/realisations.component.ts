import { NgOptimizedImage } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  InjectionToken,
} from '@angular/core';
import { Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { MenuState } from 'src/app/src/state/state-menu';
import { TranslationManagerService } from 'src/app/src/state/translation-manager.service';
import {
  RealisationItem,
  RealisationTranslation,
  RealisationsStateContract,
} from 'src/app/src/state/state-realisations.contract';
export const REALISATIONS_STATE_TOKEN = new InjectionToken<RealisationsStateContract>(
  'REALISATIONS_STATE',
);

export type RealisationsNavigationConfig = {
  menuKey: string;
  defaultPath: string;
};

const DEFAULT_REALISATIONS_NAVIGATION_CONFIG: RealisationsNavigationConfig = {
  menuKey: 'menu.past-realisations',
  defaultPath: 'past-realisations',
};

export const REALISATIONS_NAVIGATION_CONFIG_TOKEN =
  new InjectionToken<RealisationsNavigationConfig>('REALISATIONS_NAVIGATION_CONFIG', {
    providedIn: 'root',
    factory: () => DEFAULT_REALISATIONS_NAVIGATION_CONFIG,
  });

type RealisationCardViewModel = RealisationItem & {
  translation: RealisationTranslation;
};

type RealisationMapMarker = {
  id: string;
  slug: string;
  title: string;
  location: string;
  region: string;
  longitude: number;
  latitude: number;
  mapX: number;
  mapY: number;
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
  private readonly navigationConfig = inject(REALISATIONS_NAVIGATION_CONFIG_TOKEN);

  protected readonly realisationsState =
    inject<RealisationsStateContract>(REALISATIONS_STATE_TOKEN);

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
        if (card.longitude == null || card.latitude == null) {
          return null;
        }
        return {
          id: card.id,
          slug: card.slug,
          title: card.translation.title,
          location: this.locationFromTitle(card.translation.title),
          region: card.region,
          longitude: card.longitude,
          latitude: card.latitude,
          mapX: this.realisationsState.mapX(card.longitude),
          mapY: this.realisationsState.mapY(card.latitude),
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
      .find((item) => item.key === this.navigationConfig.menuKey);
    const listPath =
      realisationsMenuItem?.urls[currentLang]?.url ?? this.navigationConfig.defaultPath;

    void this.router.navigate(['/', currentLang, listPath, slug]);
  }

  protected assetUrl(directory: string, path: string): string {
    return `assets/${directory}/compressed/${path}`;
  }

  private locationFromTitle(title: string): string {
    return title.split(/\s+[–-]\s+/).at(-1) ?? title;
  }

}
