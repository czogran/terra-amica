import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { ASSET_URLS } from './state.config';

export type ContactStateValue = {
  email: string;
  address: string;
  googleMapsUrl: string;
};

type ContactStateModel = ContactStateValue & {
  hasLoadedContact: boolean;
};

const contactInitialState: ContactStateModel = {
  email: '',
  address: '',
  googleMapsUrl: '',
  hasLoadedContact: false,
};

export const ContactState = signalStore(
  withState<ContactStateModel>(contactInitialState),
  withMethods((store) => ({
    setContactState(data: ContactStateValue): void {
      patchState(store, (state) => ({
        ...state,
        ...data,
      }));
    },

    async loadContactAsset(): Promise<void> {
      if (store.hasLoadedContact()) return;
      try {
        const res = await fetch(ASSET_URLS.contact);
        if (!res.ok) return;

        const data = (await res.json()) as ContactStateValue;
        patchState(store, (state) => ({
          ...state,
          ...data,
          hasLoadedContact: true,
        }));
      } catch (_err: unknown) {
        // ignore (optional: add a user-facing fallback state)
      }
    },
  })),
);
