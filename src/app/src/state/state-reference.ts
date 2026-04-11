import { inject } from '@angular/core';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { ASSET_URLS } from './state.config';
import { TranslationManagerService } from './translation-manager.service';

type ReferenceRawState = {
  id: string;
  files: string[];
  title: {
    pl: string;
    en: string;
    de: string;
  };
  description: {
    pl: string;
    en: string;
    de: string;
  };
};

export type ReferenceItem = {
  id: string;
  files: string[];
  titleKey: string;
  descriptionKey: string;
};

export type ReferenceStateValue = {
  references: ReferenceItem[];
  hasLoadedReferences: boolean;
};

const referencesInitialState: ReferenceStateValue = {
  references: [],
  hasLoadedReferences: false,
};

export const ReferenceState = signalStore(
  withState<ReferenceStateValue>(referencesInitialState),
  withMethods((store) => ({
    async loadReferencesAsset(
      translationManager = inject(TranslationManagerService),
    ): Promise<void> {
      if (store.hasLoadedReferences()) return;
      try {
        const res = await fetch(ASSET_URLS.referencesIndex);
        if (!res.ok) return;

        const data = (await res.json()) as unknown as ReferenceRawState[];
        const references: ReferenceItem[] = data.map((item) => ({
          id: item.id,
          files: item.files,
          titleKey: `reference.${item.id}.title`,
          descriptionKey: `reference.${item.id}.description`,
        }));

        patchState(store, (state) => ({
          ...state,
          references,
          hasLoadedReferences: true,
        }));

        translationManager.registerReferenceTranslations(data);
      } catch (_err: unknown) {
        // ignore (optional: add a user-facing fallback state)
      }
    },
  })),
);
