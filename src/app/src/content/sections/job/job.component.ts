import {
  ChangeDetectionStrategy,
  Component,
  computed,
  signal,
  inject,
  OnInit,
} from '@angular/core';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { SectionHeaderComponent } from '../shared/section-header.component';
import { JobModalComponent } from './job-modal.component';
import type { Job } from './job.types';

@Component({
  selector: 'app-job',
  imports: [TranslatePipe, SectionHeaderComponent, JobModalComponent],
  templateUrl: './job.component.html',
  styleUrls: ['./job.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JobComponent implements OnInit {
  private translate = inject(TranslateService);
  jobs = signal<Job[]>([]);
  lang = computed(() => this.translate.currentLang || this.translate.defaultLang || 'en');
  selectedJob = signal<Job | null>(null);
  loading = signal(true);

  async ngOnInit() {
    // Dynamically load job file list from manifest
    let files: string[] = [];
    try {
      const res = await fetch('assets/jobs/index.json');
      files = await res.json();
    } catch (e) {
      // fallback: no jobs
      files = [];
    }
    const lang = this.lang();
    const allJobs: Job[] = [];
    for (const file of files) {
      try {
        const res = await fetch(`assets/jobs/${file}`);
        const data = await res.json();
        const found = data.find((j: any) => j.language === lang);
        if (found) allJobs.push({ title: found.title, description: found.description });
      } catch (e) {
        // ignore
      }
    }
    this.jobs.set(allJobs);
    this.loading.set(false);
  }

  openJob(job: Job) {
    this.selectedJob.set(job);
  }

  closeJob() {
    this.selectedJob.set(null);
  }
}
