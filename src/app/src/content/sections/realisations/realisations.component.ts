import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  computed,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NgOptimizedImage } from '@angular/common';
import { Router } from '@angular/router';
import { SectionHeaderComponent } from '../shared/section-header.component';
import { LangChangeEvent, TranslatePipe, TranslateService } from '@ngx-translate/core';
import {
  RealisationItem,
  RealisationLanguage,
  RealisationTranslation,
  RealisationsState,
} from 'src/app/src/state/state-realisations';
import { MenuState } from 'src/app/src/state/state-menu';

type RealisationCardViewModel = RealisationItem & {
  translation: RealisationTranslation;
};

@Component({
  selector: 'app-realisations',
  templateUrl: './realisations.component.html',
  styleUrls: ['./realisations.component.scss'],
  imports: [SectionHeaderComponent, TranslatePipe, NgOptimizedImage],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RealisationsComponent {
  private readonly destroyRef = inject(DestroyRef);
  private readonly translate = inject(TranslateService);
  private readonly router = inject(Router);
  private readonly menuState = inject(MenuState);

  protected readonly realisationsState = inject(RealisationsState);
  protected readonly currentLanguage = signal<RealisationLanguage>(this.getCurrentLanguage());

  protected readonly realisations = computed(() => this.realisationsState.realisations());
  protected readonly cards = computed<ReadonlyArray<RealisationCardViewModel>>(() =>
    this.realisations().map((item) => ({
      ...item,
      translation: item.i18n[this.currentLanguage()] ?? item.i18n.pl,
    })),
  );

  constructor() {
    void this.realisationsState.loadRealisationsAsset();
    this.translate.onLangChange
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((event: LangChangeEvent) => {
        this.currentLanguage.set(this.normalizeLanguage(event.lang));
      });
  }

  protected openDetails(slug: string): void {
    const currentLang = this.normalizeLanguage(
      this.translate.getCurrentLang() || this.translate.getDefaultLang() || 'pl',
    );
    const realisationsMenuItem = this.menuState
      .menuItems()
      .find((item) => item.key === 'menu.realisations');
    const listPath = realisationsMenuItem?.urls[currentLang]?.url ?? 'realisations';

    void this.router.navigate(['/', currentLang, listPath, slug]);
  }

  protected assetUrl(path: string): string {
    return `assets/${path}`;
  }

  private getCurrentLanguage(): RealisationLanguage {
    return this.normalizeLanguage(
      this.translate.getCurrentLang() || this.translate.getDefaultLang() || 'pl',
    );
  }

  private normalizeLanguage(lang: string): RealisationLanguage {
    if (lang === 'en' || lang === 'de') {
      return lang;
    }

    return 'pl';
  }
}
