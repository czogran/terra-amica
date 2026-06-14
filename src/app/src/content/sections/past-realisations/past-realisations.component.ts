import { Component } from '@angular/core';
import { RealisationsState } from 'src/app/src/state/state-realisations';
import {
  REALISATIONS_NAVIGATION_CONFIG_TOKEN,
  REALISATIONS_STATE_TOKEN,
  RealisationsComponent,
} from '../shared/realisations/realisations.component';

@Component({
  selector: 'app-past-realisations',
  template: '<app-realisations />',
  imports: [RealisationsComponent],
  providers: [
    { provide: REALISATIONS_STATE_TOKEN, useExisting: RealisationsState },
    {
      provide: REALISATIONS_NAVIGATION_CONFIG_TOKEN,
      useValue: { menuKey: 'menu.past-realisations', defaultPath: 'past-realisations' },
    },
  ],
})
export class PastRealisationsComponent {}
