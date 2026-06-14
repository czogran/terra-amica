import { Component } from '@angular/core';
import { RealisationsState } from 'src/app/src/state/state-realisations';
import { REALISATIONS_STATE_TOKEN, RealisationsComponent } from '../shared/realisations/realisations.component';

@Component({
  selector: 'app-past-realisations',
  template: '<app-realisations />',
  imports: [RealisationsComponent],
  providers: [{ provide: REALISATIONS_STATE_TOKEN, useExisting: RealisationsState }],
})
export class PastRealisationsComponent {}
