import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { environment } from 'src/environments/environment';
import { MenuItemWithHref, MenuState } from '../state/state-menu';
import { HeaderContactComponent } from './header-contact.component';
import { HeaderLogoComponent } from './header-logo.component';
import { HeaderSettingsComponent } from './header-settings/settings.component';

@Component({
  selector: 'app-header',
  imports: [HeaderSettingsComponent, HeaderContactComponent, HeaderLogoComponent, TranslatePipe],
  styleUrls: ['./header.component.scss'],
  templateUrl: './header.component.html',
  providers: [],
})
export class HeaderComponent {
  readonly menuState = inject(MenuState);
  readonly router = inject(Router);
  readonly translate = inject(TranslateService);

  currentHref = environment.href;
  get activeMenuItemKey(): string | null {
    return this.menuState.activeMenuItemKey();
  }

  onNavClick(item: MenuItemWithHref): void {
    const lang = this.translate.getCurrentLang();
    const path = item.urls[lang].url;
    this.menuState.setActiveMenuItemKey(item.key);

    void this.router.navigate([lang, path]);
  }
}
