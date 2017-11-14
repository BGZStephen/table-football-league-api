import { Injectable } from '@angular/core';
import { NotificationService } from 'app/services/notification.service';
import { RedirectionService } from 'app/services/redirection.service';

@Injectable()
export class GlobalService {

  constructor(
    public notification: NotificationService,
    public redirection: RedirectionService,
  ) { }
}
