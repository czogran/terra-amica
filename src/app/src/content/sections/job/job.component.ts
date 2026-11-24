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
import type { Job } from './job.types';
import { ContactState } from '../../../state/state-contact';

@Component({
  selector: 'app-job',
  imports: [TranslatePipe, SectionHeaderComponent],
  templateUrl: './job.component.html',
  styleUrls: ['./job.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JobComponent implements OnInit {
  private translate = inject(TranslateService);
  readonly contactState = inject(ContactState);

  jobs = signal<Job[]>([]);
  lang = computed(() => this.translate.currentLang || this.translate.defaultLang || 'en');
  loading = signal(true);

  constructor() {
    void this.contactState.loadContactAsset();
  }

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
}
