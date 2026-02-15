import { Component, signal, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './src/header/header.component';
import { FooterComponent } from './src/footer/footer.component';
import { StateService } from './src/state/state.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('terra-amica');
  service = inject(StateService);
}
