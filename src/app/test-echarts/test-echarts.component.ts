import { Component } from '@angular/core';
import { EChartsOption } from 'echarts';

@Component({
  selector: 'app-test-echarts',
  template: '<div echarts [options]="chartOptions" style="height: 400px; width: 600px;"></div>'
})
export class TestEchartsComponent {
  chartOptions: EChartsOption = {
    xAxis: {
      type: 'category',
      data: ['Jan', 'Feb', 'Mar', 'Apr', 'May']
    },
    yAxis: {
      type: 'value'
    },
    series: [{
      data: [65, 59, 80, 81, 56],
      type: 'bar'
    }]
  };
}