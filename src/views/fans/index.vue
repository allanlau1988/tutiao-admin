<template>
    <div class="fan-container">
        <div ref="main" style="width: 600px;height:400px;">

        </div>
        <map-demo/>
    </div>
</template>

<script>
import echarts from 'echarts'
import MapDemo from './components/mapDemo.vue';
export default {
    name: 'FansIndex',
    components: {
        MapDemo
    },
    mounted () {
      //注意： 初始化操作DOM 一定要写到 mounted 钩子函数中
      var myChart = echarts.init(this.$refs.main);
      console.log(myChart)
      // 指定图表的配置项和数据
        var option = {
            title: {
                text: 'ECharts 入门示例'
            },
            tooltip: {},
            legend: {
                data:['销量']
            },
            xAxis: {
                data: ["衬衫","羊毛衫","雪纺衫","裤子","高跟鞋","袜子"]
            },
            yAxis: {},
            series: [{
                name: '销量',
                type: 'bar',
                data: [5, 20, 36, 10, 10, 20]
            }]
        };

        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
    }
}
</script>

<style scoped>

</style>