import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutes } from './app.routes';

import { AppComponent } from './app.component';
import { WebsiteHomeComponent } from './modules/website/components/website-home/website-home.component';


@NgModule({
  declarations: [
    AppComponent,
    WebsiteHomeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutes
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
