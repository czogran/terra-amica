import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-realisations-details-meta',
  templateUrl: './realisations-details-meta.component.html',
  styleUrl: './realisations-details-meta.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslatePipe],
})
export class RealisationsDetailsMetaComponent {
  region = input.required<string>();
  years = input.required<string>();
  area = input.required<string>();
}
