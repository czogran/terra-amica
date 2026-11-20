import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { ContactState } from '../state/state-contact';

@Component({
  selector: 'app-footer-map',
  imports: [NgOptimizedImage, TranslatePipe],
  template: `
    <a
      class="footer-map-link"
      [href]="contactState.googleMapsUrl()"
      target="_blank"
      rel="noopener noreferrer"
    >
      <img
        ngSrc="assets/contact/google-map.png"
        width="1920"
        height="600"
        class="footer-map"
        [alt]="'footer.map.alt' | translate"
      />
    </a>
  `,
  styleUrl: './footer-map.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterMapComponent {
  readonly contactState = inject(ContactState);
}
