import { Component, OnInit } from '@angular/core';
import { ApiService } from 'app/services/api.service';
import { GlobalService } from 'app/services/global.service';

@Component({
  selector: 'app-admin-dashboard-teams',
  templateUrl: './admin-dashboard-teams.component.html',
})
export class AdminDashboardTeamsComponent implements OnInit {

  teams: Array<object>;

  constructor(
    private api: ApiService,
    private globalService: GlobalService,
  ) { }

  ngOnInit() {
    this.getAllTeams();
  }

  getAllTeams() {
    this.api.teams.getAll()
    .subscribe(
      res => {
        this.teams = res;
        console.log(this.teams)
      },
      error => {
        this.globalService.errorHandler.process(error);
      }
    )
  }
}
