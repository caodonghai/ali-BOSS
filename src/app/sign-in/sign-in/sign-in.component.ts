import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, ValidationErrors, Validators} from '@angular/forms';
import {Observable, Observer} from 'rxjs';
import {SignInService} from '../service/sign-in.service';
import {NzMessageService, NzNotificationService} from 'ng-zorro-antd';
import {Router} from '@angular/router';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit {
  signInForm: FormGroup;

  remember = !!localStorage.getItem('remember');
  isSigning = false;
  uuid: string;
  verificationCodeStyle: any = {};

  constructor(private fb: FormBuilder,
              private signInService: SignInService,
              private msg: NzMessageService,
              private router: Router,
              private notification: NzNotificationService) {
  }

  ngOnInit() {
    const username = localStorage.getItem('username') ? localStorage.getItem('username') : '';
    this.signInForm = this.fb.group({
      loginName: ['', [Validators.required], [this.userNameAsyncValidator]],
      password: ['', [Validators.required], [this.passwordAsyncValidator]],
      imageCode: ['', [Validators.required, Validators.minLength(4)]],
      imageCodeId: [''],
    });
    this.signInForm.patchValue({
      loginName: username.toString()
    });
    this.reFreshVerificationCode();

  }

  reFreshVerificationCode() {
    this.uuid = this.signInService.getUuid();
    this.verificationCodeStyle = {
      'background': 'url(' + this.signInService.getVerificationCodeUrl(this.uuid) + '&date=' + new Date().getSeconds() + ') no-repeat'
    };
    this.signInForm.patchValue({
      imageCodeId: this.uuid
    });
  }

  submitForm() {
    this.isSigning = true;
    this.signInService.signIn(this.signInForm.value).subscribe(res => {
      this.isSigning = false;
      if (res.resCode === 1) {
        if (this.remember) {
          localStorage.setItem('username', this.signInForm.value.loginName);
        } else {
          localStorage.removeItem('username');
        }
        sessionStorage.setItem('Access-Token', res.data.tokenInfo.token);
        sessionStorage.setItem('userDTO', JSON.stringify(res.data.userDTO));
        sessionStorage.setItem('smRoleDTOs', JSON.stringify(res.data.smRoleDTOs));
        this.router.navigate(['manage']).then(
          () => {
            this.notification.success('登录成功', '欢迎');
          }
        );
      } else {
        this.signInForm.reset({
          loginName: this.signInForm.value.loginName
        });
        for (const key in this.signInForm.controls) {
          this.signInForm.controls[key].markAsPristine();
          this.signInForm.controls[key].updateValueAndValidity();
        }
        this.reFreshVerificationCode();
      }
    });
  }


  userNameAsyncValidator = (control: FormControl) => Observable.create((observer: Observer<ValidationErrors>) => {
    setTimeout(() => {
      // const length = control.value.toString().length;
      // if (length < 6) {
      //   observer.next({error: true, shorterThanExpected: true});
      // } else if (length > 12) {
      //   observer.next({error: true, longerThanExpected: true});
      // } else if (control.value.toString().charAt(0) <= 'A' || control.value.toString().charAt(0) >= 'Z') {
      //   observer.next({error: true, notStartWithUppercase: true});
      // } else {
      //   observer.next(null);
      // }
      observer.next(null);
      observer.complete();
    }, 500);
  });

  passwordAsyncValidator = (control: FormControl) => Observable.create((observer: Observer<ValidationErrors>) => {
    setTimeout(() => {
      const length = control.value.toString().length;
      if (length < 7) {
        observer.next({error: true, shorterThanExpected: true});
      } else if (length > 16) {
        observer.next({error: true, longerThanExpected: true});
      } else {
        observer.next(null);
      }
      observer.complete();
    }, 500);
  });

  handleRememberChange(e) {
    if (e) {
      localStorage.setItem('remember', 'true');
    } else {
      localStorage.removeItem('remember');
    }
  }
}
