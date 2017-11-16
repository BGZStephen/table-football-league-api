import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-dashboard-account',
  templateUrl: './dashboard-account.component.html',
})
export class DashboardAccountComponent implements OnInit {

  passwordChange = false;

  constructor() { }

  ngOnInit() {
  }

  enablePasswordChange() {
    this.passwordChange = !this.passwordChange;
  }

}
