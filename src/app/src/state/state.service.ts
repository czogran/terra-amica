import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ContactState, ContactStateValue } from './state-contact';
import { ReferenceItem, ReferenceState } from './state-reference';
import { toObservable } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { MenuState } from './state-menu';
import { TranslationManagerService } from './translation-manager.service';

export type AppState = Readonly<{
  lang: string;
  isMenuOpen: boolean;
}>;

const INITIAL_STATE: AppState = {
  lang: 'pl',
  isMenuOpen: false,
};

export type ReferenceRawState = {
  id: string;
  files: string[];
  title: {
    pl: string;
    en: string;
    de: string;
  };
  description: {
    pl: string;
    en: string;
    de: string;
  };
};

@Injectable({ providedIn: 'root' })
export class StateService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly contactState = inject(ContactState);
  private readonly referenceState = inject(ReferenceState);
  private readonly translationManager = inject(TranslationManagerService);
  private readonly router = inject(Router);
  private readonly menuState = inject(MenuState);

  constructor() {
    // Avoid SSR URL parsing errors (Node fetch requires absolute URLs)
    // if (isPlatformBrowser(this.platformId)) {
    void this.loadContactAsset();
    void this.loadReferencesAsset();
    this.setActiveMenuItemKeyFromRoute();
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => this.setActiveMenuItemKeyFromRoute());
    // }
  }

  private setActiveMenuItemKeyFromRoute(): void {
    let route = this.router.routerState.snapshot.root;

    while (route.firstChild) {
      route = route.firstChild;
    }

    const activeMenuItemKey = (route.data['key'] as string | undefined) ?? null;
    this.menuState.setActiveMenuItemKey(activeMenuItemKey);
  }

  private async loadContactAsset(): Promise<void> {
    try {
      const res = await fetch('/assets/contact/contact.json');
      if (!res.ok) return;

      const data = (await res.json()) as ContactStateValue;
      this.contactState.setContactState(data);
    } catch (_err: unknown) {
      // ignore (optional: add a user-facing fallback state)
    }
  }

  private async loadReferencesAsset(): Promise<void> {
    try {
      const res = await fetch('/assets/references/index.json');
      if (!res.ok) {
        // this.images.set([]);
        return;
      }

      const data = (await res.json()) as unknown as ReferenceRawState[];
      const state: ReferenceItem[] = data.map((item) => ({
        id: item.id,
        files: item.files,
        titleKey: `reference.${item.id}.title`,
        descriptionKey: `reference.${item.id}.description`,
      }));
      this.referenceState.setReferencesState(state);
      this.translationManager.registerReferenceTranslations(data);

      console.log(state);

      // const files = Array.isArray(json) ? json.filter(isReferenceImage) : [];
      // this.images.set(files);
    } catch {
      // this.images.set([]);
    }
  }
}
