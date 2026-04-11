import { computed, inject } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { TranslationManagerService } from './translation-manager.service';
import { ASSET_URLS } from './state.config';

export type SupportedLang = 'pl' | 'en' | 'de';

export interface OfferServiceItem {
  icon: string;
  title: string;
  description: string;
}

export interface OfferSectionItem {
  title: string;
  items: string[];
  note?: string;
}

export interface OfferItem {
  services: OfferServiceItem[];
  sections: OfferSectionItem[];
}

interface OfferState {
  pl: OfferItem;
  en: OfferItem;
  de: OfferItem;
  hasLoadedOffer: boolean;
}

const initialState: OfferState = {
  pl: { services: [], sections: [] },
  en: { services: [], sections: [] },
  de: { services: [], sections: [] },
  hasLoadedOffer: false,
};

export const OfferState = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed((state, translationManager = inject(TranslationManagerService)) => ({
    currentOffer: computed<OfferItem>(() => {
      const lang = translationManager.lang() as SupportedLang;
      if (lang === 'en') return state.en();
      if (lang === 'de') return state.de();
      return state.pl();
    }),
  })),
  withMethods((store) => ({
    async load(): Promise<void> {
      if (store.hasLoadedOffer()) return;
      try {
        const res = await fetch(ASSET_URLS.offerIndex);
        if (!res.ok) return;
        const data = (await res.json()) as OfferState;
        patchState(store, (state) => ({
          ...state,
          ...data,
          hasLoadedOffer: true,
        }));
      } catch (_err: unknown) {
        // ignore (optional: add a user-facing fallback state)
      }
    },
  })),
);
