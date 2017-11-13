import { Injectable } from '@angular/core';
import { NotificationService } from 'app/services/notification.service';

@Injectable()
export class GlobalService {

  constructor(
    public notification: NotificationService,
  ) { }
}
