import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-website-navbar',
  templateUrl: './website-navbar.component.html',
})
export class WebsiteNavbarComponent implements OnInit {

  currentSubmenuActive: number = -1;
  menuVisible: boolean = false;
  menuItems: Array<object> = [
    {name: 'Home', iconClass: 'fa fa-home fa-2x', link: '/'},
    {name: 'Register', iconClass: 'fa fa-pencil fa-2x', link: '/register'},
    {name: 'Login', iconClass: 'fa fa-sign-in fa-2x', link: '/login'},
  ]

  constructor() { }

  ngOnInit() {}

  toggleSubmenuActive(index) {
    if (index === this.currentSubmenuActive) {
      this.currentSubmenuActive = -1;
    } else {
      this.currentSubmenuActive = index;
    }
  }

  submenuActiveStyle(index) {
    if (index === this.currentSubmenuActive && document.getElementsByClassName('navbar-submenu')[index]) {
      const height = document.getElementsByClassName('navbar-submenu')[index].clientHeight;
      return {'height': `${76 + height}px`}
    } else {
      return {'height': '76px'};
    }
  }
}
