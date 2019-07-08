import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AppService} from '../../../service/app.service';
import {AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators} from '@angular/forms';
import {SystemSettingService} from '../../service/systemSetting.service';
import {formControlMarkAsDirty} from '../../../../util/formControlMarkAsDirty';
import {NzMessageService, UploadFile, UploadFilter, UploadXHRArgs} from 'ng-zorro-antd';
import {formatDate} from '../../../../util/formatDate';
import {Observable} from 'rxjs';
import {debounceTime, first, map} from 'rxjs/operators';
import {HttpEvent, HttpEventType, HttpResponse} from '@angular/common/http';

@Component({
  selector: 'app-nav-header',
  templateUrl: './nav-header.component.html',
  styleUrls: ['./nav-header.component.css']
})
export class NavHeaderComponent implements OnInit {
  avatar: string;
  userInfo: any;

  // 修改用户信息
  userInfoForm: FormGroup;
  isModifyUserInfoButtonLoading = false;
  isDetailModalVisible = false;

  // 修改用户密码
  modifyPasswordForm: FormGroup;
  isModifyPasswordModalVisible = false;
  isModifyPasswordButtonLoading = false;

  // 修改头像
  isModifyAvatarModalVisible = false;
  isModifyAvatarButtonLoading = false;
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
        const filterFiles = fileList.filter(w => ~['image/png', 'image/jpeg'].indexOf(w.type));
        if (filterFiles.length !== fileList.length) {
          this.msg.warning(`文件格式不正确`);
          return filterFiles;
        }
        return fileList;
      }
    }
  ];

  constructor(private router: Router,
              private appService: AppService,
              private fb: FormBuilder,
              private systemSettingService: SystemSettingService,
              private msg: NzMessageService) {
  }

  ngOnInit() {
    this.userInfo = JSON.parse(sessionStorage.getItem('userDTO'));
    this.avatar = this.appService.getFileUrl() + this.userInfo.userImage;
    this.initForm();
  }

  initForm() {
    this.userInfoForm = this.fb.group({
      userName: [''],
      name: [''],
      cellphone: ['', Validators.pattern('^[1][3,4,5,7,8][0-9]{9}$')],
      gender: [''],
      email: ['', Validators.email],
      birthday: [''],
      weixin: ['', Validators.pattern('^[a-zA-Z]([-_a-zA-Z0-9]{5,19})+$')],
      qq: ['', Validators.pattern('^[1-9][0-9]{4,10}$')],
      department: [''],
      position: ['']
    });
    this.modifyPasswordForm = this.fb.group({
      oldPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required]],
      secondInput: ['', [Validators.required], [this.secondInputPasswordAsyncValidator]],
    });
  }

  logout(): void {
    sessionStorage.removeItem('Access-Token');
    this.router.navigate(['/sign-in']);
  }

  seeUserInfo() {
    this.isDetailModalVisible = true;
    this.userInfoForm.patchValue({
      name: this.userInfo.name,
      userName: this.userInfo.userName,
      cellphone: this.userInfo.cellphone,
      gender: this.userInfo.gender,
      email: this.userInfo.email,
      birthday: this.userInfo.birthday,
      weixin: this.userInfo.weixin,
      qq: this.userInfo.qq,
      position: this.userInfo.position,
      department: this.userInfo.department
    });
  }

  modifyUserInfo() {
    formControlMarkAsDirty(this.userInfoForm);
    if (this.userInfoForm.valid) {
      this.isModifyUserInfoButtonLoading = true;
      if (this.userInfoForm.controls.birthday.dirty) {
        this.userInfoForm.patchValue({
          birthday: formatDate(this.userInfoForm.value.birthday)
        });
      }
      const data = new FormData();
      for (const key in this.userInfoForm.value) {
        data.append(key, this.userInfoForm.value[key]);
      }
      data.append('id', this.userInfo.id);
      this.systemSettingService.modifyUser(data).subscribe(res => {
        this.isModifyUserInfoButtonLoading = false;
        if (res.resCode === 1) {
          this.msg.success('修改成功');
          this.getUserInfoById();
          setTimeout(() => {
            this.isDetailModalVisible = false;
          }, 1500);
        }
      });
    }
  }

  modifyPassword() {
    formControlMarkAsDirty(this.modifyPasswordForm);
    if (this.modifyPasswordForm.valid) {
      this.isModifyPasswordButtonLoading = true;
      const params = {
        id: this.userInfo.id,
        oldPassword: this.modifyPasswordForm.value.oldPassword,
        newPassword: this.modifyPasswordForm.value.newPassword
      };
      this.systemSettingService.modifyPassword(params).subscribe(res => {
        this.isModifyPasswordButtonLoading = false;
        if (res.resCode === 1) {
          this.msg.success('修改成功');
          setTimeout(() => {
            this.isModifyPasswordModalVisible = false;
          }, 1500);
          this.modifyPasswordForm.reset();
        }
      });
    }
  }

  getUserInfoById() {
    this.systemSettingService.getUserInfoById(this.userInfo.id).subscribe(res => {
      if (res.resCode === 1) {
        this.userInfo = res.data;
        sessionStorage.setItem('userDTO', JSON.stringify(res.data));
      }
    });
  }

  secondInputPasswordAsyncValidator = (ctrl: AbstractControl): Observable<ValidationErrors | null> =>
    ctrl.valueChanges.pipe(
      debounceTime(800),
      map(res => (res === this.modifyPasswordForm.value.newPassword ? null : {notEqualWithFirstInput: true})),
      first()
    )

  showModifyAvatarModal() {
    this.isModifyAvatarModalVisible = true;
    this.fileList = [
      {
        uid: -1,
        name: 'xxx.png',
        status: 'done',
        url: this.avatar
      }
    ];
  }

  modifyAvatar() {
    if (this.fileList.length !== 0) {
      if (this.fileList[0].response) {
        this.isModifyAvatarButtonLoading = true;
        const params = {
          id: this.userInfo.id,
          userImage: this.fileList[0].response.data.url,
          name: this.userInfo.name
        };
        this.systemSettingService.modifyAvatar(params).subscribe(res => {
          this.isModifyAvatarButtonLoading = false;
          if (res.resCode === 1) {
            this.msg.success('修改成功');
            this.avatar = this.appService.getFileUrl() + res.data.userImage;
            setTimeout(() => {
              this.isModifyAvatarModalVisible = false;
            }, 1500);
          }
        });
      } else {
        this.isModifyAvatarModalVisible = false;
      }
    } else {
      this.msg.warning('请上传一张图片');
    }
  }

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
