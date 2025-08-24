import { APP_INITIALIZER, ApplicationConfig} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { SettingsService } from './services/settings.service';
import { provideHttpClient } from '@angular/common/http';


export function initializeApp(settingService: SettingsService){
  return () => settingService.loadAppConfig();
}
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    SettingsService,
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      deps: [SettingsService],
      multi: true
    }
  ]
};
