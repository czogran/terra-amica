import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SectionHeaderComponent } from '../../shared/section-header.component';
import { TranslatePipe } from '@ngx-translate/core';

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
