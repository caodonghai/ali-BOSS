import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators} from '@angular/forms';
import {catchError, debounceTime, first, map, mergeMap} from 'rxjs/operators';
import {Observable, Observer, of} from 'rxjs';
import {NzMessageService, UploadFile, UploadFilter, UploadXHRArgs} from 'ng-zorro-antd';
import {SystemSettingService} from '../../../service/systemSetting.service';
import {ActivatedRoute} from '@angular/router';
import {HttpEvent, HttpEventType, HttpResponse} from '@angular/common/http';
import {AppService} from '../../../../service/app.service';
import {formControlMarkAsDirty} from '../../../../../util/formControlMarkAsDirty';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css']
})
export class UserFormComponent implements OnInit {
  passwordCheckInfo: any = {};
  roleList: any[] = [];
  formStatus: string; // 表单状态，新增或者编辑
  showChooseRegion = false;

  regionName = '';
  // 上传头像相关
  fileList: any = [];
  showUploadList = {
    showPreviewIcon: true,
    showRemoveIcon: true,
    hidePreviewIconInNonImage: true
  };
  previewImage: string | undefined = '';
  previewVisible = false;
  filters: UploadFilter[] = [
    {
      name: 'type',
      fn: (fileList: UploadFile[]) => {
        const filterFiles = fileList.filter(w => ~['image/png', 'image/jpeg', 'text/plain',].indexOf(w.type));
        if (filterFiles.length !== fileList.length) {
          this.msg.warning(`文件格式不正确`);
          return filterFiles;
        }
        return fileList;
      }
    }
  ];

  // 提交表单按钮loading
  buttonLoading = false;

  userForm: FormGroup;

  constructor(private fb: FormBuilder,
              private msg: NzMessageService,
              private systemSettingService: SystemSettingService,
              private route: ActivatedRoute,
              private appService: AppService) {
  }

  ngOnInit() {
    this.getUrlParams();
    this.getCheckPasswordInfo();
    this.getRoleList();
    this.initUserForm();
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
      userImage: [''],
      gender: ['1'],
      birthday: [''],
      email: ['', [Validators.email]],
      weixin: [''],
      qq: [''],
      description: [''],
    });
  }

  submitForm() {
    formControlMarkAsDirty(this.userForm);
    if (this.userForm.valid) {
      this.buttonLoading = true;
      const response = this.fileList.length !== 0 ? this.fileList[0].response : false;
      if (response) {
        this.userForm.patchValue({
          userImage: response.data.virtualPath
        });
      }
      const data = new FormData();
      for (const i in this.userForm.value) {
        data.append(i, this.userForm.value[i]);
      }
      this.systemSettingService.addUser(data).subscribe(res => {
        this.buttonLoading = false;
        if (res.resCode === 1) {
          this.msg.success('新增用户成功');
          setTimeout(() => {
            history.go(-1);
          }, 1500);
        }
      });
    }
  }

  getUrlParams() {
    this.formStatus = this.route.snapshot.paramMap.get('status');
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

  userNameAsyncValidator = (ctrl: AbstractControl): Observable<ValidationErrors | null> =>
    ctrl.valueChanges.pipe(
      debounceTime(800),
      mergeMap(() => this.systemSettingService.checkUserNameExist(ctrl.value)),
      map(res => (res.resCode === 1 ? null : {userNameExistError: true})),
      first(),
      catchError(() => of(null))
    )


  cellphoneAsyncValidators = (ctrl: AbstractControl): Observable<ValidationErrors | null> =>
    ctrl.valueChanges.pipe(
      debounceTime(800),
      mergeMap(() => this.systemSettingService.checkCellphoneExist(ctrl.value)),
      map(res => (res.resCode === 1 ? null : {cellphoneExistError: true})),
      first(),
      catchError(() => of(null))
    )


  secondInputPasswordAsyncValidator = (ctrl: AbstractControl): Observable<ValidationErrors | null> =>
    ctrl.valueChanges.pipe(
      debounceTime(800),
      map(res => (res === this.userForm.value.password ? null : {notEqualWithFirstInput: true})),
      first()
    )

  customUploadReq = (item: UploadXHRArgs) => {
    const formData = new FormData();
    formData.append('file', item.file as any);
    return this.appService.upLoadFileUip(formData).subscribe((event: HttpEvent<{}>) => {
      if (event.type === HttpEventType.UploadProgress) {
        if (event.total > 0) {
          (event as any).percent = event.loaded / event.total * 100;
        }
        item.onProgress(event, item.file);
      } else if (event instanceof HttpResponse) {
        item.onSuccess(event.body, item.file, event);
        item.file.response = event.body;
      }
    }, (err) => { /* error */
      item.onError(err, item.file);
      this.msg.error('上传出错，请稍后再试');
    });
  }

  handlePreview = (file: UploadFile) => {
    this.previewImage = file.url || file.thumbUrl;
    this.previewVisible = true;
  }
}
