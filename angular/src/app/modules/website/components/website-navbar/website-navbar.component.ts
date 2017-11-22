import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-website-navbar',
  templateUrl: './website-navbar.component.html',
})
export class WebsiteNavbarComponent implements OnInit {

  menuVisible = false;

  constructor() { }

  ngOnInit() {

  }

  toggleMenuVisible() {
    this.menuVisible = !this.menuVisible;
  }

  menuVisibleStyle() {
    if (screen.width > 1024) {
      this.menuVisible = true;
      return {'max-height': 'calc(100vh - 134px)'}
    } else if (this.menuVisible) {
      const height = `${document.getElementById('website-navbar').getElementsByTagName('ul')[0].children.length * 52}px`
      return {'max-height': `${height}`};
    } else {
      return {'max-height': '0'};
    }
  }
}
