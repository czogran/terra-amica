import { Component, inject } from '@angular/core';
import { MenuItem, MenuState } from '../state/state-menu';
import { HeaderContactComponent } from './header-contact.component';
import { LanguageSwitcherComponent } from './header-settings/language-switcher.component';
import { ModeSwitcherComponent } from './header-settings/mode-switcher.component';
import { HeaderSettingsComponent } from './header-settings/settings.component';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';
import { DOCUMENT, NgOptimizedImage } from '@angular/common';
import { environment } from 'src/environments/environment';
import { HeaderLogoComponent } from './header-logo.component';

@Component({
  selector: 'app-header',
  imports: [HeaderSettingsComponent, HeaderContactComponent, HeaderLogoComponent, TranslatePipe],
  styleUrls: ['./header.component.scss'],
  templateUrl: './header.component.html',
  providers: [],
})
export class HeaderComponent {
  readonly menuState = inject(MenuState);
  currentHref = environment.href;
  get menuItems(): MenuItem[] {
    return this.menuState.menuItems();
  }

  get activeMenuItemKey(): string | null {
    return this.menuState.activeMenuItemKey();
  }

  showSettings = false;
  toggleSettings() {
    this.showSettings = !this.showSettings;
  }
  readonly router = inject(Router);
  readonly translate = inject(TranslateService);

  onNavClick(item: MenuItem): void {
    const lang = this.translate.getCurrentLang();
    const path = item.urls[lang].url;
    this.menuState.setActiveMenuItemKey(item.key);

    void this.router.navigate([lang, path]);
  }
}
