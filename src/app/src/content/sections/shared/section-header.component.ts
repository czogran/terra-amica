import { Component, input } from '@angular/core';

@Component({
  selector: 'app-section-header',
  styleUrl: './section-header.component.scss',
  template: `
    <!-- 
     <section class="realizacje-section position-relative overflow-hidden">
      <div class="eco-shapes">
        <span class="shape shape-leaf"></span>
        <span class="shape shape-circle"></span>
        <span class="shape shape-leaf small"></span>
        <span class="shape shape-circle large"></span>
        <span class="shape shape-leaf"></span>
      </div>

      <div class="container text-center py-5 position-relative z-2">
        <h2 class="section-title">Realizacje</h2>
        <div class="title-divider mx-auto"></div>
        <p class="section-subtitle mt-3">
          Poznaj nasze wybrane realizacje i projekty, które z sukcesem zrealizowaliśmy dla naszych
          klientów.
        </p>
      </div> 
    </section>
    -->

    <section class="hero">
      <h2>{{ title() }}</h2>
      <div class="title-divider mx-auto mb-3"></div>
      <p>{{ subtitle() }}</p>
    </section>
  `,
})
export class SectionHeaderComponent {
  title = input<string>();
  subtitle = input<string>();
}
