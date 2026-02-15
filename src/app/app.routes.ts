import { Route, Routes } from '@angular/router';
import { MENU_ITEMS } from './src/state/state-menu';
import { LANGUAGES } from './src/state/translation-manager.service';

const generateRoutes = (): Route[] =>
  MENU_ITEMS.reduce((acc, item) => {
    Object.entries(item.urls).forEach(([lang, data]) => {
      if (item.key === 'menu.realisations') {
        acc.push({
          path: `${lang}/${data.url}`,
          title: data.title,
          loadComponent: () =>
            import('./src/content/sections/realisations/details/realisations-details-route.component').then(
              (m) => m.RealisationsDetailsRouteComponent,
            ),
          data: { key: item.key, lang },
          children: [
            {
              path: '',
              title: data.title,
              loadComponent: item.loadComponent,
              data: { key: item.key, lang },
            },
            {
              path: ':slug',
              title: data.title,
              loadComponent: () =>
                import('./src/content/sections/realisations/details/realisations-details.component').then(
                  (m) => m.RealisationsDetailsComponent,
                ),
              data: { key: item.key, lang },
            },
          ],
        });

        return;
      }

      acc.push({
        path: `${lang}/${data.url}`,
        title: data.title,
        loadComponent: item.loadComponent,
        data: { key: item.key, lang },
      });
    });
    return acc;
  }, [] as Route[]);

const generateLanguagesDefaultRoutes = (): Route[] =>
  LANGUAGES.reduce((acc, config) => {
    const url = MENU_ITEMS[0].urls[config.code].url;
    acc.push({
      path: `${config.code}/**`,
      redirectTo: `${url}`,
    });
    return acc;
  }, [] as Route[]);

export const routes: Routes = [
  ...generateRoutes(),
  ...generateLanguagesDefaultRoutes(),
  { path: '**', redirectTo: `${LANGUAGES[0].code}/${MENU_ITEMS[0].urls[LANGUAGES[0].code].url}` },
];
