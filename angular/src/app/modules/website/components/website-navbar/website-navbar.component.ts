import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-website-navbar',
  templateUrl: './website-navbar.component.html',
})
export class WebsiteNavbarComponent implements OnInit {

  menuVisible: boolean = false;
  currentSubmenuActive: number = -1;

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
    if (index === this.currentSubmenuActive) {
      const height = document.getElementsByClassName('navbar-submenu')[index].clientHeight;
      return {'height': `${76 + height}px`}
    } else {
      return {'height': '76px'};
    }
  }
}
