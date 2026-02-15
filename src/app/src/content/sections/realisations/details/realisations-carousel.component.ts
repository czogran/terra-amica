import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
  computed,
  input,
  signal,
} from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-realisations-carousel',
  standalone: true,
  templateUrl: './realisations-carousel.component.html',
  styleUrl: './realisations-carousel.component.scss',
  imports: [NgOptimizedImage, TranslatePipe],
  host: {
    '(window:keydown.escape)': 'closeFullscreen()',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RealisationsCarouselComponent implements AfterViewInit, OnDestroy {
  @ViewChild('fullscreenCloseButton')
  fullscreenCloseButton?: ElementRef<HTMLButtonElement>;

  @ViewChild('carouselEl')
  carouselEl?: ElementRef<HTMLElement>;

  images = input.required<ReadonlyArray<string>>();
  alt = input.required<string>();

  protected readonly activeIndex = signal(0);
  protected readonly activeImage = computed(
    () => this.images()[this.activeIndex()] ?? this.images()[0] ?? '',
  );

  protected readonly fullscreenImage = signal<string | null>(null);
  private previousFocusedElement: HTMLElement | null = null;
  private readonly slidListener = (event: Event): void => {
    const carousel = event as CustomEvent<{ to: number }>;
    if (typeof carousel.detail?.to === 'number') {
      this.activeIndex.set(carousel.detail.to);
    }
  };

  ngAfterViewInit(): void {
    this.carouselEl?.nativeElement.addEventListener('slid.bs.carousel', this.slidListener);
  }

  ngOnDestroy(): void {
    this.carouselEl?.nativeElement.removeEventListener('slid.bs.carousel', this.slidListener);
  }

  openFullscreen(image: string): void {
    this.popupOpen();

    this.previousFocusedElement =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;

    this.fullscreenImage.set(image);

    requestAnimationFrame(() => {
      this.fullscreenCloseButton?.nativeElement.focus();
    });
  }

  closeFullscreen(): void {
    if (!this.fullscreenImage()) {
      return;
    }

    this.popupClose();
    this.fullscreenImage.set(null);

    requestAnimationFrame(() => {
      this.previousFocusedElement?.focus();
      this.previousFocusedElement = null;
    });
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
