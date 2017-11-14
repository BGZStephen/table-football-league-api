import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable()
export class RedirectionService {

  constructor(
    private router: Router
  ) {}

  immediate(url) {
    this.router.navigate([`${url}`]);
  }

  delayed(url, time) {
    setTimeout(() => {
      this.router.navigate([`${url}`]);
    }, time);
  }
}
