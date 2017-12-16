import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ApiService } from 'app/services/api.service';

@Component({
  selector: 'app-dashboard-account',
  templateUrl: './dashboard-account.component.html',
})
export class DashboardAccountComponent implements OnInit {

  passwordChange = false;
  user: object = {};

  constructor(
    private apiService: ApiService
  ) { }

  ngOnInit() {
    const user = JSON.parse(localStorage.getItem('user'))
    this.apiService.users.get(user._id)
    .subscribe(
      res => {
        this.user = res;
      },
      errorRes => {

      }
    )
  }

  enablePasswordChange() {
    this.passwordChange = !this.passwordChange;
  }

}
