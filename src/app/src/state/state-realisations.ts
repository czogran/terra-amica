import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { inject } from '@angular/core';
import { TranslationManagerService } from './translation-manager.service';
import { ASSET_URLS } from './state.config';

export type RealisationLanguage = 'pl' | 'en' | 'de';

export type RealisationTranslation = {
  title: string;
  lead: string;
  description: string;
  scope: string[];
  effects: string[];
};

export type RealisationI18n = Record<RealisationLanguage, RealisationTranslation>;

export type RealisationCategory = string;

export type RealisationItem = {
  id: string;
  slug: string;
  region: string;
  years: string;
  area: string;
  category: RealisationCategory;
  cover: string;
  images: string[];
  i18n: RealisationI18n;
};

export type RealisationsState = {
  realisations: RealisationItem[];
  selectedRealisationId: string | null;
  hasLoadedRealisations: boolean;
};

const realisationsInitialState: RealisationsState = {
  realisations: [],
  selectedRealisationId: null,
  hasLoadedRealisations: false,
};

export const RealisationsState = signalStore(
  withState<RealisationsState>(realisationsInitialState),
  withMethods((store) => {
    let loadPromise: Promise<void> | null = null;
    const translationManager = inject(TranslationManagerService);

    return {
      setRealisationsState(data: RealisationItem[]): void {
        patchState(store, (state) => ({
          ...state,
          realisations: data,
          hasLoadedRealisations: true,
        }));
      },

      setSelectedRealisation(id: string | null): void {
        patchState(store, (state) => ({
          ...state,
          selectedRealisationId: id,
        }));
      },

      clearSelectedRealisation(): void {
        patchState(store, (state) => ({
          ...state,
          selectedRealisationId: null,
        }));
      },

      async loadRealisationsAsset(): Promise<void> {
        if (store.hasLoadedRealisations()) {
          return;
        }

        if (loadPromise) {
          await loadPromise;
          return;
        }

        loadPromise = (async () => {
          try {
            const res = await fetch(ASSET_URLS.realisationsIndex);
            if (!res.ok) {
              return;
            }

            const data = (await res.json()) as RealisationItem[];
            patchState(store, (state) => ({
              ...state,
              realisations: data,
              hasLoadedRealisations: true,
            }));
            translationManager.registerRealisationsTranslations(data);
          } catch (_err: unknown) {
            // ignore (optional: add a user-facing fallback state)
          } finally {
            loadPromise = null;
          }
        })();

        await loadPromise;
      },
    };
  }),
);
