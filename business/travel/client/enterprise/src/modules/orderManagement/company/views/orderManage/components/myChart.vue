<template>
    <div :id="PillarId" style="width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;">
    </div>
</template>

<script>
export default {
    data() {
        return {
            time: null
        }
    },
    props: ['pillarData', 'PillarId', 'PillarColor', 'loadingFlag', 'pillarCityY', 'pillarDateY'],
    computed: {},
    methods: {
        drawChart() {
            var that = this
            var myChart = echarts.init(document.getElementById(that.PillarId))
            myChart.on('mouseover', params => {
                this.$emit('clickSeries', params);
            })
            if ('PillarId0' == that.PillarId) {
                myChart.showLoading({
                    text: 'loading',
                    color: '#c23531',
                    textColor: '#000',
                    maskColor: 'rgba(255, 255, 255, 1)',
                    effect: 'whirling',
                    zlevel: 0

                })

                if (that.loadingFlag[that.PillarId]) {
                    myChart.hideLoading()

                }
            }

            if ('PillarId1' == that.PillarId) {
                myChart.showLoading({
                    text: 'loading',
                    color: '#c23531',
                    textColor: '#000',
                    maskColor: 'rgba(255, 255, 255, 1)',
                    zlevel: 0

                })

                if (that.loadingFlag[that.PillarId]) {
                    myChart.hideLoading()
                }
            }
            let optionData = {
                // color: that.PillarColor,
                tooltip: {
                    trigger: 'axis',
                    axisPointer: { // 坐标轴指示器，坐标轴触发有效
                        type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
                    }
                },
                grid: {
                    left: '0',
                    // right: '4%',
                    bottom: '3%',
                    right: '12%',
                    // bottom: '9%',
                    containLabel: true
                },
                xAxis: [
                    {
                        type: 'category',
                        // data: ['北京', '上海', '广州', '深圳', '武汉', '西安'],
                        data: that.pillarData.name,
                        axisTick: {
                            alignWithLabel: true
                        },
                        axisLabel: {
                            // interval:0,//横轴信息全部显示  
                            // rotate:-18,//-15度角倾斜显示 
                            //   formatter: function (value, index) {
                            //    console.log(value.length)
                            //    if(value.length>2){
                            //      return '...'
                            //    }else{
                            //      return value
                            //    }  
                            // }
                        }

                    }

                ],
                yAxis: [
                    {
                        show: true, //  是否显示Y轴部分
                        type: 'value',
                        splitLine: { // 是否显示横向分割虚线
                            show: true,
                            lineStyle: {
                                type: 'dashed'
                            }
                        },
                        axisTick: { // 横向数据标线
                            show: false
                        },
                        axisLabel: {
                            //  formatter: '{value}%'   // 格式化提示数据
                            show: false
                        },
                        axisLine: { // 是否显示Y线
                            show: false
                        },
                        max: function () { // 设置柱形图y轴最大值标注
                            if (that.PillarId == 'PillarId1') {
                                return that.pillarCityY
                            } 
                            return that.pillarDateY
                                
                        }
                    }
                ],
                series: [
                    {
                        name: '出差支出',
                        type: 'bar',
                        barWidth: '30%',
                        data: that.pillarData.value,
                        label: {
                            normal: {
                                show: true,
                                position: 'top',
                                color: '#000000',
                                rotate: 45,
                                offset: [0, -20],
                                formatter: function (val) { //让series 中label文字转换
                                    var { data } = val
                                    return '￥' + data
                                }
                            }
                        },
                        itemStyle: {
                            normal: {
                                //每根柱子颜色设置
                                color: function (params) {
                                    let colorList = that.PillarColor;
                                    return colorList[params.dataIndex];
                                }
                            }
                        }

                    }
                ]
            }
            myChart.setOption(optionData)
        }
    },
    watch: {
        pillarData: {
            handler(newVal) {
                this.pillarData = newVal
                this.drawChart()
            },
            deep: true
        },
        PillarColor: {
            handler() {
                this.drawChart()
            },
            deep: true
        }
    },
    beforeCreate() {
    },
    created() {
    },
    beforeMount() {
    },
    mounted() {

    }
}
</script>