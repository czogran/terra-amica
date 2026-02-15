import { ContactState } from './state-contact';
import { MenuState } from './state-menu';
import { PrivacyPolicyState } from './state-privacy-policy';
import { RealisationsState } from './state-realisations';
import { ReferenceState } from './state-reference';
import { StateService } from './state.service';

export const STATE_PROVIDERS = [
  ContactState,
  StateService,
  ReferenceState,
  RealisationsState,
  MenuState,
  PrivacyPolicyState,
];

export * from './state-contact';
export * from './state-reference';
export * from './state-realisations';
export * from './state-privacy-policy';
export * from './state-menu';
export * from './translation-manager.service';
