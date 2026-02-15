import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-mode-switcher',
  template: `
    <button class="btn btn-link" title="Toggle light/dark mode" (click)="toggleMode()">
      <i class="bi" [class]="icon()"></i>
    </button>
  `,
})
export class ModeSwitcherComponent {
  private document = inject(DOCUMENT);
  readonly mode = signal<'light' | 'dark'>(
    this.document.defaultView?.localStorage?.getItem('theme-mode') === 'dark' ? 'dark' : 'light',
  );
  readonly icon = computed(() => (this.mode() === 'light' ? 'bi-moon' : 'bi-sun'));

  toggleMode() {
    this.mode.update((m) => (m === 'light' ? 'dark' : 'light'));
    this.document.defaultView?.localStorage.setItem('theme-mode', this.mode());
    document.documentElement.setAttribute('data-bs-theme', this.mode());
  }
}
