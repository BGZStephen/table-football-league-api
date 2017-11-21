import { RouterModule, Routes } from '@angular/router';

import * as website from './modules/website/components/website-components-barrel';
import * as dashboard from './modules/dashboard/components/dashboard-components-barrel';

const APP_ROUTES: Routes = [
  {path: 'dashboard', component: dashboard.DashboardViewWrapperComponent, children: [
    {path: '', component: dashboard.DashboardHomeComponent},
    {path: 'teams', component: dashboard.DashboardTeamsComponent},
    {path: 'leagues', component: dashboard.DashboardLeaguesComponent},
    {path: 'fixtures', component: dashboard.DashboardFixturesComponent},
    {path: 'account', component: dashboard.DashboardAccountComponent},
  ]},
  {path: '', component: website.WebsiteViewWrapperComponent, children: [
    {path: '', component: website.WebsiteHomeComponent},
    {path: 'login', component: website.WebsiteLoginComponent},
    {path: 'register', component: website.WebsiteRegisterComponent},
    {path: 'contact', component: website.WebsiteContactComponent},
    {path: '__styles__', component: website.WebsiteBrandGuidelinesComponent},
  ]},
]

export const AppRoutes = RouterModule.forRoot(APP_ROUTES);
