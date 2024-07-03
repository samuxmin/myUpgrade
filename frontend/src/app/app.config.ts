import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes),// Proporciona las rutas de la aplicación utilizando las rutas definidas en app.routes.ts
    provideHttpClient()
  ]
};
