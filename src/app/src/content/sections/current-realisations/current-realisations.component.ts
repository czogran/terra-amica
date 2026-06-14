import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { MenuState } from 'src/app/src/state/state-menu';
import { TranslationManagerService } from 'src/app/src/state/translation-manager.service';

import { RealisationsState } from 'src/app/src/state/state-realisations';
import {
  REALISATIONS_STATE_TOKEN,
  RealisationsComponent,
} from '../shared/realisations/realisations.component';
import { CurrentRealisationsState } from 'state';
@Component({
  selector: 'app-current-realisations',
  template: '<app-realisations />',
  imports: [RealisationsComponent],
  providers: [{ provide: REALISATIONS_STATE_TOKEN, useExisting: CurrentRealisationsState }],
})
export class CurrentRealisationsComponent {}
