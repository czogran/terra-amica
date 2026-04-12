import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { ContactState } from 'state';
import { FooterContactFormComponent } from './footer-contact-form.component';
import { FooterMapComponent } from './footer-map.component';
import { ScrollTopButtonComponent } from './scroll-top-button.component';

@Component({
  selector: 'app-footer',
  imports: [
    TranslatePipe,
    FooterContactFormComponent,
    FooterMapComponent,
    ScrollTopButtonComponent,
  ],
  template: `
    <footer class="footer text-center py-3 mt-auto position-relative">
      <app-scroll-top-button />
      <div
        class="contact-section d-flex flex-column flex-md-row justify-content-center align-items-stretch gap-4 text-start"
      >
        <div class="contact-info flex-fill d-flex flex-column justify-content-center gap-2">
          <div class="fw-bold mb-2">{{ 'footer.contact.title' | translate }}</div>
          <div class="d-flex align-items-center gap-2">
            <i class="bi bi-geo-alt-fill contact-icon"></i>
            <div>
              <div class="fw-bold">{{ 'address' | translate }}</div>
              <div>{{ contactState.address() }}</div>
            </div>
          </div>
          <div class="d-flex align-items-center gap-2">
            <i class="bi bi-envelope-fill contact-icon"></i>
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
        </div>
        <app-footer-contact-form />
      </div>
      <app-footer-map class="mb-2" />
      <span class="d-block mb-2">{{ 'footer.copyright' | translate }}</span>
    </footer>
  `,
  styleUrls: ['./footer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterComponent {
  readonly contactState = inject(ContactState);
}
