import { ASSET_URLS } from './state.config';
import { createRealisationsState } from './state-realisations.factory';

export const RealisationsState = createRealisationsState({
  assetUrl: ASSET_URLS.realisationsIndex,
  registerTranslations: (translationManager, data) =>
    translationManager.registerRealisationsTranslations(data),
});
