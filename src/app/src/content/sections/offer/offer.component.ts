import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { SectionHeaderComponent } from '../shared/section-header.component';
import { TranslatePipe } from '@ngx-translate/core';
import { OfferState } from '../../../state/state-offer';

@Component({
  selector: 'app-offer',
  templateUrl: './offer.component.html',
  styleUrls: ['./offer.component.scss'],
  imports: [SectionHeaderComponent, TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OfferComponent {
  private readonly offerState = inject(OfferState);

  services = computed(() => this.offerState.currentOffer().services);
  paragraphs = computed(() => this.offerState.currentOffer().paragraphs);

  constructor() {
    this.offerState.load();
  }
}
