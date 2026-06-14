import { inject } from '@angular/core';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { TranslationManagerService } from './translation-manager.service';
import type {
  RealisationItem,
  RealisationsState as RealisationsStateType,
} from './state-realisations.contract';

const realisationsInitialState: RealisationsStateType = {
  realisations: [],
  selectedRealisationId: null,
  hasLoadedRealisations: false,
};

function decimalToDegMin(decimalDegrees: number): number {
  const degrees = Math.trunc(decimalDegrees);
  const minutes = Math.abs((decimalDegrees - degrees) * 60);
  return degrees * 60 + minutes;
}

const POLAND_LONGITUDE = 10.02;
const WESTERMOST_POLAND_LONGITUDE = 14.07;
const POLAND_LATITUDE = 5.5;
const SOUTHERMOST_POLAND_LATITUDE = 49;

function mapX(longitude: number): number {
  return (
    ((decimalToDegMin(longitude) - decimalToDegMin(WESTERMOST_POLAND_LONGITUDE)) /
      decimalToDegMin(POLAND_LONGITUDE)) *
    100
  );
}

function mapY(latitude: number): number {
  return (
    ((decimalToDegMin(latitude) - decimalToDegMin(SOUTHERMOST_POLAND_LATITUDE)) /
      decimalToDegMin(POLAND_LATITUDE)) *
    100
  );
}

type CreateRealisationsStateOptions = {
  assetUrl: string;
  registerTranslations: (
    translationManager: TranslationManagerService,
    data: RealisationItem[],
  ) => void;
};

export function createRealisationsState({
  assetUrl,
  registerTranslations,
}: CreateRealisationsStateOptions) {
  return signalStore(
    withState<RealisationsStateType>(realisationsInitialState),
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
              const res = await fetch(assetUrl);
              if (!res.ok) {
                return;
              }

              const data = (await res.json()) as RealisationItem[];
              patchState(store, (state) => ({
                ...state,
                realisations: data,
                hasLoadedRealisations: true,
              }));
              registerTranslations(translationManager, data);
            } catch (_err: unknown) {
            } finally {
              loadPromise = null;
            }
          })();

          await loadPromise;
        },
        mapX,
        mapY,
      };
    }),
  );
}
