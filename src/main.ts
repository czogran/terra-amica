/**
 * The first paint is handled entirely by the inline loader in index.html, so
 * this entry point only orchestrates the download of the actual application.
 *
 * Keeping the app module behind dynamic imports keeps the initial `main`
 * bundle tiny; the platform, root component and application config are
 * fetched as the next step while the loader is already on screen.
 */
async function bootstrap(): Promise<void> {
  const [{ bootstrapApplication }, { App }, { appConfig }] = await Promise.all([
    import('@angular/platform-browser'),
    import('./app/app'),
    import('./app/app.config'),
  ]);

  await bootstrapApplication(App, appConfig);
}

void bootstrap().catch((error) => console.error(error));
