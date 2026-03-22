import { Component } from '@angular/core';

@Component({
  selector: 'app-spinner',
  template: `
    <svg class="spinner" viewBox="0 0 100 100">
      <defs>
        <!-- Terra-style green gradient -->
        <linearGradient id="terraGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#0f8f3e" />
          <stop offset="100%" stop-color="#8cc63f" />
        </linearGradient>
      </defs>
      <!-- Group centered -->
      <g transform="translate(50,50)">
        <!-- Repeat 6 curved “leaf” segments -->
        <g fill="url(#terraGradient)">
          <path d="M0,-40 C15,-35 25,-15 0,0 C-10,-10 -15,-25 0,-40 Z" />
          <path d="M0,-40 C15,-35 25,-15 0,0 C-10,-10 -15,-25 0,-40 Z" transform="rotate(60)" />
          <path d="M0,-40 C15,-35 25,-15 0,0 C-10,-10 -15,-25 0,-40 Z" transform="rotate(120)" />
          <path d="M0,-40 C15,-35 25,-15 0,0 C-10,-10 -15,-25 0,-40 Z" transform="rotate(180)" />
          <path d="M0,-40 C15,-35 25,-15 0,0 C-10,-10 -15,-25 0,-40 Z" transform="rotate(240)" />
          <path d="M0,-40 C15,-35 25,-15 0,0 C-10,-10 -15,-25 0,-40 Z" transform="rotate(300)" />
        </g>
        <!-- Inner circle for polish -->
        <circle r="18" fill="url(#shade)" />
      </g>
    </svg>
  `,
  styleUrl: './spinner.component.scss',
})
export class SpinnerComponent {}
