import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ApiService } from 'app/services/api.service';
import { GlobalService } from 'app/services/global.service';

@Component({
  selector: 'app-website-register',
  templateUrl: './website-register.component.html',
})

export class WebsiteRegisterComponent implements OnInit {

  formValues = {
    firstName: {
      display: 'First name'
    },
    lastName: {
      display: 'Last name'
    },
    username: {
      display: 'Username'
    },
    email: {
      display: 'Email'
    },
    password: {
      display: 'Password'
    },
    confirmPassword: {
      display: 'Password confirmation'
    },
  };

  constructor(
    private api: ApiService,
    private globalService: GlobalService,
  ) { }

  ngOnInit() {
  }

  onRegister(user) {
    const validation = this.validateForm(user);
    if (validation) {
      this.api.users.create(user)
      .subscribe(
        res => {
          localStorage.setItem('token', res['token']);
          this.globalService.notification.show({message: 'Registration successful'});
          this.globalService.redirection.delayed('/dashboard', 300);
        },
        error => {
          this.globalService.notification.error({message: error.statusText});
        }
      )
    }
  }

  validateForm(form) {
    let errorFlag;
    Object.keys(this.formValues).forEach((key) => {
      if(!form[key]) {
        errorFlag = true;
        this.formValues[key]['hasError'] = true;
        this.formValues[key]['message'] = `${this.formValues[key].display} is required`;
      } else {
        this.formValues[key]['hasError'] = false;
        this.formValues[key]['message'] = undefined;
      }
    })

    if (form.confirmPassword !== form.password) {
      errorFlag = true;
      this.formValues.confirmPassword['hasError'] = true;
      this.formValues.confirmPassword['message'] = 'The entered passwords do not match';
    }

    if(errorFlag) {
      return false;
    }

    return true;
  }
}
