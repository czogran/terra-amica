import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { ContactState } from 'state';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { FooterContactFormComponent } from './footer-contact-form.component';
import { FooterMapComponent } from './footer-map.component';

@Component({
  selector: 'app-footer',
  imports: [TranslatePipe, FooterContactFormComponent, FooterMapComponent],
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
      <app-footer-map class="mb-2" [mapUrl]="safeGoogleMapsUrl()" />
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
}
