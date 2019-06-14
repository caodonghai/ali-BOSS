import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AppService} from '../../../service/app.service';

@Component({
  selector: 'app-nav-header',
  templateUrl: './nav-header.component.html',
  styleUrls: ['./nav-header.component.css']
})
export class NavHeaderComponent implements OnInit {
  avatar: string;
  userInfo: any;

  isDetailModalVisible = false;
  isModifyPasswordModalVisible = false;

  constructor(private router: Router, private appService: AppService) {
  }

  ngOnInit() {
    this.userInfo = JSON.parse(sessionStorage.getItem('userDTO'));
    this.avatar = this.appService.getFileUrl() + this.userInfo.userImage;
  }

  logout(): void {
    sessionStorage.removeItem('Access-Token');
    this.router.navigate(['/sign-in']);
  }

  seeUserInfo() {
    this.isDetailModalVisible = true;
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

  modifyPassword() {

  }
}
