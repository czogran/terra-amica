import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-section-header',
  styleUrl: './section-header.component.scss',
  template: `
    <section class="section-header">
      <div class="section-header__inner">
        <h2 class="section-header__title">{{ title() }}</h2>
        <span class="section-header__divider" aria-hidden="true"></span>
        <p class="section-header__subtitle">{{ subtitle() }}</p>
      </div>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SectionHeaderComponent {
  title = input<string>();
  subtitle = input<string>();
}
