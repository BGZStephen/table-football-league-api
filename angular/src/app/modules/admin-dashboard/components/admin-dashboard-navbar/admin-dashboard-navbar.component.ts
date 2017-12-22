import { Component, OnInit } from '@angular/core';
import { GlobalService } from 'app/services/global.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard-navbar',
  templateUrl: './admin-dashboard-navbar.component.html',
})
export class AdminDashboardNavbarComponent implements OnInit {

  currentSubmenuActive: number = -1;
  menuVisible: boolean = false;
  menuItems: Array<object> = [];

  constructor(
    private globalService: GlobalService,
    private router: Router,
  ) {
    this.menuItems = [
      {name: 'Home', iconClass: 'fa fa-home fa-2x', link: '/admin'},
      {name: 'Fixtures', iconClass: 'fa fa-calendar fa-2x', link: '/admin/fixtures'},
      {name: 'Teams', iconClass: 'fa fa-users fa-2x', link: '/admin/teams'},
      {name: 'Leagues', iconClass: 'fa fa-list-alt fa-2x', link: '/admin/leagues'},
      {name: 'Users', iconClass: 'fa fa-cog fa-2x', link: '/admin/users'},
      {name: 'Logout', iconClass: 'fa fa-power-off fa-2x', clickAction: this.onLogout},
    ]
  }

  ngOnInit() {}

  toggleSubmenuActive = (index) => {
    if (index === this.currentSubmenuActive) {
      this.currentSubmenuActive = -1;
    } else {
      this.currentSubmenuActive = index;
    }
  }

  submenuActiveStyle = (index) => {
    if (index === this.currentSubmenuActive && document.getElementsByClassName('navbar-submenu')[index]) {
      const height = document.getElementsByClassName('navbar-submenu')[index].clientHeight;
      return {'height': `${76 + height}px`}
    } else {
      return {'height': '76px'};
    }
  }

  toggleMenuVisible = () => {
    this.menuVisible = !this.menuVisible;
  }

  menuResizeToggle = () => {
    if (screen.width > 1024) {
      this.menuVisible = true;
    } else {
      this.menuVisible = false;
    }
  }

  primaryMenuStyle = () => {
    if (screen.width > 1024) {
      return {'max-height': `100vh`}
    } else if (this.menuVisible) {
      return {'max-height': `100vh`}
    } else {
      return {'max-height': '0'};
    }
  }

  onLogout = () => {
    this.globalService.notification.show({message: 'Logout successful'})
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    this.router.navigate(['/admin/login']);
  }

}
