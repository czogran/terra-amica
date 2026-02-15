import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';

export type ReferenceItem = {
  id: string;
  files: string[];
  titleKey: string;
  descriptionKey: string;
};

export type ReferenceStateValue = {
  references: ReferenceItem[];
};

const referencesInitialState: ReferenceStateValue = {
  references: [],
};

export const ReferenceState = signalStore(
  withState<ReferenceStateValue>(referencesInitialState),
  withMethods((store) => ({
    setReferencesState(data: ReferenceItem[]): void {
      patchState(store, (state) => ({
        ...state,
        references: data,
      }));
    },
  })),
);
