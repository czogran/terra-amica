import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { CurrentRealisationsState } from 'src/app/src/state/state-current-realisations';
import { RealisationsState } from 'src/app/src/state/state-realisations';
import type { RealisationsStateContract } from 'src/app/src/state/state-realisations.contract';
import { REALISATIONS_STATE_TOKEN } from '../realisations.component';
import { SectionHeaderComponent } from '../../section-header.component';

type RealisationsRouteHeader = {
  titleKey: string;
  subtitleKey: string;
};

const REALISATIONS_ROUTE_HEADERS: Record<string, RealisationsRouteHeader> = {
  'menu.past-realisations': {
    titleKey: 'menu.past-realisations',
    subtitleKey: 'realisations.intro',
  },
  'menu.current-realisations': {
    titleKey: 'menu.current-realisations',
    subtitleKey: 'current-realisations.intro',
  },
};

const DEFAULT_HEADER = REALISATIONS_ROUTE_HEADERS['menu.past-realisations'];

function realisationsStateFactory(): RealisationsStateContract {
  const route = inject(ActivatedRoute);

  if (route.snapshot.data['key'] === 'menu.current-realisations') {
    return inject(CurrentRealisationsState);
  }

  return inject(RealisationsState);
}

@Component({
  selector: 'app-realisations-details-route',
  template: `
    <app-section-header
      [title]="header.titleKey | translate"
      [subtitle]="header.subtitleKey | translate"
    />
    <router-outlet />
  `,
  imports: [RouterOutlet, SectionHeaderComponent, TranslatePipe],
  providers: [{ provide: REALISATIONS_STATE_TOKEN, useFactory: realisationsStateFactory }],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RealisationsDetailsRouteComponent {
  private readonly route = inject(ActivatedRoute);

  protected readonly header =
    REALISATIONS_ROUTE_HEADERS[this.route.snapshot.data['key']] ?? DEFAULT_HEADER;
}
