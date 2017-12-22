import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { GlobalService } from './services/global.service';
import { RedirectionService } from './services/redirection.service';
import { NotificationService } from './services/notification.service';
import { ErrorHandlerService } from './services/error-handler.service';
import { ApiService } from './services/api.service'

import { AppRoutes } from './app.routes';

import { WebsiteModule } from './modules/website/website.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { AdminDashboardModule } from './modules/admin-dashboard/admin-dashboard.module';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutes,
    WebsiteModule,
    DashboardModule,
    AdminDashboardModule,
  ],
  providers: [GlobalService, ApiService, NotificationService, RedirectionService, ErrorHandlerService],
  bootstrap: [AppComponent]
})
export class AppModule { }
