import { Injectable } from '@angular/core';
import { NotificationService } from 'app/services/notification.service';
import { RedirectionService } from 'app/services/redirection.service';
import { ErrorHandlerService } from 'app/services/error-handler.service';

@Injectable()
export class GlobalService {

  constructor(
    public notification: NotificationService,
    public redirection: RedirectionService,
    public errorHandler: ErrorHandlerService,
  ) { }
}
