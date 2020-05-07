import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err))
  .then(() => {
    const title = document.title;

    document.onfocus = () => {
      document.title = title;
    };

    document.onblur = () => {
      document.title = '👀 ' + title;
    };
  })
;
