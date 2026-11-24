import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  Directive,
  ElementRef,
  OnDestroy,
  PLATFORM_ID,
  inject,
  signal,
} from '@angular/core';

const OVERLAY_FADE_MS = 400;
const MIN_VISIBLE_MS = 300;

/**
 * Shows a shimmering skeleton over the image until its bitmap has loaded, then
 * smoothly fades the skeleton away to reveal the image.
 *
 * Works with `NgOptimizedImage`: when the resolved `src` changes (e.g. the
 * carousel switching to the original image in fullscreen), the skeleton is
 * shown again until the new source finishes loading.
 */
@Directive({
  selector: 'img[appImageSkeleton]',
  host: {
    '[class.image-skeleton]': '!loaded()',
  },
})
export class ImageSkeletonDirective implements AfterViewInit, OnDestroy {
  private readonly image = inject<ElementRef<HTMLImageElement>>(ElementRef);
  private readonly document = inject(DOCUMENT);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  protected readonly loaded = signal(false);

  private overlay: HTMLElement | null = null;
  private removalTimer: ReturnType<typeof setTimeout> | null = null;
  private hideTimer: ReturnType<typeof setTimeout> | null = null;
  private overlayShownAt = 0;
  private positionFrame: number | null = null;
  private resizeObserver?: ResizeObserver;
  private mutationObserver?: MutationObserver;

  private readonly onLoad = (): void => {
    this.loaded.set(true);
    this.hideOverlay();
  };

  private readonly onError = (): void => {
    // Reveal whatever the browser shows for a failed image instead of shimmering forever.
    this.loaded.set(true);
    this.hideOverlay();
  };

  ngAfterViewInit(): void {
    const image = this.image.nativeElement;
    image.addEventListener('load', this.onLoad);
    image.addEventListener('error', this.onError);

    if (!this.isBrowser) {
      return;
    }

    this.mutationObserver = new MutationObserver((mutations) => {
      const sourceChanged = mutations.some(
        (mutation) =>
          mutation.oldValue !== image.getAttribute(mutation.attributeName ?? ''),
      );
      if (sourceChanged) {
        this.reset();
      }
    });
    this.mutationObserver.observe(image, {
      attributes: true,
      attributeFilter: ['src', 'srcset'],
      attributeOldValue: true,
    });

    if (this.isImageComplete()) {
      this.loaded.set(true);
      return;
    }

    this.createOverlay();

    if (typeof ResizeObserver !== 'undefined') {
      this.resizeObserver = new ResizeObserver(() => this.schedulePositionUpdate());
      this.resizeObserver.observe(image);
      if (image.parentElement) {
        this.resizeObserver.observe(image.parentElement);
      }
    }
  }

  ngOnDestroy(): void {
    const image = this.image.nativeElement;
    image.removeEventListener('load', this.onLoad);
    image.removeEventListener('error', this.onError);
    this.mutationObserver?.disconnect();
    this.resizeObserver?.disconnect();
    this.clearRemovalTimer();
    this.clearHideTimer();

    if (this.positionFrame !== null && typeof cancelAnimationFrame !== 'undefined') {
      cancelAnimationFrame(this.positionFrame);
      this.positionFrame = null;
    }

    this.removeOverlay();
  }

  private reset(): void {
    this.loaded.set(false);
    this.clearRemoveAndHideTimers();
    this.removeOverlay();
    this.createOverlay();
  }

  private createOverlay(): void {
    if (this.overlay || typeof this.document === 'undefined') {
      return;
    }

    const image = this.image.nativeElement;
    const parent = image.parentElement;
    if (!parent) {
      return;
    }

    // The overlay is positioned relative to the direct parent.
    if (typeof getComputedStyle !== 'undefined' && getComputedStyle(parent).position === 'static') {
      parent.classList.add('image-skeleton-host');
    }

    const overlay = this.document.createElement('span');
    overlay.className = 'image-skeleton-overlay';
    overlay.setAttribute('aria-hidden', 'true');
    parent.insertBefore(overlay, image);
    this.overlay = overlay;
    this.overlayShownAt = Date.now();
    this.positionOverlay();
  }

  private hideOverlay(): void {
    const overlay = this.overlay;
    if (!overlay || this.hideTimer !== null || overlay.classList.contains('image-skeleton-overlay--hidden')) {
      return;
    }

    const elapsed = this.overlayShownAt === 0 ? MIN_VISIBLE_MS : Date.now() - this.overlayShownAt;
    const remaining = Math.max(0, MIN_VISIBLE_MS - elapsed);

    if (remaining === 0) {
      this.fadeOutOverlay(overlay);
      return;
    }

    // Keep the shimmer visible long enough to be perceived even on fast loads.
    this.hideTimer = setTimeout(() => {
      this.hideTimer = null;
      if (this.overlay === overlay) {
        this.fadeOutOverlay(overlay);
      }
    }, remaining);
  }

  private fadeOutOverlay(overlay: HTMLElement): void {
    this.clearRemovalTimer();
    overlay.classList.add('image-skeleton-overlay--hidden');

    this.removalTimer = setTimeout(() => {
      overlay.remove();
      if (this.overlay === overlay) {
        this.overlay = null;
      }
      this.removalTimer = null;
    }, OVERLAY_FADE_MS);
  }

  private removeOverlay(): void {
    this.overlay?.remove();
    this.overlay = null;
  }

  private clearRemovalTimer(): void {
    if (this.removalTimer !== null) {
      clearTimeout(this.removalTimer);
      this.removalTimer = null;
    }
  }

  private clearHideTimer(): void {
    if (this.hideTimer !== null) {
      clearTimeout(this.hideTimer);
      this.hideTimer = null;
    }
  }

  private clearRemoveAndHideTimers(): void {
    this.clearRemovalTimer();
    this.clearHideTimer();
  }

  private schedulePositionUpdate(): void {
    if (this.positionFrame !== null) {
      return;
    }

    if (typeof requestAnimationFrame === 'undefined') {
      this.positionOverlay();
      return;
    }

    this.positionFrame = requestAnimationFrame(() => {
      this.positionFrame = null;
      this.positionOverlay();
    });
  }

  private positionOverlay(): void {
    const overlay = this.overlay;
    if (!overlay) {
      return;
    }

    const image = this.image.nativeElement;
    overlay.style.top = `${image.offsetTop}px`;
    overlay.style.left = `${image.offsetLeft}px`;
    overlay.style.width = `${image.offsetWidth}px`;
    overlay.style.height = `${image.offsetHeight}px`;
    overlay.style.borderRadius = getComputedStyle(image).borderRadius;
  }

  private isImageComplete(): boolean {
    const image = this.image.nativeElement;
    return Boolean(image.complete && image.naturalWidth > 0);
  }
}
