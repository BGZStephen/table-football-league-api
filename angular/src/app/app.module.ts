import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutes } from './app.routes';

import { AppComponent } from './app.component';

import { WebsiteModule } from './modules/website/website.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutes,
    WebsiteModule,
    DashboardModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
