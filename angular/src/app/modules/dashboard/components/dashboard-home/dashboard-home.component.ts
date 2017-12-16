import { Component, OnInit } from '@angular/core';
import { GlobalService } from 'app/services/global.service';

@Component({
  selector: 'app-dashboard-home',
  templateUrl: './dashboard-home.component.html',
})
export class DashboardHomeComponent implements OnInit {

  constructor(
    private globalService: GlobalService
  ) { }

  ngOnInit() {}

}
