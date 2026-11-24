import { ChangeDetectionStrategy, Component, ElementRef, inject, signal } from '@angular/core';
import { ModeSwitcherComponent } from './mode-switcher.component';
import { LanguageSwitcherComponent } from './language-switcher.component';

@Component({
  selector: 'app-header-settings',
  imports: [LanguageSwitcherComponent, ModeSwitcherComponent],
  template: `
    <div class="d-none d-lg-flex align-items-center gap-3">
      <app-language-switcher />
      <app-mode-switcher />
    </div>
    <div class="d-lg-none position-relative">
      <button
        class="btn btn-link"
        title="Settings"
        type="button"
        aria-haspopup="true"
        [attr.aria-expanded]="showSettings()"
        (click)="toggleSettings()"
      >
        <i class="bi bi-gear"></i>
      </button>
      @if (showSettings()) {
        <div
          class="dropdown-menu dropdown-menu-end show p-2"
          style="position: absolute; right: 0; top: 100%; min-width: 200px;"
        >
          <app-language-switcher [inline]="true" />
          <app-mode-switcher />
        </div>
      }
    </div>
  `,
  host: {
    '(document:click)': 'onDocumentClick($event)',
    '(document:keydown.escape)': 'closeSettings()',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderSettingsComponent {
  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);

  readonly showSettings = signal(false);

  toggleSettings(): void {
    this.showSettings.update((visible) => !visible);
  }

  closeSettings(): void {
    this.showSettings.set(false);
  }

  onDocumentClick(event: MouseEvent): void {
    if (!this.showSettings()) {
      return;
    }

    const target = event.target;
    if (target instanceof Node && !this.elementRef.nativeElement.contains(target)) {
      this.closeSettings();
    }
  }
}
