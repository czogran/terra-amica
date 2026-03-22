import { ChangeDetectionStrategy, Component } from '@angular/core';
import { input, output } from '@angular/core';
import type { Job } from './job.types';

@Component({
  selector: 'app-job-modal',
  template: `
    <div
      class="modal show d-block job-modal-backdrop"
      tabindex="-1"
      role="dialog"
      aria-modal="true"
      aria-labelledby="job-modal-title"
      (click)="requestClose()"
    >
      <div
        class="modal-dialog modal-dialog-centered fade-in"
        role="document"
        (click)="$event.stopPropagation()"
      >
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="job-modal-title">{{ job().title }}</h5>
            <button
              type="button"
              class="btn-close"
              aria-label="Close"
              (click)="requestClose()"
            ></button>
          </div>
          <div class="modal-body">
            <p>{{ job().description }}</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrl: './job-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JobModalComponent {
  job = input.required<Job>();
  close = output<void>();

  requestClose() {
    this.close.emit();
  }
}
