import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-realisations-details-phases',
  templateUrl: './realisations-details-phases.component.html',
  styleUrl: './realisations-details-phases.component.scss',
  imports: [TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RealisationsDetailsPhasesComponent {
  activePhase = input.required<number>();
  phaseSelected = output<number>();

  protected selectPhase(phaseNumber: number): void {
    this.phaseSelected.emit(phaseNumber);
  }
}
