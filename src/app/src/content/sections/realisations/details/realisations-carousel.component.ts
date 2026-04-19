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
  constructor() {
    effect(() => {
      // Reset to first image when images input changes
      this.images();
      this.activeIndex.set(0);
    });
  }
  private static readonly fullscreenAnimationMs = 240;

  @ViewChild('fullscreenCloseButton')
  fullscreenCloseButton?: ElementRef<HTMLButtonElement>;

  @ViewChild('carouselEl')
  carouselEl?: ElementRef<HTMLElement>;

  images = input.required<ReadonlyArray<string>>();
  alt = input.required<string>();

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
