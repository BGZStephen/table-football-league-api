import { RouterModule, Routes } from '@angular/router';

import { WebsiteHomeComponent } from './modules/website/components/website-components-barrel';

const APP_ROUTES: Routes = [
  {path: '', component: WebsiteHomeComponent}
]

export const AppRoutes = RouterModule.forRoot(APP_ROUTES);
