import { Injectable } from '@angular/core';
import { NotificationService } from 'app/services/notification.service';

@Injectable()
export class ErrorHandlerService {

  constructor(
    private notification: NotificationService,
  ) { }

  process(error) {
    const errorMessage = JSON.parse(error._body).message;
    this.notification.error({
      message: errorMessage,
    });
  }
}
