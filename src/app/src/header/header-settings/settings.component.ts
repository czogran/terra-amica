import { Component } from '@angular/core';
import { ModeSwitcherComponent } from './mode-switcher.component';
import { LanguageSwitcherComponent } from './language-switcher.component';

@Component({
  selector: 'app-header-settings',
  standalone: true,
  imports: [LanguageSwitcherComponent, ModeSwitcherComponent],
  template: `
    <div class="d-none d-lg-flex align-items-center gap-3">
      <app-language-switcher />
      <app-mode-switcher />
    </div>
    <div class="d-lg-none position-relative">
      <button class="btn btn-link" title="Settings" (click)="toggleSettings()">
        <i class="bi bi-gear"></i>
      </button>
      @if (showSettings) {
        <div
          class="dropdown-menu dropdown-menu-end show p-2"
          style="position: absolute; right: 0; top: 100%; min-width: 200px;"
        >
          <app-language-switcher />
          <app-mode-switcher />
        </div>
      }
    </div>
  `,
})
export class HeaderSettingsComponent {
  showSettings = false;
  toggleSettings() {
    this.showSettings = !this.showSettings;
  }
}
