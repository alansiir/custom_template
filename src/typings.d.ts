declare module 'echarts' {
  export interface EChartOption {} // Pour ECharts 4.x
  export interface EChartsOption {} // Pour ECharts 5.x
  export const init: any;
  export default echarts;
  const echarts: any;
}