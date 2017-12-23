import { Component, OnInit } from '@angular/core';
import { ApiService } from 'app/services/api.service';
import { GlobalService } from 'app/services/global.service';

@Component({
  selector: 'app-admin-dashboard-users',
  templateUrl: './admin-dashboard-users.component.html',
})
export class AdminDashboardUsersComponent implements OnInit {

  users: Array<object>;

  constructor(
    private api: ApiService,
    private globalService: GlobalService,
  ) { }

  ngOnInit() {
    this.getAllUsers()
  }

  getAllUsers() {
    this.api.users.getAll()
    .subscribe(
      res => {
        this.users = res;
      },
      error => {
        this.globalService.errorHandler.process(error);
      }
    )
  }

}
