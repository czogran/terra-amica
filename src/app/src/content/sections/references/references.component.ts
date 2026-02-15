import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { SectionHeaderComponent } from '../shared/section-header.component';
import { TranslatePipe } from '@ngx-translate/core';
import { ReferenceItem, ReferenceState } from 'src/app/src/state/state-reference';
import { ReferencePopupComponent } from './reference-popup.component';

@Component({
  selector: 'app-references',
  templateUrl: './references.component.html',
  styleUrls: ['./references.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgOptimizedImage, SectionHeaderComponent, TranslatePipe, ReferencePopupComponent],
  host: { class: 'app-references' },
})
export class ReferencesComponent {
  referenceState = inject(ReferenceState);

  references = computed(() => this.referenceState.references());

  readonly popupReference = signal<ReferenceItem | null>(null);
  readonly popupReferenceIndex = signal<number>(-1);

  openPopup(reference: ReferenceItem): void {
    const refs = this.references();
    const idx = refs.findIndex((r) => r.id === reference.id);
    this.popupReference.set(reference);
    this.popupReferenceIndex.set(idx);
    if (typeof document !== 'undefined') {
      document.body.style.overflow = 'hidden';
    }
  }

  closePopup(): void {
    this.popupReference.set(null);
    this.popupReferenceIndex.set(-1);
    if (typeof document !== 'undefined') {
      document.body.style.overflow = '';
    }
  }

  nextReference(): void {
    const refs = this.references();
    const idx = this.popupReferenceIndex();
    if (refs.length === 0 || idx === -1) return;
    const nextIdx = (idx + 1) % refs.length;
    this.popupReference.set(refs[nextIdx]);
    this.popupReferenceIndex.set(nextIdx);
  }

  prevReference(): void {
    const refs = this.references();
    const idx = this.popupReferenceIndex();
    if (refs.length === 0 || idx === -1) return;
    const prevIdx = (idx - 1 + refs.length) % refs.length;
    this.popupReference.set(refs[prevIdx]);
    this.popupReferenceIndex.set(prevIdx);
  }
}
