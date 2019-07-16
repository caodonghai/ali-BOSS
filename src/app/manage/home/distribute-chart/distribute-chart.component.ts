import {Component, OnInit} from '@angular/core';
import 'echarts/dist/extension/bmap.min';
import {ManageService} from '../../service/manage.service';

@Component({
  selector: 'app-distribute-chart',
  templateUrl: './distribute-chart.component.html',
  styleUrls: ['./distribute-chart.component.css']
})
export class DistributeChartComponent implements OnInit {
  isLoading = true;

  option = {
    title: {
      text: '',
      left: 'center'
    },
    tooltip: {
      trigger: 'item',
      formatter(params, ticket, callback) {
        return params.seriesName + ' : ' + params.value[2];
      }
    },
    bmap: {
      center: [104.114129, 37.550339],
      zoom: 5,
      roam: true,
      mapStyle: {
        styleJson: [
          {
            'featureType': 'water',
            'elementType': 'all',
            'stylers': {
              'color': '#044161'
            }
          },
          {
            'featureType': 'land',
            'elementType': 'all',
            'stylers': {
              'color': '#004981'
            }
          },
          {
            'featureType': 'boundary',
            'elementType': 'geometry',
            'stylers': {
              'color': '#064f85'
            }
          },
          {
            'featureType': 'railway',
            'elementType': 'all',
            'stylers': {
              'visibility': 'off'
            }
          },
          {
            'featureType': 'highway',
            'elementType': 'geometry',
            'stylers': {
              'color': '#004981'
            }
          },
          {
            'featureType': 'highway',
            'elementType': 'geometry.fill',
            'stylers': {
              'color': '#005b96',
              'lightness': 1
            }
          },
          {
            'featureType': 'highway',
            'elementType': 'labels',
            'stylers': {
              'visibility': 'off'
            }
          },
          {
            'featureType': 'arterial',
            'elementType': 'geometry',
            'stylers': {
              'color': '#004981'
            }
          },
          {
            'featureType': 'arterial',
            'elementType': 'geometry.fill',
            'stylers': {
              'color': '#00508b'
            }
          },
          {
            'featureType': 'poi',
            'elementType': 'all',
            'stylers': {
              'visibility': 'off'
            }
          },
          {
            'featureType': 'green',
            'elementType': 'all',
            'stylers': {
              'color': '#056197',
              'visibility': 'off'
            }
          },
          {
            'featureType': 'subway',
            'elementType': 'all',
            'stylers': {
              'visibility': 'off'
            }
          },
          {
            'featureType': 'manmade',
            'elementType': 'all',
            'stylers': {
              'visibility': 'off'
            }
          },
          {
            'featureType': 'local',
            'elementType': 'all',
            'stylers': {
              'visibility': 'off'
            }
          },
          {
            'featureType': 'arterial',
            'elementType': 'labels',
            'stylers': {
              'visibility': 'off'
            }
          },
          {
            'featureType': 'boundary',
            'elementType': 'geometry.fill',
            'stylers': {
              'color': '#029fd4'
            }
          },
          {
            'featureType': 'building',
            'elementType': 'all',
            'stylers': {
              'color': '#1a5787'
            }
          },
          {
            'featureType': 'label',
            'elementType': 'all',
            'stylers': {
              'visibility': 'off'
            }
          }
        ]
      }
    },
    series: [
      {
        name: '租户数量',
        type: 'scatter',
        coordinateSystem: 'bmap',
        data: [],
        symbolSize(val) {
          return val[2] * 2; // 控制图标大小
        },
        label: {
          normal: {
            formatter: '{b}',
            position: 'right',
            show: false
          },
          emphasis: {
            show: true
          }
        },
        itemStyle: {
          normal: {
            color: '#ddb926'
          }
        }
      }
    ]
  };

  private echartsIntance;

  constructor(private manageService: ManageService) {
  }

  ngOnInit() {
    this.manageService.getRegionTenantAmount().subscribe(res => {
      this.isLoading = false;
      if (res.resCode === 1) {
        this.option.series[0].data = res.data.map(item => {
          const newItem = {};
          newItem.name = item.areaName;
          newItem.value = [parseFloat(item.longitude), parseFloat(item.latitude), item.number];
          return newItem;
        });
        this.echartsIntance.setOption(this.option);
      }
    });
  }

  onChartInit(e) {
    this.echartsIntance = e;
  }

}
