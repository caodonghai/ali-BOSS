import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-nav-header',
  templateUrl: './nav-header.component.html',
  styleUrls: ['./nav-header.component.css']
})
export class NavHeaderComponent implements OnInit {
  avatar: string;
  userName: string;

  isDetailModalVisible = false;
  isModifyPasswordModalVisible = false;

  constructor() {
  }

  ngOnInit() {
  }

  logout(): void {

  }

  seeUserInfo() {
    this.isDetailModalVisible = true
  }

  showModifyPasswordModal() {
    this.isModifyPasswordModalVisible = true;
  }

  handleDetailModalCancel() {
    this.isDetailModalVisible = false;
  }

  handleModifyPasswordModalCancel() {
    this.isModifyPasswordModalVisible = false;
  }

  modifyPassword(){

  }
}
