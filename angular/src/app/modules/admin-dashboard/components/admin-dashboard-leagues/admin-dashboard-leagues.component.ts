import { Component, OnInit } from '@angular/core';
import { ApiService } from 'app/services/api.service';
import { GlobalService } from 'app/services/global.service';

@Component({
  selector: 'app-admin-dashboard-leagues',
  templateUrl: './admin-dashboard-leagues.component.html',
})
export class AdminDashboardLeaguesComponent implements OnInit {

  leagues: Array<object>;

  constructor(
    private api: ApiService,
    private globalService: GlobalService
  ) { }

  ngOnInit() {
    this.getAllLeagues()
  }

  getAllLeagues() {
    this.api.leagues.getAll()
    .subscribe(
      res => {
        this.leagues = res;
        console.log(this.leagues)
      },
      error => {
        this.globalService.errorHandler.process(error);
      }
    )
  }

}
