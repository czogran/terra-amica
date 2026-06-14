import { Signal } from '@angular/core';
import { Language } from '@ngx-translate/core';

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

export interface RealisationsStateContract {
  realisations: Signal<RealisationItem[]>;
  selectedRealisationId: Signal<string | null>;
  hasLoadedRealisations: Signal<boolean>;
  setRealisationsState: (data: RealisationItem[]) => void;
  setSelectedRealisation: (id: string | null) => void;
  clearSelectedRealisation: () => void;
  loadRealisationsAsset: () => Promise<void>;
  mapX(longitude: number): number;
  mapY(latitude: number): number;
}
