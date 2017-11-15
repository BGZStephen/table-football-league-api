import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ApiService } from 'app/services/api.service';
import { GlobalService } from 'app/services/global.service';

@Component({
  selector: 'app-website-contact',
  templateUrl: './website-contact.component.html',
})
export class WebsiteContactComponent implements OnInit {

  constructor(
    private api: ApiService,
    private globalService: GlobalService
  ) { }

  ngOnInit() {
  }

  onSubmit(message) {
    this.api.website.contactForm(message)
    .subscribe(
      res => {
        this.globalService.notification.show({message: 'Message sent'});
      },
      error => {
        console.log(error)
        this.globalService.notification.error({message: 'Error sending message, please try again'});
      }
    )
  }

}
