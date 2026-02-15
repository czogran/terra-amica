import type { Type } from '@angular/core';
import { Language } from '@ngx-translate/core';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';

export interface MenuItem {
  key: string;
  icon?: string;
  active?: boolean;
  urls: Record<
    Language,
    {
      url: string;
      title: string;
    }
  >;
  loadComponent: () => Promise<Type<unknown>>;
}

export const MENU_ITEMS: MenuItem[] = [
  {
    key: 'menu.about-company',
    urls: {
      pl: { url: 'o-firmie', title: 'O firmie' },
      en: { url: 'about-company', title: 'About company' },
      de: { url: 'uber-das-unternehmen', title: 'Über das Unternehmen' },
    },
    loadComponent: () =>
      import('../content/sections/about-company/about-company.component').then(
        (m) => m.AboutCompanyComponent,
      ),
  },
  {
    key: 'menu.offer',
    urls: {
      pl: { url: 'oferta', title: 'Oferta' },
      en: { url: 'offer', title: 'Offer' },
      de: { url: 'angebot', title: 'Angebot' },
    },
    loadComponent: () =>
      import('../content/sections/offer/offer.component').then((m) => m.OfferComponent),
  },
  {
    key: 'menu.realisations',
    urls: {
      pl: { url: 'realizacje', title: 'Realizacje' },
      en: { url: 'realisations', title: 'Realisations' },
      de: { url: 'realisierungen', title: 'Realisierungen' },
    },
    loadComponent: () =>
      import('../content/sections/realisations/realisations.component').then(
        (m) => m.RealisationsComponent,
      ),
  },
  {
    key: 'menu.research',
    urls: {
      pl: { url: 'badania', title: 'Badania' },
      en: { url: 'research', title: 'Research' },
      de: { url: 'forschung', title: 'Forschung' },
    },
    loadComponent: () =>
      import('../content/sections/research/research.component').then((m) => m.ResearchComponent),
  },
  {
    key: 'menu.references',
    urls: {
      pl: { url: 'referencje', title: 'Referencje' },
      en: { url: 'references', title: 'References' },
      de: { url: 'referenzen', title: 'Referenzen' },
    },
    loadComponent: () =>
      import('../content/sections/references/references.component').then(
        (m) => m.ReferencesComponent,
      ),
  },
  {
    key: 'menu.jobs',
    urls: {
      pl: { url: 'praca', title: 'Praca' },
      en: { url: 'jobs', title: 'Jobs' },
      de: { url: 'stellenangebote', title: 'Stellenangebote' },
    },
    loadComponent: () =>
      import('../content/sections/job/job.component').then((m) => m.JobComponent),
  },
  {
    key: 'menu.privacy-policy',
    urls: {
      pl: { url: 'polityka-prywatnosci', title: 'Polityka prywatności' },
      en: { url: 'privacy-policy', title: 'Privacy Policy' },
      de: { url: 'datenschutzerklarung', title: 'Datenschutzerklärung' },
    },
    loadComponent: () =>
      import('../content/sections/privacy-policy/privacy-policy.component').then(
        (m) => m.PrivacyPolicyComponent,
      ),
  },
];

type MenuStoreState = {
  menuItems: MenuItem[];
  activeMenuItemKey: string | null;
};

const menuInitialState: MenuStoreState = {
  menuItems: MENU_ITEMS,
  activeMenuItemKey: null,
};

export const MenuState = signalStore(
  withState<MenuStoreState>(menuInitialState),
  withMethods((store) => ({
    setMenuItems(menuItems: MenuItem[]): void {
      patchState(store, (state) => ({
        ...state,
        menuItems,
      }));
    },
    setActiveMenuItemKey(activeMenuItemKey: string | null): void {
      patchState(store, (state) => ({
        ...state,
        activeMenuItemKey,
      }));
    },
  })),
);
