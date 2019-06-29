import {Component, OnInit} from '@angular/core';
import {SystemSettingService} from '../../service/systemSetting.service';
import {ZTreeSetting} from '../../../interface';

@Component({
  selector: 'app-data-dictionary',
  templateUrl: './data-dictionary.component.html',
  styleUrls: ['./data-dictionary.component.css']
})
export class DataDictionaryComponent implements OnInit {
  private treeSetting: ZTreeSetting = {
    async: {
      enable: true,
      dataType: 'json',
      url: ''
    }
  };

  constructor(private systemSettingService: SystemSettingService) {
  }

  ngOnInit() {
    this.initDataDictionaryTree();
  }

  initDataDictionaryTree() {
    this.systemSettingService.getDataDictionaryTree().subscribe(res => {
      if (res.resCode === 1) {
        $.fn.zTree.init($('#dataDictionaryTree'), this.treeSetting, res.data);
      }
    });
  }

}
