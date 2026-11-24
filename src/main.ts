import { mountBootstrapLoader } from './app/bootstrap-loader/bootstrap-loader';

/**
 * The loader is mounted first so the brand animation is ready before the
 * application downloads start. The bootstrap itself stays behind dynamic
 * imports, keeping the initial `main` bundle tiny.
 */
mountBootstrapLoader();

async function bootstrap(): Promise<void> {
  const [{ bootstrapApplication }, { App }, { appConfig }] = await Promise.all([
    import('@angular/platform-browser'),
    import('./app/app'),
    import('./app/app.config'),
  ]);

  await bootstrapApplication(App, appConfig);
}

void bootstrap().catch((error) => console.error(error));
