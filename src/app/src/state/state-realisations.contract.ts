import { Language } from '@ngx-translate/core';
import type { createRealisationsState } from './state-realisations.factory';

export type RealisationTranslation = {
  title: string;
  lead: string;
  description: string;
  scope: string[];
  effects: string[];
};

export type RealisationI18n = Record<Language, RealisationTranslation>;

export type RealisationCategory = string;

export type RealisationPhaseIcon = 'truck' | 'layers' | 'shield' | 'sprout' | 'flag';

export type RealisationPhaseTranslation = {
  name: string;
  description: string;
};

export type RealisationsState = {
  realisations: RealisationItem[];
  selectedRealisationId: string | null;
  hasLoadedRealisations: boolean;
};

export type RealisationPhase = {
  number: number;
  icon: RealisationPhaseIcon;
  images: string[];
  i18n: Record<Language, RealisationPhaseTranslation>;
};

export type RealisationItem = {
  id: string;
  slug: string;
  region: string;
  longitude?: number;
  latitude?: number;
  years: string;
  area: string;
  category: RealisationCategory;
  cover: string;
  images: string[];
  phases?: RealisationPhase[];
  i18n: RealisationI18n;
};

export type RealisationsStateContract = InstanceType<ReturnType<typeof createRealisationsState>>;
