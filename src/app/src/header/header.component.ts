import { Component, ElementRef, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { environment } from 'src/environments/environment';
import { MenuItemWithHref, MenuState } from '../state/state-menu';
import { HeaderContactComponent } from './header-contact.component';
import { HeaderLogoComponent } from './header-logo.component';
import { HeaderSettingsComponent } from './header-settings/settings.component';
import { RouteProgressBarComponent } from './route-progress-bar.component';

@Component({
  selector: 'app-header',
  imports: [
    HeaderSettingsComponent,
    HeaderContactComponent,
    HeaderLogoComponent,
    RouteProgressBarComponent,
    TranslatePipe,
  ],
  styleUrls: ['./header.component.scss'],
  templateUrl: './header.component.html',
  host: {
    '(document:click)': 'onDocumentClick($event)',
    '(document:keydown.escape)': 'closeMobileMenu()',
  },
  providers: [],
})
export class HeaderComponent {
  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);

  readonly menuState = inject(MenuState);
  readonly router = inject(Router);
  readonly translate = inject(TranslateService);

  readonly mobileMenuOpen = signal(false);

  currentHref = environment.href;
  get activeMenuItemKey(): string | null {
    return this.menuState.activeMenuItemKey();
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen.update((open) => !open);
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen.set(false);
  }

  onDocumentClick(event: MouseEvent): void {
    if (!this.mobileMenuOpen()) {
      return;
    }

    const target = event.target;
    if (target instanceof Node && !this.elementRef.nativeElement.contains(target)) {
      this.closeMobileMenu();
    }
  }

  onNavClick(item: MenuItemWithHref): void {
    const lang = this.translate.getCurrentLang();
    const path = item.urls[lang].url;
    this.menuState.setActiveMenuItemKey(item.key);
    this.closeMobileMenu();

    void this.router.navigate([lang, path]);
  }
}
