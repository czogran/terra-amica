import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { input, output } from '@angular/core';

@Component({
  selector: 'app-reference-zoom-controls',
  imports: [TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'reference-zoom-controls',
  },
  template: `
    <button
      type="button"
      class="btn btn-sm btn-outline-secondary"
      (click)="zoomOutRequested.emit()"
      [disabled]="zoomLevel() === minZoom()"
      aria-label="Zoom out"
    >
      −
    </button>
    <span class="reference-zoom-level">{{ zoomLevel() }}%</span>
    <button
      type="button"
      class="btn btn-sm btn-outline-secondary"
      (click)="zoomInRequested.emit()"
      [disabled]="zoomLevel() === maxZoom()"
      aria-label="Zoom in"
    >
      +
    </button>
    <button
      type="button"
      class="btn btn-sm btn-outline-secondary"
      (click)="resetRequested.emit()"
      [disabled]="zoomLevel() === minZoom()"
      [attr.aria-label]="'reference.zoom.reset' | translate"
    >
      {{ 'reference.zoom.reset' | translate }}
    </button>
  `,
})
export class ReferenceZoomControlsComponent {
  readonly zoomLevel = input.required<number>();
  readonly minZoom = input(100);
  readonly maxZoom = input(300);

  readonly zoomInRequested = output<void>();
  readonly zoomOutRequested = output<void>();
  readonly resetRequested = output<void>();
}
