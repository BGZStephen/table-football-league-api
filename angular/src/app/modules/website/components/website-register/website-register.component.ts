import { Component, OnInit, ViewEncapsulation } from '@angular/core';

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

  constructor() { }

  ngOnInit() {
  }

  onRegister(form) {
    const validation = this.validateForm(form);
    if (validation) {
      // create user
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
