import {Component, OnInit} from '@angular/core';
import {ManageService} from '../../service/manage.service';

@Component({
  selector: 'app-actual-use',
  templateUrl: './actual-use.component.html',
  styleUrls: ['./actual-use.component.css']
})
export class ActualUseComponent implements OnInit {
  option = {
    tooltip: {},
    xAxis: {
      data: []
    },
    yAxis: {},
    series: [{
      type: 'bar',
      data: [],
      barWidth: 30
    }]
  };
  isLoading = true;
  echartsIntance;

  constructor(private manageService: ManageService) {
  }

  ngOnInit() {
  }

  onChartInit(e) {
    this.echartsIntance = e;
    let data = [];
    this.manageService.getProductPercent().subscribe(res => {
      this.isLoading = false;
      if (res.resCode === 1) {
        data = [...res.data].map(item => {
          let newItem: any = {};
          newItem.value = item.userNumber;
          newItem.name = item.specificationName;
          return newItem;
        });
        this.option.xAxis.data = data.map(item => item.name);
        this.option.series[0].data = data;
        this.echartsIntance.setOption(this.option);
      }
    });
  }

}
