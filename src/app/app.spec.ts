import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { App } from './app';
import { StateService } from './src/state/state.service';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        { provide: StateService, useValue: {} },
        { provide: Router, useValue: { navigated: true, events: new Subject() } },
        {
          provide: TranslateService,
          useValue: {
            getCurrentLang: () => 'pl',
            getDefaultLang: () => 'pl',
          },
        },
      ],
    })
      .overrideComponent(App, {
        set: {
          template: '<h1>terra-amica</h1>',
          imports: [],
        },
      })
      .compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render title', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('terra-amica');
  });
});
