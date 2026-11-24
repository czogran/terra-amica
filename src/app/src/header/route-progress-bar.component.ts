import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router,
} from '@angular/router';

/**
 * Slim, indeterminate progress bar shown under the navigation during
 * client-side route changes. The initial page load is covered by the
 * bootstrap spinner in index.html instead.
 */
@Component({
  selector: 'app-route-progress-bar',
  template: `
    <div class="route-progress" [class.route-progress--visible]="visible()" aria-hidden="true">
      <span class="route-progress__bar" [style.transform]="'scaleX(' + progress() + ')'"></span>
    </div>
  `,
  styleUrl: './route-progress-bar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RouteProgressBarComponent {
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly visible = signal(false);
  protected readonly progress = signal(0);

  private timers: ReturnType<typeof setTimeout>[] = [];
  private navigating = false;

  constructor() {
    this.router.events.pipe(takeUntilDestroyed()).subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.start();
      } else if (event instanceof NavigationEnd) {
        this.finish();
      } else if (event instanceof NavigationCancel || event instanceof NavigationError) {
        this.stop();
      }
    });

    this.destroyRef.onDestroy(() => this.clearTimers());
  }

  private start(): void {
    this.navigating = true;
    this.clearTimers();
    this.progress.set(0.06);
    this.visible.set(true);

    this.schedule(120, () => this.progress.set(0.3));
    this.schedule(320, () => this.progress.set(0.55));
    this.schedule(650, () => this.progress.set(0.78));
  }

  private finish(): void {
    if (!this.navigating) {
      return;
    }

    this.navigating = false;
    this.clearTimers();
    this.progress.set(1);

    this.schedule(220, () => {
      this.visible.set(false);
      this.schedule(250, () => {
        if (!this.visible()) {
          this.progress.set(0);
        }
      });
    });
  }

  private stop(): void {
    if (!this.navigating) {
      return;
    }

    this.navigating = false;
    this.clearTimers();
    this.visible.set(false);
    this.progress.set(0);
  }

  private schedule(ms: number, callback: () => void): void {
    this.timers.push(setTimeout(callback, ms));
  }

  private clearTimers(): void {
    this.timers.forEach((timer) => clearTimeout(timer));
    this.timers = [];
  }
}
