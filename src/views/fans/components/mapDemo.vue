<template>
    <div class="fan-container">
        <div ref="main" style="width: 600px;height:400px;">

        </div>
    </div>
</template>

<script>
import echarts from 'echarts'
export default {
    name: 'MapDemo',
    mounted () {
      //注意： 初始化操作DOM 一定要写到 mounted 钩子函数中
      var myChart = echarts.init(this.$refs.main);
      console.log(myChart)
      // 指定图表的配置项和数据
        var option = {
             tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)'
    },
    legend: {
        orient: 'vertical',
        left: 10,
        data: ['直接访问', '邮件营销', '联盟广告', '视频广告', '搜索引擎']
    },
    series: [
        {
            name: '访问来源',
            type: 'pie',
            radius: ['50%', '70%'],
            avoidLabelOverlap: false,
            label: {
                show: false,
                position: 'center'
            },
            emphasis: {
                label: {
                    show: true,
                    fontSize: '30',
                    fontWeight: 'bold'
                }
            },
            labelLine: {
                show: false
            },
            data: [
                {value: 335, name: '直接访问'},
                {value: 310, name: '邮件营销'},
                {value: 234, name: '联盟广告'},
                {value: 135, name: '视频广告'},
                {value: 1548, name: '搜索引擎'}
            ]
        }
    ]
        };

        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
    }
}
</script>

<style scoped>

</style>