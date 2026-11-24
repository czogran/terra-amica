export const BOOTSTRAP_LOADER_TEMPLATE = `
  <div
    id="ta-bootstrap-loader"
    class="ta-bootstrap-loader"
    role="status"
    aria-live="polite"
    aria-label="Ładowanie Terra Amica"
  >
    <svg
      class="ta-bootstrap-loader__mark"
      viewBox="0 0 100 100"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id="ta-bootstrap-gradient" x1="10%" y1="0%" x2="90%" y2="100%">
          <stop offset="0%" stop-color="#0f8f3e" />
          <stop offset="100%" stop-color="#8cc63f" />
        </linearGradient>
      </defs>
      <g transform="translate(50 50)" fill="url(#ta-bootstrap-gradient)">
        <path d="M0,-40 C15,-35 25,-15 0,0 C-10,-10 -15,-25 0,-40 Z" />
        <path d="M0,-40 C15,-35 25,-15 0,0 C-10,-10 -15,-25 0,-40 Z" transform="rotate(60)" />
        <path d="M0,-40 C15,-35 25,-15 0,0 C-10,-10 -15,-25 0,-40 Z" transform="rotate(120)" />
        <path d="M0,-40 C15,-35 25,-15 0,0 C-10,-10 -15,-25 0,-40 Z" transform="rotate(180)" />
        <path d="M0,-40 C15,-35 25,-15 0,0 C-10,-10 -15,-25 0,-40 Z" transform="rotate(240)" />
        <path d="M0,-40 C15,-35 25,-15 0,0 C-10,-10 -15,-25 0,-40 Z" transform="rotate(300)" />
      </g>
      <circle cx="50" cy="50" r="13" fill="currentColor" opacity="0.12" />
      <circle cx="50" cy="50" r="5" fill="currentColor" />
    </svg>
    <span class="ta-bootstrap-loader__brand">Terra Amica</span>
    <span class="ta-bootstrap-loader__hint">Ładowanie</span>
  </div>
`;
