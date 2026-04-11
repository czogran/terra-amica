import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';

@Component({
  selector: 'app-scroll-top-button',
  template: `
    @if (showScrollTop()) {
      <button
        class="scroll-top-btn"
        type="button"
        (click)="scrollToTop()"
        aria-label="Scroll to top"
      >
        ↑
      </button>
    }
  `,
  styleUrl: './scroll-top-button.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScrollTopButtonComponent {
  private readonly destroyRef = inject(DestroyRef);

  readonly showScrollTop = signal(false);

  constructor() {
    if (typeof window === 'undefined') return;

    const onScroll = () => {
      this.showScrollTop.set(window.scrollY > 100);
    };

    window.addEventListener('scroll', onScroll);
    onScroll();

    this.destroyRef.onDestroy(() => {
      window.removeEventListener('scroll', onScroll);
    });
  }

  scrollToTop(): void {
    if (typeof window === 'undefined') return;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
