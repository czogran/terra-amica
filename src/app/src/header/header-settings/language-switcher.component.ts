import { Component, inject } from '@angular/core';
import { Language } from '@ngx-translate/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { MenuState } from '../../state/state-menu';
import { Title } from '@angular/platform-browser';
import { TranslationManagerService } from '../../state/translation-manager.service';

@Component({
  selector: 'app-language-switcher',
  template: `
    <div class="dropdown">
      <button
        class="btn btn-sm dropdown-toggle d-flex align-items-center gap-1"
        type="button"
        id="langDropdown"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        <span class="fi" [class]="selectedLang().flag"></span>
        <span class="d-none d-md-inline">{{ selectedLang().label }}</span>
      </button>
      <ul class="dropdown-menu" aria-labelledby="langDropdown">
        @for (l of languages; track l.code) {
          <li>
            <button
              class="dropdown-item d-flex align-items-center gap-2"
              type="button"
              (click)="setLang(l.code)"
            >
              <span class="fi" [class]="l.flag"></span> {{ l.label }}
            </button>
          </li>
        }
      </ul>
    </div>
  `,
})
export class LanguageSwitcherComponent {
  private readonly location = inject(Location);
  private readonly router = inject(Router);
  private readonly titleService = inject(Title);
  readonly translationManager = inject(TranslationManagerService);
  readonly menuState = inject(MenuState);

  readonly languages = this.translationManager.languagesConfig;

  selectedLang = () =>
    this.languages.find((l) => l.code === this.translationManager.lang()) ?? this.languages[0];

  async setLang(lang: Language): Promise<void> {
    const currentLang = this.translationManager.lang();
    await this.translationManager.setLanguage(lang);

    const activeMenuItemKey = this.menuState.activeMenuItemKey();
    const activeMenuItem = this.menuState.menuItems().find((m) => m.key === activeMenuItemKey);
    const urlConfig = activeMenuItem?.urls[lang];
    const currentUrlConfig = activeMenuItem?.urls[currentLang];

    if (!urlConfig) {
      return;
    }

    const tree = this.router.parseUrl(this.router.url);
    const currentSegments =
      tree.root.children['primary']?.segments.map((segment) => segment.path) ?? [];

    let nextSegments: string[];
    if (
      currentSegments.length >= 2 &&
      currentUrlConfig &&
      currentSegments[0] === currentLang &&
      currentSegments[1] === currentUrlConfig.url
    ) {
      nextSegments = [lang, urlConfig.url, ...currentSegments.slice(2)];
    } else {
      nextSegments = [lang, urlConfig.url];
    }

    const query = new URLSearchParams();
    Object.entries(tree.queryParams).forEach(([key, value]) => {
      if (value == null) {
        return;
      }

      if (Array.isArray(value)) {
        value.forEach((item) => query.append(key, `${item}`));
        return;
      }

      query.set(key, `${value}`);
    });

    const queryString = query.toString();
    const fragment = tree.fragment ? `#${tree.fragment}` : '';
    const targetUrl = `/${nextSegments.join('/')}${queryString ? `?${queryString}` : ''}${fragment}`;

    this.location.replaceState(targetUrl);
    this.titleService.setTitle(urlConfig.title || 'Company website');
  }
}
