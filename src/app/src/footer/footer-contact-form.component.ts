import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-footer-contact-form',
  imports: [TranslatePipe],
  template: `
    <form (submit)="onSubmit($event)" class="contact-form">
      <div class="mb-2">
        <input
          name="email"
          type="email"
          class="form-control"
          [attr.placeholder]="'footer.form.email.placeholder' | translate"
          required
        />
      </div>
      <div class="mb-2">
        <textarea
          name="message"
          class="form-control"
          rows="3"
          [attr.placeholder]="'footer.form.message.placeholder' | translate"
          required
        ></textarea>
      </div>
      <button type="submit" class="btn w-100 footer-submit-btn">Send</button>
    </form>
  `,
  styleUrl: './footer-contact-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'flex-fill mx-auto',
  },
})
export class FooterContactFormComponent {
  onSubmit(event: Event): void {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const email = (form.elements.namedItem('email') as HTMLInputElement | null)?.value ?? '';
    const message = (form.elements.namedItem('message') as HTMLTextAreaElement | null)?.value ?? '';

    // Here you would send the email using a backend or email service
    alert(`Thank you for your message!\nEmail: ${email}\nMessage: ${message}`);
    form.reset();
  }
}
