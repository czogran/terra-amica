import { ChangeDetectionStrategy, Component } from '@angular/core';
import { input } from '@angular/core';
import { SafeResourceUrl } from '@angular/platform-browser';

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
      [src]="mapUrl() ?? ''"
    ></iframe>
  `,
  styleUrl: './footer-map.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: '',
  },
})
export class FooterMapComponent {
  mapUrl = input<SafeResourceUrl | null>(null);
}
