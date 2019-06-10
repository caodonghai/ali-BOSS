import {Component, OnInit} from '@angular/core';
import {NzModalService} from 'ng-zorro-antd';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-information-feedback',
  templateUrl: './information-feedback.component.html',
  styleUrls: ['./information-feedback.component.css']
})
export class InformationFeedbackComponent implements OnInit {
  title: string;
  type: string;
  list: any[];
  time: string;
  selected: {};

  isDetailModalVisible = false;
  isReplyModalVisible = false;

  replyForm: FormGroup;

  constructor(private modal: NzModalService, private fb: FormBuilder) {
    this.replyForm = this.fb.group({
      title: ['', [Validators.required]]
    });
  }

  ngOnInit() {
    this.list = [{id: '1212'}];
  }


  handleTableClick(e: any) {
    const method = e.target.dataset.method;
    const id = e.target.dataset.id;
    if (method && id) {
      this.selected = this.list.find(item => item.id === id);
      if (method === 'detail') {
        this.seeDetail();
      } else if (method === 'delete') {
        this.deleteData();
      } else if (method === 'reply') {
        this.isReplyModalVisible = true;
      }
    }
  }

  seeDetail() {
    this.isDetailModalVisible = true;
  }

  handleDetailModalCancel() {
    this.isDetailModalVisible = false;
  }

  deleteData() {
    this.modal.confirm({
      nzTitle: 'Do you Want to delete these items?',
      nzContent: 'When clicked the OK button, this dialog will be closed after 1 second',
      nzOnOk: () =>
        new Promise((resolve, reject) => {
          setTimeout(Math.random() > 0.5 ? resolve : reject, 1000);
        }).catch(() => console.log('Oops errors!'))
    });
  }

  handleReplyModalCancel() {
    this.isReplyModalVisible = false;
  }

  submitForm() {
    for (const i in this.replyForm.controls) {
      this.replyForm.controls[i].markAsDirty();
      this.replyForm.controls[i].updateValueAndValidity();
    }
  }

  resetForm(e) {
    e.preventDefault();
    this.replyForm.reset();
    for (const key in this.replyForm.controls) {
      this.replyForm.controls[key].markAsPristine();
      this.replyForm.controls[key].updateValueAndValidity();
    }
  }

}
