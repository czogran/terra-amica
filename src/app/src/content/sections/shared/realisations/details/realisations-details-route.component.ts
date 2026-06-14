import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { SectionHeaderComponent } from '../../section-header.component';

@Component({
  selector: 'app-realisations-details-route',
  template: `
    <app-section-header
      [title]="'menu.realisations' | translate"
      [subtitle]="'realisations.intro' | translate"
    />
    <router-outlet />
  `,
  imports: [RouterOutlet, SectionHeaderComponent, TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RealisationsDetailsRouteComponent {}
