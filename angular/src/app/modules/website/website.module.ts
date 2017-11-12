import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AppRoutes } from '../../app.routes';
import * as components from './components/website-components-barrel';

@NgModule({
  declarations: [
    components.WebsiteNavbarComponent,
    components.WebsiteHomeComponent,
    components.WebsiteLoginComponent,
    components.WebsiteViewWrapperComponent,
    components.WebsiteRegisterComponent,
    components.WebsiteContactComponent,
  ],
  imports: [
    CommonModule,
    AppRoutes,
  ],
  providers: [],
})
export class WebsiteModule { }
