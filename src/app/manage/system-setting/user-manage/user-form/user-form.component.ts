import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators} from '@angular/forms';
import {catchError, debounceTime, distinctUntilChanged, first, map, mergeMap} from 'rxjs/operators';
import {Observable, Observer, of} from 'rxjs';
import {NzMessageService} from 'ng-zorro-antd';
import {SystemSettingService} from '../../../service/systemSetting.service';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css']
})
export class UserFormComponent implements OnInit {
  passwordCheckInfo: any = {};
  roleList: any[] = [];
  formStatus: string; // 表单状态，新增或者编辑
  userForm: FormGroup;
  showChooseRegion = false;

  regionName = '';

  userForm: FormGroup;

  constructor(private fb: FormBuilder,
              private msg: NzMessageService,
              private systemSettingService: SystemSettingService,
              private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.getUrlParams();
    this.getCheckPasswordInfo();
    this.getRoleList();
    this.initUserForm();
  }

  submitForm() {
    console.log(this.userForm);
  }

  getUrlParams() {
    this.formStatus = this.route.snapshot.paramMap.get('status');
  }

  initUserForm() {
    this.userForm = this.fb.group({
      roleIds: [null, [Validators.required]],
      name: ['', [Validators.required]],
      userName: ['', [Validators.required, Validators.pattern('^[A-Za-z0-9]+$')], [this.userNameAsyncValidator]],
      alias: [''],
      password: [''],
      secondInputPassword: ['', [Validators.required], [this.secondInputPasswordAsyncValidator]],
      position: [''],
      cellphone: ['', [Validators.required, Validators.pattern('^[1][3,4,5,7,8][0-9]{9}$')], [this.cellphoneAsyncValidators]],
      regionId: ['', [Validators.required]],
      allowLogWeb: [true],
      allowLogMobile: [true],
      gender: [true],
      birthday: [''],
      email: [''],
      weixin: [''],
      qq: [''],
      description: [''],
    });
  }

  getRoleList() {
    this.systemSettingService.getRoleList().subscribe(res => {
      if (res.resCode === 1) {
        this.roleList = res.data.records;
      }
    });
  }

  getCheckPasswordInfo() {
    this.systemSettingService.getCheckPasswordInfo().subscribe(res => {
      if (res.resCode === 1) {
        this.passwordCheckInfo = res.data;
        this.userForm.get('password').setValidators(
          [
            Validators.required,
            Validators.minLength(7),
            Validators.pattern(`${res.data.regex}`)
          ]
        );
      }
    });
  }

  getRegion(e) {
    this.userForm.patchValue({
      regionId: e.id
    });
    this.regionName = e.name;
  }

  userNameAsyncValidator = (ctrl: AbstractControl): Observable<ValidationErrors | null> => {
    if (ctrl.value || ctrl.value === 0) {
      return ctrl.valueChanges.pipe(
        debounceTime(800),
        distinctUntilChanged(),
        mergeMap(() => this.systemSettingService.checkUserNameExist(ctrl.value)),
        map(res => (res.resCode === 1 ? null : {userNameExistError: true})),
        first(),
        catchError(() => of(null))
      );
    } else {
      return of(null);
    }
  }

  secondInputPasswordAsyncValidator = (ctrl: AbstractControl): Observable<ValidationErrors | null> => {
    if (ctrl.value) {
      return ctrl.valueChanges.pipe(
        debounceTime(800),
        map(res => (res === this.userForm.value.password ? null : {notEqualWithFirstInput: true})),
        first()
      );
    } else {
      return of(null);
    }
  }

  cellphoneAsyncValidators = (ctrl: AbstractControl): Observable<ValidationErrors | null> => {
    if (ctrl.value || ctrl.value === 0) {
      return ctrl.valueChanges.pipe(
        debounceTime(800),
        distinctUntilChanged(),
        mergeMap(() => this.systemSettingService.checkCellphoneExist(ctrl.value)),
        map(res => (res.resCode === 1 ? null : {cellphoneExistError: true})),
        first(),
        catchError(() => of(null))
      );
    } else {
      return of(null);
    }
  }

  beforeUpload = (file: File) => {
    return new Observable((observer: Observer<boolean>) => {
      const isPicture = file.type === 'image/*';
      if (!isPicture) {
        this.msg.error('请选择一张图片');
        observer.complete();
        return;
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        this.msg.error('图片不能超过2M');
        observer.complete();
        return;
      }
    });
  }

}
