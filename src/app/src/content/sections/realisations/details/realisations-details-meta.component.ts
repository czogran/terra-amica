import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-realisations-details-meta',
  standalone: true,
  templateUrl: './realisations-details-meta.component.html',
  styleUrl: './realisations-details-meta.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RealisationsDetailsMetaComponent {
  region = input.required<string>();
  years = input.required<string>();
  area = input.required<string>();
}
