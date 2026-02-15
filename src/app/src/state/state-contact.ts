import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';

export type ContactStateValue = {
  email: string;
  address: string;
  googleMapsUrl: string;
};

const contactInitialState: ContactStateValue = {
  email: '',
  address: '',
  googleMapsUrl: '',
};

export const ContactState = signalStore(
  withState<ContactStateValue>(contactInitialState),
  withMethods((store) => ({
    setContactState(data: ContactStateValue): void {
      patchState(store, (state) => ({
        ...state,
        ...data,
      }));
    },
  })),
);
