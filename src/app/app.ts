import { Component, effect, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter, take } from 'rxjs';
import { HeaderComponent } from './src/header/header.component';
import { FooterComponent } from './src/footer/footer.component';
import { releaseBootstrapLoader } from './bootstrap-loader/bootstrap-loader';
import { StateService } from './src/state/state.service';
import { TranslationManagerService } from './src/state/translation-manager.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('terra-amica');
  service = inject(StateService);

  private readonly router = inject(Router);
  private readonly translationManager = inject(TranslationManagerService);

  private navigationReady = false;
  private translationsReady = false;
  private loaderFinished = false;

  constructor() {
    this.navigationReady = this.router.navigated;
    this.translationsReady = this.translationManager.translationsReady();

    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        take(1),
        takeUntilDestroyed(),
      )
      .subscribe(() => {
        this.navigationReady = true;
        this.finishInitialLoadWhenReady();
      });

    effect(() => {
      this.translationsReady = this.translationManager.translationsReady();
      this.finishInitialLoadWhenReady();
    });

    this.finishInitialLoadWhenReady();
  }

  /**
   * The bootstrap loader is released once translations and the initial route
   * are available. Images are intentionally not part of this check.
   */
  private finishInitialLoadWhenReady(): void {
    if (this.loaderFinished || !this.navigationReady || !this.translationsReady) {
      return;
    }

    this.loaderFinished = true;

    const finish = () => releaseBootstrapLoader();

    if (typeof requestAnimationFrame === 'function') {
      requestAnimationFrame(() => requestAnimationFrame(finish));
    } else {
      setTimeout(finish, 0);
    }
  }
}
