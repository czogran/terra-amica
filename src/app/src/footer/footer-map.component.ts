import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { input } from '@angular/core';
import { SafeResourceUrl } from '@angular/platform-browser';
import { ContactState } from '../state/state-contact';

@Component({
  selector: 'app-footer-map',
  template: `
    <iframe
      width="100%"
      height="200"
      class="footer-map"
      loading="lazy"
      allowfullscreen
      referrerpolicy="no-referrer-when-downgrade"
      title="Location on Google Maps"
      [src]="contactState.safeGoogleMapsUrl()"
    ></iframe>
  `,
  styleUrl: './footer-map.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: '',
  },
})
export class FooterMapComponent {
  readonly contactState = inject(ContactState);
}
