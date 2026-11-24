import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { SectionHeaderComponent } from '../shared/section-header.component';
import { ImageSkeletonDirective } from '../shared/image-skeleton.directive';

@Component({
  selector: 'app-research',
  templateUrl: './research.component.html',
  styleUrls: ['./research.component.scss'],
  imports: [SectionHeaderComponent, TranslatePipe, NgOptimizedImage, ImageSkeletonDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResearchComponent {}
