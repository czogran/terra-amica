import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import {
  provideRouter,
  withInMemoryScrolling,
  withRouterConfig,
  withViewTransitions,
} from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';

import { provideTranslateService } from '@ngx-translate/core';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';
import { STATE_PROVIDERS } from 'state';
import { provideAnimations } from '@angular/platform-browser/animations';
import { environment } from './../environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    ...STATE_PROVIDERS,
    provideBrowserGlobalErrorListeners(),
    provideRouter(
      routes,
      withRouterConfig({}),
      withViewTransitions(),
      withInMemoryScrolling({ scrollPositionRestoration: 'enabled' }),
    ),
    provideClientHydration(withEventReplay()),
    provideAnimations(),
    provideTranslateService({
      loader: provideTranslateHttpLoader({
        prefix: environment.href + 'assets/i18n/',
      }),
      fallbackLang: 'en',
      lang: 'pl',
    }),
  ],
};
