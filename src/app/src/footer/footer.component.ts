import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { ContactState } from 'state';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-footer',
  imports: [TranslatePipe],
  template: `
    <footer class="footer text-center py-3 mt-auto position-relative">
      @if (showScrollTop()) {
        <button class="scroll-top-btn" (click)="scrollToTop()" aria-label="Scroll to top">↑</button>
      }
      <div
        class="contact-section d-flex flex-column flex-md-row justify-content-center align-items-stretch gap-4 text-start"
      >
        <div class="contact-info flex-fill d-flex flex-column justify-content-center gap-2">
          <div class="fw-bold mb-2">Contact</div>
          <div class="d-flex align-items-center gap-2">
            <i class="bi bi-geo-alt-fill contact-icon"></i>
            <div>
              <div class="fw-bold">{{ 'ADDRESS' | translate }}</div>
              <div>{{ contactState.address() }}</div>
            </div>
          </div>
          <div class="d-flex align-items-center gap-2">
            <i class="bi bi-envelope-fill contact-icon"></i>
            <div>
              <div class="fw-bold">{{ 'EMAIL' | translate }}</div>
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
        <form (submit)="onSubmit($event)" class="contact-form flex-fill mx-auto">
          <div class="mb-2">
            <input
              name="email"
              type="email"
              class="form-control"
              placeholder="Your email"
              required
            />
          </div>
          <div class="mb-2">
            <textarea
              name="message"
              class="form-control"
              rows="3"
              placeholder="Your message"
              required
            ></textarea>
          </div>
          <button type="submit" class="btn w-100 footer-submit-btn">Send</button>
        </form>
      </div>
      <div class="mb-2">
        <iframe
          width="100%"
          height="200"
          class="footer-map"
          style="border:0;"
          loading="lazy"
          allowfullscreen
          referrerpolicy="no-referrer-when-downgrade"
          title="Location on Google Maps"
          [src]="safeGoogleMapsUrl() ?? ''"
        >
        </iframe>
      </div>
      <span class="d-block mb-2">{{ 'footer.copyright' | translate }}</span>
    </footer>
  `,
  styleUrls: ['./footer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterComponent {
  private readonly sanitizer = inject(DomSanitizer);
  readonly contactState = inject(ContactState);

  readonly showScrollTop = signal(false);

  readonly safeGoogleMapsUrl = computed<SafeResourceUrl | null>(() => {
    const url = this.contactState.googleMapsUrl();
    return url
      ? this.sanitizer.bypassSecurityTrustResourceUrl(url)
      : this.sanitizer.bypassSecurityTrustResourceUrl('');
  });

  constructor() {
    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', this.onScroll.bind(this));
    }
  }

  onScroll() {
    this.showScrollTop.set(window.scrollY > 100);
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  onSubmit(event: Event) {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const email = (form.elements.namedItem('email') as HTMLInputElement)?.value;
    const message = (form.elements.namedItem('message') as HTMLTextAreaElement)?.value;
    // Here you would send the email using a backend or email service
    alert(`Thank you for your message!\nEmail: ${email}\nMessage: ${message}`);
    form.reset();
  }
}
