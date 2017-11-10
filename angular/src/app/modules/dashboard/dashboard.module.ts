import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AppRoutes } from '../../app.routes';
import * as components from './components/dashboard-components-barrel';

@NgModule({
  declarations: [
    components.DashboardHomeComponent,
    components.DashboardNavbarComponent,
    components.DashboardViewWrapperComponent,
  ],
  imports: [
    CommonModule,
    AppRoutes,
  ],
  providers: [],
})
export class DashboardModule { }
