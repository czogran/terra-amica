import { Component, inject } from '@angular/core';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
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
        <div>{{ contactState.address() }}</div>
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
            class="text-decoration-underline"
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
