import { Component, inject } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { ContactState } from 'state';

@Component({
  selector: 'app-header-contact',
  imports: [TranslatePipe],
  styleUrls: ['./header-contact.component.scss'],
  host: { class: 'd-flex gap-3' },
  template: `
    <div class="small d-flex align-items-center gap-1">
      <i class="bi bi-geo-alt-fill contact-icon text-primary icon-lg"></i>
      <div>
        <div class="fw-bold">{{ 'address' | translate }}</div>
        <div>
          <a
            [href]="contactState.googleMapsUrl()"
            target="_blank"
            rel="noopener noreferrer"
            class="text-decoration-none"
          >
            {{ contactState.address() }}
          </a>
        </div>
      </div>
    </div>
    <div class="small d-flex align-items-center gap-1">
      <i class="bi bi-envelope-fill contact-icon text-primary icon-lg"></i>
      <div>
        <div class="fw-bold">{{ 'email' | translate }}</div>
        <div>
          @let mail = contactState.email();
          <a
            href="mailto:{{ mail }}"
            class="text-decoration-none"
            aria-label="Email {{ mail }}"
          >
            {{ mail }}
          </a>
        </div>
      </div>
    </div>
  `,
})
export class HeaderContactComponent {
  contactState = inject(ContactState);
}
