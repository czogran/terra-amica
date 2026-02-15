import { Component } from '@angular/core';
import { SectionHeaderComponent } from "../shared/section-header.component";
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

interface Service {
  icon: string;
  title: string;
}


@Component({
  selector: 'app-offer',
  templateUrl: './offer.component.html',
  styleUrls: ['./offer.component.scss'],
  imports: [SectionHeaderComponent, TranslatePipe],
})
export class OfferComponent {

  services: Service[] = [
    { icon: '♻️', title: 'Przetwarzanie odpadów' },
    { icon: '🌱', title: 'Rekultywacja składowisk odpadów' },
    { icon: '🌍', title: 'Rekultywacja terenów zdegradowanych' },
    { icon: '📄', title: 'Analizy dokumentacji i audyty środowiskowe' },
    { icon: '🏗', title: 'Inwestor zastępczy' },
    { icon: '⚖️', title: 'Procedury i decyzje środowiskowe' }
  ];

  benefits: string[] = [
    'odzysk odpadów',
    'ochrona środowiska',
    'obniżenie kosztów gospodarki odpadami',
    'zapobieganie przepełnieniu składowisk'
  ];

  clients: string[] = [
    'gmin',
    'przedsiębiorstw komunalnych',
    'właścicieli zamkniętych składowisk'
  ];

  processSteps: string[] = [
    'koncepcja i analizy',
    'decyzje administracyjne',
    'realizacja inwestycji',
    'pozwolenie na użytkowanie',
    'uruchomienie instalacji'
  ];
}
