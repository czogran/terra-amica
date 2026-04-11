import { Injectable, inject } from '@angular/core';
import { ContactState } from './state-contact';
import { ReferenceState } from './state-reference';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { MenuState } from './state-menu';

export type AppState = Readonly<{
  lang: string;
  isMenuOpen: boolean;
}>;

const INITIAL_STATE: AppState = {
  lang: 'pl',
  isMenuOpen: false,
};

@Injectable({ providedIn: 'root' })
export class StateService {
  private readonly contactState = inject(ContactState);
  private readonly referenceState = inject(ReferenceState);
  private readonly router = inject(Router);
  private readonly menuState = inject(MenuState);

  constructor() {
    // Avoid SSR URL parsing errors (Node fetch requires absolute URLs)
    // if (isPlatformBrowser(this.platformId)) {
    void this.contactState.loadContactAsset();
    void this.referenceState.loadReferencesAsset();
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
}
