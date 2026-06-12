import { effect } from '@angular/core';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  OnDestroy,
  ViewChild,
  input,
  signal,
} from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-realisations-carousel',
  templateUrl: './realisations-carousel.component.html',
  styleUrl: './realisations-carousel.component.scss',
  imports: [NgOptimizedImage, TranslatePipe],
  host: {
    '(window:keydown.escape)': 'closeFullscreen()',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RealisationsCarouselComponent implements AfterViewInit, OnDestroy {
  private static nextId = 0;

  constructor() {
    effect(() => {
      // Reset to first image when images input changes
      this.images();
      this.activeIndex.set(0);
    });

    effect(() => {
      this.isActive();
      setTimeout(() => this.syncCarouselActivity());
    });
  }
  private static readonly fullscreenAnimationMs = 240;

  @ViewChild('fullscreenCloseButton')
  fullscreenCloseButton?: ElementRef<HTMLButtonElement>;

  @ViewChild('carouselEl')
  carouselEl?: ElementRef<HTMLElement>;

  images = input.required<ReadonlyArray<string>>();
  alt = input.required<string>();
  isActive = input(true);

  protected readonly carouselId = `realisationsDetailsCarousel-${++RealisationsCarouselComponent.nextId}`;
  protected readonly activeIndex = signal(0);
  protected readonly isFullscreenOpen = signal(false);
  protected readonly isFullscreenMinimising = signal(false);
  protected readonly isFullscreenActive = computed(
    () => this.isFullscreenOpen() || this.isFullscreenMinimising(),
  );

  private previousFocusedElement: HTMLElement | null = null;
  private closeAnimationTimer: ReturnType<typeof setTimeout> | null = null;
  private readonly mainSlidListener = (event: Event): void => {
    const index = this.readSlideIndex(event);
    if (index !== null) {
      this.activeIndex.set(index);
    }
  };

  ngAfterViewInit(): void {
    this.carouselEl?.nativeElement.addEventListener('slid.bs.carousel', this.mainSlidListener);
    this.syncCarouselActivity();
  }

  ngOnDestroy(): void {
    this.carouselEl?.nativeElement.removeEventListener('slid.bs.carousel', this.mainSlidListener);
    this.clearCloseAnimationTimer();
  }

  openFullscreen(): void {
    if (this.isFullscreenActive()) {
      return;
    }

    this.clearCloseAnimationTimer();
    this.previousFocusedElement =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;

    this.popupOpen();
    this.isFullscreenOpen.set(true);

    requestAnimationFrame(() => {
      this.fullscreenCloseButton?.nativeElement.focus();
    });
  }

  closeFullscreen(): void {
    if (!this.isFullscreenOpen()) {
      return;
    }

    this.isFullscreenOpen.set(false);
    this.isFullscreenMinimising.set(true);
    this.clearCloseAnimationTimer();

    this.closeAnimationTimer = setTimeout(() => {
      this.popupClose();
      this.isFullscreenMinimising.set(false);

      requestAnimationFrame(() => {
        this.previousFocusedElement?.focus();
        this.previousFocusedElement = null;
      });
    }, RealisationsCarouselComponent.fullscreenAnimationMs);
  }

  goTo(index: number): void {
    this.activeIndex.set(index);

    if (!this.carouselEl) {
      return;
    }

    const bs = (window as any).bootstrap;
    try {
      const inst =
        bs?.Carousel?.getInstance(this.carouselEl.nativeElement) ??
        new bs.Carousel(this.carouselEl.nativeElement);
      if (inst && typeof inst.to === 'function') {
        inst.to(index);
      }
    } catch (e) {
      // ignore if bootstrap not available or call fails
    }
  }

  private clearCloseAnimationTimer(): void {
    if (this.closeAnimationTimer !== null) {
      clearTimeout(this.closeAnimationTimer);
      this.closeAnimationTimer = null;
    }
  }

  private readSlideIndex(event: Event): number | null {
    const slideEvent = event as Event & { to?: number; detail?: { to?: number } };
    const index = slideEvent.to ?? slideEvent.detail?.to;
    return typeof index === 'number' ? index : null;
  }

  private syncCarouselActivity(): void {
    if (typeof window === 'undefined' || !this.carouselEl) {
      return;
    }

    const bs = (window as any).bootstrap;
    try {
      const inst =
        bs?.Carousel?.getInstance(this.carouselEl.nativeElement) ??
        new bs.Carousel(this.carouselEl.nativeElement, {
          interval: 3000,
          pause: 'hover',
          ride: false,
        });

      if (!inst) {
        return;
      }

      if (this.isActive()) {
        inst.cycle?.();
      } else {
        inst.pause?.();
      }
    } catch (_e) {
      // Bootstrap may not be available during server-side rendering or tests.
    }
  }

  popupOpen(): void {
    if (typeof document !== 'undefined') {
      document.body.style.overflow = 'hidden';
    }
  }

  popupClose(): void {
    if (typeof document !== 'undefined') {
      document.body.style.overflow = '';
    }
  }
}
