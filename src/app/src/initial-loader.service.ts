import { Injectable } from '@angular/core';

type InitialLoaderState = {
  start: number;
  shownAt: number | null;
  ready: boolean;
};

/**
 * Releases the pre-bootstrap loader that lives in index.html once the app is
 * actually ready (translations + initial route rendered).
 *
 * The loader itself is revealed by the inline script in index.html only after
 * one second of loading, and is kept visible for at least two seconds so the
 * brand animation never flashes.
 */
@Injectable({ providedIn: 'root' })
export class InitialLoaderService {
  private static readonly minimumVisibleMs = 2000;

  markReady(): void {
    if (typeof document === 'undefined' || typeof window === 'undefined') {
      return;
    }

    const loader = document.getElementById('ta-bootstrap-loader');
    const state = (window as Window & { __taInitialLoader?: InitialLoaderState })
      .__taInitialLoader;

    if (!loader || !state || state.ready) {
      return;
    }

    state.ready = true;

    // If the loader never became visible, the inline timer will skip it.
    if (state.shownAt === null) {
      loader.remove();
      return;
    }

    const visibleFor = performance.now() - state.shownAt;
    const remaining = Math.max(0, InitialLoaderService.minimumVisibleMs - visibleFor);

    setTimeout(() => {
      loader.classList.add('ta-bootstrap-loader--hidden');
      setTimeout(() => loader.remove(), 320);
    }, remaining);
  }
}
