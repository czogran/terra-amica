import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { ImageSkeletonDirective } from '../content/sections/shared/image-skeleton.directive';

@Component({
  selector: 'app-header-logo',
  imports: [NgOptimizedImage, TranslatePipe, ImageSkeletonDirective],
  template: `
    <a class="brand-link" [attr.href]="href()" [attr.aria-label]="'app.title' | translate">
      <span class="brand-logo-wrap" aria-hidden="true">
        <img
          appImageSkeleton
          class="brand-logo brand-logo--light"
          ngSrc="assets/logo/terra-amica-logo-light.png"
          [attr.alt]="'app.title' | translate"
          width="1024"
          height="459"
          priority
        />
        <img
          appImageSkeleton
          class="brand-logo brand-logo--dark"
          ngSrc="assets/logo/terra-amica-logo-dark.png"
          [attr.alt]="'app.title' | translate"
          width="1024"
          height="459"
          priority
        />
      </span>
    </a>
  `,
  styleUrl: './header-logo.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderLogoComponent {
  readonly href = input.required<string>();
}
