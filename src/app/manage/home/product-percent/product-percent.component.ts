import {Component, OnInit} from '@angular/core';
import {ManageService} from '../../service/manage.service';

@Component({
  selector: 'app-product-percent',
  templateUrl: './product-percent.component.html',
  styleUrls: ['./product-percent.component.css']
})
export class ProductPercentComponent implements OnInit {
  isLoading = true;
  option = {
    tooltip: {
      trigger: 'item',
      formatter: '{b} : {c} ({d}%)'
    },
    legend: {
      orient: 'vertical',
      top: '0',
      right: '0',
      data: []
    },
    series: [
      {
        type: 'pie',
        radius: '65%',
        center: ['50%', '50%'],
        selectedMode: 'single',
        data: [],
        itemStyle: {
          emphasis: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  };

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
          newItem.value = item.accountInUsedNumber;
          newItem.name = item.specificationName;
          return newItem;
        });
        this.option.legend.data = data.map(item => item.name);
        this.option.series[0].data = data;
        this.echartsIntance.setOption(this.option);
      }
    });
  }
}
