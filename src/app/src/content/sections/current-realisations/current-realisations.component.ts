import { Component } from '@angular/core';
import { CurrentRealisationsState } from 'state';
import {
  REALISATIONS_NAVIGATION_CONFIG_TOKEN,
  REALISATIONS_STATE_TOKEN,
  RealisationsComponent,
} from '../shared/realisations/realisations.component';

@Component({
  selector: 'app-current-realisations',
  template: '<app-realisations />',
  imports: [RealisationsComponent],
  providers: [
    { provide: REALISATIONS_STATE_TOKEN, useExisting: CurrentRealisationsState },
    {
      provide: REALISATIONS_NAVIGATION_CONFIG_TOKEN,
      useValue: { menuKey: 'menu.current-realisations', defaultPath: 'current-realisations' },
    },
  ],
})
export class CurrentRealisationsComponent {}
