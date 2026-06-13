import { environment } from '../../../environments/environment';

export const ASSET_PATHS = {
  contact: 'assets/contact/contact.json',
  referencesIndex: 'assets/references/index.json',
  realisationsIndex: 'assets/realisations/index.json',
  offerIndex: 'assets/offer/index.json',
  privacyPolicyIndex: 'assets/privacy-policy/index.json',
  privacyPolicyDir: 'assets/privacy-policy/',
  offerDir: 'assets/offer/',
  realisationsDir: 'assets/realisations/',
  referencesDir: 'assets/references/',
} as const;

export function assetUrl(assetPath: string): string {
  return `${environment.href}${assetPath}`;
}

export const ASSET_URLS = {
  contact: assetUrl(ASSET_PATHS.contact),
  referencesIndex: assetUrl(ASSET_PATHS.referencesIndex),
  realisationsIndex: assetUrl(ASSET_PATHS.realisationsIndex),
  offerIndex: assetUrl(ASSET_PATHS.offerIndex),
  privacyPolicyIndex: assetUrl(ASSET_PATHS.privacyPolicyIndex),
  privacyPolicyFile: (fileName: string) => assetUrl(`${ASSET_PATHS.privacyPolicyDir}${fileName}`),
} as const;
