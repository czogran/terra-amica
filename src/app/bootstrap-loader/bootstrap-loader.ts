import { BOOTSTRAP_LOADER_TEMPLATE } from './bootstrap-loader.template';

const REVEAL_DELAY_MS = 1000;
const MIN_VISIBLE_MS = 2000;
const FADE_OUT_MS = 320;

type LoaderHandle = { release: () => void };
type LoaderWindow = Window & { __taBootstrapLoader?: LoaderHandle };

/**
 * Creates the bootstrap loader immediately when the entry module executes.
 * It stays hidden until the app has been loading for one second, and is then
 * kept on screen for at least two seconds once shown.
 */
export function mountBootstrapLoader(): void {
  if (typeof document === 'undefined' || typeof window === 'undefined') {
    return;
  }

  if (document.getElementById('ta-bootstrap-loader')) {
    return;
  }

  const container = document.createElement('div');
  container.innerHTML = BOOTSTRAP_LOADER_TEMPLATE.trim();
  const loader = container.firstElementChild as HTMLElement | null;
  if (!loader) {
    return;
  }

  document.body.appendChild(loader);

  let ready = false;
  let shownAt: number | null = null;

  const revealTimer = setTimeout(
    () => {
      if (ready) {
        return;
      }

      loader.classList.add('ta-bootstrap-loader--visible');
      shownAt = performance.now();
    },
    Math.max(0, REVEAL_DELAY_MS - performance.now()),
  );

  const release = (): void => {
    if (ready) {
      return;
    }

    ready = true;
    clearTimeout(revealTimer);

    // The loader never became visible, so it can be removed without a flash.
    if (shownAt === null) {
      loader.remove();
      return;
    }

    const remaining = Math.max(0, MIN_VISIBLE_MS - (performance.now() - shownAt));
    setTimeout(() => {
      loader.classList.add('ta-bootstrap-loader--hidden');
      setTimeout(() => loader.remove(), FADE_OUT_MS);
    }, remaining);
  };

  (window as LoaderWindow).__taBootstrapLoader = { release };
}

/** Called once translations and the initial route have rendered. */
export function releaseBootstrapLoader(): void {
  if (typeof window === 'undefined') {
    return;
  }

  (window as LoaderWindow).__taBootstrapLoader?.release();
}
