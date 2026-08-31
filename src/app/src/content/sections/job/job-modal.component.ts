import { ChangeDetectionStrategy, Component } from '@angular/core';
import { input, output } from '@angular/core';
import type { Job } from './job.types';

@Component({
  selector: 'app-job-modal',
  templateUrl: './job-modal.component.html',
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
