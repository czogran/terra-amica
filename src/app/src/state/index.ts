import e from 'express';
import { ContactState } from './state-contact';
import { CurrentRealisationsState } from './state-current-realisations';
import { MenuState } from './state-menu';
import { OfferState } from './state-offer';
import { PrivacyPolicyState } from './state-privacy-policy';
import { RealisationsState } from './state-realisations';
import { ReferenceState } from './state-reference';
import { StateService } from './state.service';

export const STATE_PROVIDERS = [
  ContactState,
  StateService,
  ReferenceState,
  RealisationsState,
  CurrentRealisationsState,
  MenuState,
  PrivacyPolicyState,
  OfferState
];

export * from './state-contact';
export * from './state-current-realisations';
export * from './state-reference';
export * from './state-realisations';
export * from './state-privacy-policy';
export * from './state-menu';
export * from './state-offer';
export * from './translation-manager.service';

