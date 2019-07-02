import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators} from '@angular/forms';
import {HttpEvent, HttpEventType, HttpResponse} from '@angular/common/http';
import {SystemSettingService} from '../../../service/systemSetting.service';
import {catchError, debounceTime, first, map, mergeMap} from 'rxjs/operators';
import {AppService} from '../../../../service/app.service';
import {formControlMarkAsDirty} from '../../../../../util/formControlMarkAsDirty';
import {Observable, of} from 'rxjs';
import {NzMessageService, UploadFile, UploadFilter, UploadXHRArgs} from 'ng-zorro-antd';
import {ActivatedRoute} from '@angular/router';
import {formatDate} from '../../../../../util/formatDate';

@Component({
  selector: 'app-modify-user',
  templateUrl: './modify-user.component.html',
  styleUrls: ['./modify-user.component.css']
})
export class ModifyUserComponent implements OnInit {
  private id: string;
  roleList: any[] = [];
  statusList: any[] = [];
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
    this.getRoleList();
    this.getStatusList();
    this.initUserForm();
    this.getUserDetail();
  }

  initUserForm() {
    this.userForm = this.fb.group({
      roleIds: [null, [Validators.required]],
      name: ['', [Validators.required]],
      userName: ['', [Validators.required, Validators.pattern('^[A-Za-z0-9]+$')], [this.userNameAsyncValidator]],
      alias: [''],
      position: [''],
      cellphone: ['', [Validators.required, Validators.pattern('^[1][3,4,5,7,8][0-9]{9}$')], [this.cellphoneAsyncValidators]],
      regionId: ['', [Validators.required]],
      status: ['', [Validators.required]],
      allowLogWeb: [true],
      allowLogMobile: [true],
      userImage: [''],
      gender: [1],
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
      if (this.userForm.controls.birthday.dirty) {
        this.userForm.patchValue({
          birthday: formatDate(this.userForm.value.birthday)
        });
      }
      const data = new FormData();
      for (const i in this.userForm.value) {
        data.append(i, this.userForm.value[i]);
      }
      data.append('id', this.id);
      this.modifyUser(data);
    }
  }


  modifyUser(data) {
    this.systemSettingService.modifyUser(data).subscribe(res => {
      if (res.resCode === 1) {
        this.msg.success('修改成功');
        this.buttonLoading = false;
        setTimeout(() => {
          history.go(-1);
        }, 1500);
      }
    });
  }

  getUserDetail() {
    this.id = this.route.snapshot.paramMap.get('id');
    this.systemSettingService.getUserDetailById(this.id).subscribe(res => {
      if (res.resCode === 1) {
        const user = res.data;
        this.userForm.patchValue({
          roleIds: user.roleList.map(item => item.id),
          name: user.name,
          userName: user.userName,
          alias: user.alias,
          position: user.position,
          cellphone: user.cellphone,
          regionId: user.regionId,
          status: user.status,
          allowLogWeb: user.allowLogWeb,
          allowLogMobile: user.allowLogMobile,
          userImage: user.userImage,
          gender: user.gender,
          birthday: user.birthday,
          email: user.email,
          weixin: user.weixin,
          qq: user.qq,
          description: user.description
        });
        if (res.data.userImage) {
          this.fileList = [
            {
              uid: -1,
              name: 'xxx.png',
              status: 'done',
              url: `${this.appService.getFileUrl()}${res.data.userImage}`
            }
          ];
        }
      }
    });
  }


  getRoleList() {
    this.systemSettingService.getRoleList().subscribe(res => {
      if (res.resCode === 1) {
        this.roleList = res.data.records;
      }
    });
  }

  getStatusList() {
    this.systemSettingService.getUserStatusList().subscribe(res => {
      if (res.resCode === 1) {
        this.statusList = res.data;
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
    if (ctrl.dirty) {
      return ctrl.valueChanges.pipe(
        debounceTime(800),
        mergeMap(() => this.systemSettingService.checkUserNameExist(ctrl.value)),
        map(res => (res.resCode === 1 ? null : {userNameExistError: true})),
        first(),
        catchError(() => of(null))
      );
    } else {
      return of(null);
    }
  }


  cellphoneAsyncValidators = (ctrl: AbstractControl): Observable<ValidationErrors | null> => {
    if (ctrl.dirty) {
      ctrl.valueChanges.pipe(
        debounceTime(800),
        mergeMap(() => this.systemSettingService.checkCellphoneExist(ctrl.value)),
        map(res => (res.resCode === 1 ? null : {cellphoneExistError: true})),
        first(),
        catchError(() => of(null))
      );
    } else {
      return of(null);
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
