import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { RealisationPhaseIcon, RealisationPhaseTranslation } from 'src/app/src/state/state-realisations.contract';

export type RealisationPhaseViewModel = {
  number: number;
  icon: RealisationPhaseIcon;
  translation: RealisationPhaseTranslation;
};

@Component({
  selector: 'app-realisations-details-phases',
  templateUrl: './realisations-details-phases.component.html',
  styleUrl: './realisations-details-phases.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RealisationsDetailsPhasesComponent {
  activePhase = input.required<number>();
  phases = input.required<ReadonlyArray<RealisationPhaseViewModel>>();
  phaseSelected = output<number>();

  protected selectPhase(phaseNumber: number): void {
    this.phaseSelected.emit(phaseNumber);
  }
}
