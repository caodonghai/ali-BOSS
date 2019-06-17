import {Component, OnInit} from '@angular/core';
import {NzMessageService, NzModalService, UploadFile, UploadFilter, UploadXHRArgs} from 'ng-zorro-antd';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ManageService} from '../service/manage.service';
import {formatDateTime} from '../../../util/formatDate';
import {AppService} from '../../service/app.service';
import {Observable, Observer} from 'rxjs';
import {HttpEvent, HttpEventType, HttpRequest, HttpResponse} from '@angular/common/http';


@Component({
  selector: 'app-information-feedback',
  templateUrl: './information-feedback.component.html',
  styleUrls: ['./information-feedback.component.css']
})
export class InformationFeedbackComponent implements OnInit {
  informationFeedbackList: any[] = [];
  title = '';
  type = '';
  time = [];
  startTime = '';
  endTime = '';
  pageSize = 10;
  pageNumber = 1;
  total = 0;
  loading = false;
  selected: any = {};
  isSaveLoading = false;

  uploadUrl = '';
  fileList: any = [];
  filters: UploadFilter[] = [
    {
      name: 'type',
      fn: (fileList: UploadFile[]) => {
        const filterFiles = fileList.filter(w => ~['image/png', 'image/jpeg', 'text/plain', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].indexOf(w.type));
        if (filterFiles.length !== fileList.length) {
          this.msg.error(`文件格式不正确`);
          return filterFiles;
        }
        // const filterAmountFiles = fileList.filter((item, index) => index < 4);
        // if (this.fileList.length >= 4) {
        //   this.msg.error('最多只能上传4个附件');
        //   return filterAmountFiles;
        // }
        return fileList;
      }
    },
    {
      name: 'async',
      fn: (fileList: UploadFile[]) => {
        return new Observable((observer: Observer<UploadFile[]>) => {
          observer.next(fileList);
          observer.complete();
        });
      }
    }
  ];

  typeEnum = {
    '1': '问题',
    '2': '建议',
    '3': '其他'
  };

  isDetailModalVisible = false;
  isReplyModalVisible = false;

  replyForm: FormGroup;

  constructor(private modal: NzModalService,
              private fb: FormBuilder,
              private manageService: ManageService,
              private msg: NzMessageService,
              private appService: AppService) {
    this.replyForm = this.fb.group({
      status: ['', [Validators.required]],
      content: ['', [Validators.required, Validators.maxLength(400)]],
      accessory: [[]],
    });
  }

  ngOnInit() {
    this.getInformationFeedbackList();
    this.uploadUrl = this.appService.getUploadUrl();
  }

  getInformationFeedbackList() {
    const params = {
      title: this.title,
      type: this.type ? this.type : '',
      startTime: this.startTime,
      endTime: this.endTime,
      pageSize: this.pageSize,
      pageNumber: this.pageNumber
    };
    this.loading = true;
    this.manageService.getInformationFeedbackList(params).subscribe(res => {
      this.loading = false;
      this.informationFeedbackList = res.data.list;
      this.total = res.data.total;
    });
  }

  resetSearchCondition() {
    this.title = '';
    this.type = '';
    this.time = [];
    this.startTime = '';
    this.endTime = '';
  }

  handleDateChange(result): void {
    if (result.length === 0) {
      this.startTime = '';
      this.endTime = '';
    } else {
      this.startTime = formatDateTime(result[0]);
      this.endTime = formatDateTime(result[1]);
    }
  }

  handleTableClick(e: any) {
    const method = e.target.dataset.method;
    const id = e.target.dataset.id;
    if (method && id) {
      this.selected = this.informationFeedbackList.find(item => item.id === id);
      if (method === 'detail') {
        this.isDetailModalVisible = true;
      } else if (method === 'delete') {
        this.deleteData();
      } else if (method === 'reply') {
        this.showReplyFormModal();
      }
    }
  }

  showReplyFormModal() {
    this.isReplyModalVisible = true;
    this.replyForm.patchValue({
      title: this.selected.title
    });
  }

  deleteData() {
    this.modal.confirm({
      nzTitle: '删除',
      nzContent: '确定要删除这条信息反馈吗？',
      nzOnOk: () =>
        new Promise((resolve, reject) => {
          this.manageService.deleteInformationFeedback({id: this.selected.id}).subscribe(() => {
              this.msg.success('删除成功');
              this.getInformationFeedbackList();
            }, (error) => {
            },
            () => {
              resolve();
            }
          );
        })
    });
  }

  submitForm() {
    for (const i in this.replyForm.controls) {
      this.replyForm.controls[i].markAsDirty();
      this.replyForm.controls[i].updateValueAndValidity();
    }
    if (this.replyForm.valid) {
      const fileListResponse = this.fileList.map(item => item.response.data[0]);
      this.replyForm.patchValue({
        accessory: fileListResponse === [] ? fileListResponse : ''
      });
      const params = Object.assign({}, this.replyForm.value, {id: this.selected.id});
      this.manageService.replyInformationFeedback(params).subscribe(res => {
        if (res.resCode === 1) {
          this.msg.success('答复成功');
          this.isReplyModalVisible = false;
          this.resetForm();
        }
      });
    }
  }

  resetForm() {
    this.replyForm.reset();
    this.fileList = [];
    for (const key in this.replyForm.controls) {
      this.replyForm.controls[key].markAsPristine();
      this.replyForm.controls[key].updateValueAndValidity();
    }
  }

  customUploadReq = (item: UploadXHRArgs) => {
    const formData = new FormData();
    formData.append('files', item.file as any);
    return this.appService.uploadFile(formData).subscribe((event: HttpEvent<{}>) => {
      if (event.type === HttpEventType.UploadProgress) {
        if (event.total > 0) {
          (event as any).percent = event.loaded / event.total * 100;
        }
        item.onProgress(event, item.file);
      } else if (event instanceof HttpResponse) {
        item.onSuccess(event.body, item.file, event);
        item.file.response = event.body;
        this.fileList.push(item.file);
      }
    }, (err) => { /* error */
      item.onError(err, item.file);
      this.msg.error('上传出错，请稍后再试');
    });
  };

  removeFile = (file: UploadFile) => {
    this.fileList = this.fileList.filter(item => item.uid !== file.uid);
    return true;
  }

}
