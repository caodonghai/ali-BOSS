import {Component, OnInit} from '@angular/core';
import {formatDateTime} from '../../../util/formatDate';
import {ManageService} from '../service/manage.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NzMessageService, NzModalService, UploadFile, UploadFilter, UploadXHRArgs} from 'ng-zorro-antd';
import {Observable, Observer} from 'rxjs';
import {HttpEvent, HttpEventType, HttpResponse} from '@angular/common/http';
import {AppService} from '../../service/app.service';

@Component({
  selector: 'app-information-notice',
  templateUrl: './information-notice.component.html',
  styleUrls: ['./information-notice.component.css']
})
export class InformationNoticeComponent implements OnInit {
  informationNoticeList: any[] = [];
  title = '';
  type = '';
  time = [];
  startTime = '';
  endTime = '';
  loading = false;
  pageSize = 10;
  pageNumber = 1;
  total = 0;
  selected: any = {};
  isAddModalVisible = false;
  isChooseUserModalVisible = false;
  isSaveLoading = false;

  product: '';
  productList: string[] = [];
  tenantList: any[] = [];
  tenantPageNumber = 1;
  tenantPageSize = 10;
  tenantTotal = 0;
  selectedTenantList: any[] = [];
  isGetTenantListLoading = false;

  addForm: FormGroup;

  uploadUrl = '';
  fileList: any = [];
  filters: UploadFilter[] = [
    // {
    //   name: 'type',
    //   fn: (fileList: UploadFile[]) => {
    //     const filterFiles = fileList.filter(w => ~['image/png', 'image/jpeg', 'text/plain', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].indexOf(w.type));
    //     if (filterFiles.length !== fileList.length) {
    //       this.msg.error(`文件格式不正确`);
    //       return filterFiles;
    //     }
    //     // const filterAmountFiles = fileList.filter((item, index) => index < 4);
    //     // if (this.fileList.length >= 4) {
    //     //   this.msg.error('最多只能上传4个附件');
    //     //   return filterAmountFiles;
    //     // }
    //     return fileList;
    //   }
    // },
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

  richEditorContent = '';

  constructor(private manageService: ManageService,
              private fb: FormBuilder,
              private appService: AppService,
              private msg: NzMessageService,
              private modal: NzModalService) {
  }

  ngOnInit() {
    this.getInformationNoticeList();
    this.addForm = this.fb.group({
      title: ['', [Validators.required]],
      type: ['', [Validators.required]],
      receiveIds: [[], [Validators.required]],
      content: ['', [Validators.required]]
    });
    this.manageService.getProductList().subscribe(res => {
      this.productList = [...res.data];
    });
    this.getTenantList();
  }

  getInformationNoticeList() {
    const params = {
      pageSize: this.pageSize,
      pageNumber: this.pageNumber,
      title: this.title,
      startTime: this.startTime,
      endTime: this.endTime,
      type: this.type ? this.type : ''
    };
    this.loading = true;
    this.manageService.getInformationNoticeList(params).subscribe(res => {
      this.loading = false;
      this.informationNoticeList = res.data.list;
      this.total = res.data.total;
    });
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

  resetSearchCondition() {
    this.type = '';
    this.startTime = '';
    this.endTime = '';
    this.time = [];
    this.title = '';
  }

  handleTableClick(e) {
    const method = e.target.dataset.method;
    const id = e.target.dataset.id;
    if (method && id) {
      this.selected = this.informationNoticeList.find(item => item.id === id);
      if (method === 'detail') {
        // this.isDetailModalVisible = true;
      } else if (method === 'recall') {
        this.recall();
      } else if (method === 'delete') {
        this.deleteItem();
      }
    }
  }

  recall() {
    this.modal.confirm({
      nzTitle: '撤回',
      nzContent: '确定要撤回这条信息通知吗？',
      nzOnOk: () =>
        new Promise((resolve, reject) => {
          this.manageService.recallInfomationNotice({id: this.selected.id}).subscribe(() => {
              this.msg.success('撤回成功');
              this.getInformationNoticeList();
            }, () => {
            },
            () => {
              resolve();
            }
          );
        })
    });
  }

  deleteItem() {
    this.modal.confirm({
      nzTitle: '删除',
      nzContent: '确定要删除这条信息通知吗？',
      nzOnOk: () =>
        new Promise((resolve, reject) => {
          this.manageService.deleteInformationNotice({id: this.selected.id}).subscribe(() => {
              this.msg.success('删除成功');
              this.getInformationNoticeList();
            }, () => {
            },
            () => {
              resolve();
            }
          );
        })
    });
  }

  loadMore(): void {
    if (this.tenantTotal < this.tenantList.length) {
      const params = {
        productName: this.product,
        pageNumber: this.tenantPageNumber,
        pageSize: this.tenantPageSize
      };
      this.isGetTenantListLoading = true;
      this.manageService.getTenantList(params).subscribe(res => {
        this.isGetTenantListLoading = false;
        this.tenantList = [...this.tenantList, ...res.data.list];
        this.tenantTotal = res.data.total;
      });
    }
  }

  getTenantList() {
    this.tenantList = [];
    this.tenantPageNumber = 1;
    this.tenantPageSize = 10;
    const params = {
      productName: this.product,
      pageNumber: this.tenantPageNumber,
      pageSize: this.tenantPageSize
    };
    this.isGetTenantListLoading = true;
    this.manageService.getTenantList(params).subscribe(res => {
      this.isGetTenantListLoading = false;
      this.tenantList = [...res.data.list];
      this.tenantTotal = res.data.total;
    });
  }

  confirmTenantSelect() {
    this.isChooseUserModalVisible = false;
    this.addForm.patchValue({
      receiveIds: this.selectedTenantList
    });
  }

  submitForm() {
    this.addForm.patchValue({
      content: this.richEditorContent
    });
    for (const i in this.addForm.controls) {
      this.addForm.controls[i].markAsDirty();
      this.addForm.controls[i].updateValueAndValidity();
    }
    if (this.addForm.valid) {
      this.isSaveLoading = true;
      const uploadFileResponseList = this.fileList.map(item => item.response.data[0]).join(',');
      const params = Object.assign({}, this.addForm.value, {accessoryIds: uploadFileResponseList});
      this.manageService.addInformationNotice(params).subscribe(res => {
        this.isSaveLoading = false;
        this.msg.success('新增成功');
        this.isAddModalVisible = false;
        this.getInformationNoticeList();
      });
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

  getContent(e: string): void {
    this.richEditorContent = e;
  }
}
