<template>
    <div :id="pieId" class="pick" style="width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
align-items: center">
    </div>
</template>

<script>
export default {
    data() {
        return {
            time: null
        }
    },
    props: ['pieId', 'pieData', 'circleColor', 'chartType', 'index', 'loadingFlagPie'],
    computed: {},
    methods: {
        drawChart() {
            var that = this
            var myChart = echarts.init(document.getElementById(that.pieId))
            if ('pieId0' == that.pieId) {
                myChart.showLoading({
                    text: 'loading',
                    color: '#c23531',
                    textColor: '#000',
                    maskColor: 'rgba(255, 255, 255, 1)',
                    effect: 'whirling',
                    zlevel: 0
                })

                if (that.loadingFlagPie[that.pieId]) {
                    myChart.hideLoading()

                }
            }
            if ('pieId1' == that.pieId) {
                myChart.showLoading({
                    text: 'loading',
                    color: '#c23531',
                    textColor: '#000',
                    maskColor: 'rgba(255, 255, 255, 1)',
                    effect: 'whirling',
                    zlevel: 0
                })

                if (that.loadingFlagPie[that.pieId]) {
                    myChart.hideLoading()

                }
            }

            var option = {
                tooltip: {
                    trigger: 'item',
                    formatter: '{a} <br/>{b}: {c} ({d}%)'
                },
                // legend: {
                //   orient: 'vertical',
                //   x: 'left',
                //   data: ['机票', '火车票', '酒店']
                // },
                series: [
                    {
                        name: that.chartType,
                        type: 'pie',
                        radius: ['28%', '54%'],
                        avoidLabelOverlap: true,
                        label: {
                            normal: {
                                show: true,
                                position: 'left',
                                color: '#000000',
                                padding: [12, 0, 0, 0],
                                formatter: '{c}({d}%)\n{hr|}\n{bottomstyle|{b}}',
                                // formatter: '{topstyle|￥{c}} ({d}%) \n{hr|}\n {bottomstyle|{b}}',
                                // backgroundColor: '#eee',
                                rich: {
                                    topstyle: {
                                        color: '@text-color',
                                        fontSize: 12,
                                        lineHeight: 22,
                                        align: 'center'
                                    },
                                    hr: {
                                        borderColor: that.circleColor[that.index],
                                        width: '100%',
                                        borderWidth: 0.5,
                                        height: 1
                                    },
                                    bottomstyle: {
                                        color: '#999',
                                        fontSize: 12,
                                        lineHeight: 22,
                                        align: 'center'
                                    }
                                }
                            }

                        },
                        labelLine: {
                            normal: {
                                show: true
                                // labelLine:{
                                //   length:500
                                // }
                            }
                        },
                        data: that.pieData
                        //     [
                        //       {value: 9240, name: '机票'},
                        //   {value: 5808, name: '火车票'},
                        //   {value: 11352, name: '酒店'},
                        // ]
                        // itemStyle: {  // 层次阴影
                        //   normal: {
                        //     shadowBlur: 10,
                        //     shadowOffsetX: 0,
                        //     shadowColor: 'rgba(0, 0, 0, 0.5)'
                        //   }
                        // }
                    }
                ],
                color: that.circleColor
            }
            myChart.setOption(option)
        }
    },
    watch: {
        pieData: {
            handler(newVal) {
                this.pieData = newVal
                this.drawChart()
            },
            deep: true
        }
    }
}
</script>