import { Injectable, inject, signal } from '@angular/core';
import { Language, TranslateService } from '@ngx-translate/core';
import { Router, RoutesRecognized } from '@angular/router';
import { filter, first, firstValueFrom } from 'rxjs';

type LocalizedValues = Record<string, string>;

export interface LanguageConfig {
  code: Language;
  label: string;
  flag: string;
}

export const LANGUAGES: LanguageConfig[] = [
  { code: 'pl', label: 'PL', flag: 'fi-pl' },
  { code: 'en', label: 'EN', flag: 'fi-gb' },
  { code: 'de', label: 'DE', flag: 'fi-de' },
];

export type ReferenceTranslationEntry = {
  id: string;
  title: LocalizedValues;
  description: LocalizedValues;
};

export type RealisationTranslationEntry = {
  id: string;
  i18n: Record<
    Language,
    {
      title: string;
      lead: string;
      description: string;
    }
  >;
};

@Injectable({ providedIn: 'root' })
export class TranslationManagerService {
  private readonly translate = inject(TranslateService);
  private readonly router = inject(Router);
  private readonly dynamicTranslations: Record<string, Record<string, string>> = {};

  readonly languagesConfig: LanguageConfig[] = LANGUAGES;
  readonly lang = signal<Language>(
    (this.translate.getCurrentLang() || this.translate.getDefaultLang() || 'pl') as Language,
  );

  constructor() {
    this.initializeLanguageFromRoute();
  }

  initializeLanguageFromRoute(): void {
    this.router.events
      .pipe(
        filter((data) => data instanceof RoutesRecognized),
        first(),
      )
      .subscribe(async (data) => {
        this.lang.set((data.state.root.firstChild?.data['lang'] || this.lang()) as Language);
        await this.setLanguage(this.lang());
      });
  }

  private addDynamicTranslation(language: Language, key: string, value: string): void {
    if (!this.dynamicTranslations[language]) {
      this.dynamicTranslations[language] = {};
    }

    this.dynamicTranslations[language][key] = value;

    const defaultLanguage = (this.translate.getCurrentLang() || 'pl') as Language;
    if (language === defaultLanguage) {
      this.translate.setTranslation(language, { [key]: value }, true);
    }
  }

  registerReferenceTranslations(entries: ReferenceTranslationEntry[]): void {
    entries.forEach((entry) => {
      const titleKey = `reference.${entry.id}.title`;
      const descriptionKey = `reference.${entry.id}.description`;

      Object.entries(entry.title).forEach(([lang, title]) => {
        this.addDynamicTranslation(lang as Language, titleKey, title);
      });

      Object.entries(entry.description).forEach(([lang, description]) => {
        this.addDynamicTranslation(lang as Language, descriptionKey, description);
      });
    });
  }

  registerRealisationsTranslations(entries: RealisationTranslationEntry[]): void {
    entries.forEach((entry) => {
      Object.entries(entry.i18n).forEach(([lang, translation]) => {
        const language = lang as Language;
        this.addDynamicTranslation(language, `realisations.${entry.id}.title`, translation.title);
        this.addDynamicTranslation(language, `realisations.${entry.id}.lead`, translation.lead);
        this.addDynamicTranslation(
          language,
          `realisations.${entry.id}.description`,
          translation.description,
        );
      });
    });
  }

  async setLanguage(newLanguage: Language): Promise<void> {
    this.lang.set(newLanguage);
    await firstValueFrom(this.translate.use(newLanguage));

    const translations = this.dynamicTranslations[newLanguage];
    if (!translations) {
      return;
    }

    this.translate.setTranslation(newLanguage, translations, true);
  }
}
