import { ASSET_URLS } from './state.config';
import { createRealisationsState } from './state-realisations.factory';

export const CurrentRealisationsState = createRealisationsState({
  assetUrl: ASSET_URLS.currentRealisationsIndex,
  registerTranslations: (translationManager, data) =>
    translationManager.registerCurrentRealisationsTranslations(data),
});
