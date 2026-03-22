import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  ViewChild,
  effect,
  input,
  output,
  signal,
} from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { ReferenceItem } from 'src/app/src/state/state-reference';
import { ReferenceZoomControlsComponent } from './reference-zoom-controls.component';

@Component({
  selector: 'app-reference-popup',
  templateUrl: './reference-popup.component.html',
  styleUrl: './reference-popup.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgOptimizedImage, TranslatePipe, ReferenceZoomControlsComponent],
  host: {
    tabindex: '-1',
    role: 'dialog',
    'aria-modal': 'true',
    'aria-labelledby': 'reference-popup-title',
    'aria-describedby': 'reference-popup-caption',
  },
})
export class ReferencePopupComponent {
  reference = input.required<ReferenceItem>();
  @ViewChild('popupCaption')
  popupCaption?: ElementRef<HTMLDivElement>;
  @ViewChild('imageWrapper')
  imageWrapper?: ElementRef<HTMLDivElement>;

  readonly isCaptionOverflowed = signal(false);
  readonly isImageDragging = signal(false);
  readonly zoomLevel = signal(100);
  private readonly minZoom = 100;
  private readonly maxZoom = 300;
  private readonly zoomStep = 25;
  private dragStartX = 0;
  private dragStartY = 0;
  private dragScrollLeft = 0;
  private dragScrollTop = 0;
  private dragTargetScrollLeft = 0;
  private dragTargetScrollTop = 0;
  private dragAnimationFrameId: number | null = null;

  private readonly updateOverflowEffect = effect(() => {
    this.reference();
    this.zoomLevel.set(this.minZoom);
    this.isImageDragging.set(false);
    // queueMicrotask(() => this.updateCaptionOverflow());
  });

  private mutationObserver?: MutationObserver;

  ngAfterViewInit(): void {
    const caption = this.popupCaption?.nativeElement;
    if (!caption || typeof MutationObserver === 'undefined') {
      return;
    }

    this.mutationObserver = new MutationObserver(() => {
      this.updateCaptionOverflow();
    });

    this.mutationObserver.observe(caption, {
      childList: true,
      subtree: true,
      characterData: true,
    });

    this.updateCaptionOverflow();
  }

  private updateCaptionOverflow(): void {
    const caption = this.popupCaption?.nativeElement;
    if (!caption) {
      return;
    }

    const isOverflowed =
      caption.scrollHeight > caption.clientHeight || caption.scrollWidth > caption.clientWidth;
    this.isCaptionOverflowed.set(isOverflowed);
  }

  zoomIn(): void {
    if (this.zoomLevel() < this.maxZoom) {
      this.zoomLevel.update((level) => level + this.zoomStep);
    }
  }

  zoomOut(): void {
    if (this.zoomLevel() > this.minZoom) {
      this.zoomLevel.update((level) => level - this.zoomStep);
    }
  }

  resetZoom(): void {
    this.zoomLevel.set(this.minZoom);
  }

  onImageDragStart(event: MouseEvent): void {
    const wrapper = this.imageWrapper?.nativeElement;
    if (!wrapper || event.button !== 0) {
      return;
    }

    this.isImageDragging.set(true);
    this.dragStartX = event.clientX;
    this.dragStartY = event.clientY;
    this.dragScrollLeft = wrapper.scrollLeft;
    this.dragScrollTop = wrapper.scrollTop;
    event.preventDefault();
  }

  onImageDragMove(event: MouseEvent): void {
    if (!this.isImageDragging()) {
      return;
    }

    const deltaX = event.clientX - this.dragStartX;
    const deltaY = event.clientY - this.dragStartY;

    this.dragTargetScrollLeft = this.dragScrollLeft - deltaX;
    this.dragTargetScrollTop = this.dragScrollTop - deltaY;

    if (this.dragAnimationFrameId !== null) {
      return;
    }

    this.dragAnimationFrameId = requestAnimationFrame(() => {
      const wrapper = this.imageWrapper?.nativeElement;
      if (!wrapper || !this.isImageDragging()) {
        this.dragAnimationFrameId = null;
        return;
      }

      wrapper.scrollLeft = this.dragTargetScrollLeft;
      wrapper.scrollTop = this.dragTargetScrollTop;
      this.dragAnimationFrameId = null;
    });
  }

  onImageDragEnd(): void {
    if (!this.isImageDragging()) {
      return;
    }

    if (this.dragAnimationFrameId !== null) {
      cancelAnimationFrame(this.dragAnimationFrameId);
      this.dragAnimationFrameId = null;
    }

    this.isImageDragging.set(false);
  }

  close = output<void>();
  previous = output<void>();
  next = output<void>();
}
