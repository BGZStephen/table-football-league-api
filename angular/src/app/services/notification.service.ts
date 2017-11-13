import { Injectable } from '@angular/core';

@Injectable()
export class NotificationService {

  constructor() { }

  show(params) {
    const body = document.getElementsByTagName('body')[0];
    const notification = document.createElement('div');
    notification.className += 'notification-container notification-success';
    const message = document.createElement('p');
    message.innerText = params.message;
    notification.appendChild(message);
    body.appendChild(notification);

    setTimeout(() => {
      notification.remove();
    }, params.time ? params.time : 2000);
  }

  error(params) {
    const body = document.getElementsByTagName('body')[0];
    const notification = document.createElement('div');
    notification.className += 'notification-container notification-error';
    const message = document.createElement('p');
    message.innerText = params.message;
    notification.appendChild(message);
    body.appendChild(notification);

    setTimeout(() => {
      notification.remove();
    }, params.time ? params.time : 2000);
  }
}
