<template>
    <div
        id="chartBox"
        style="width: 100%;height: 100%"
    ></div>
</template>
<script>
/**
 * 图表组件，根据UE需求，有 折线图 type: "line",、柱状图type: "bar", 两种。
 * 所需要的的数据，需要在外面组装好，chartData传进来
 *
 * 鼠标悬停时的弹框样式跟echarts的默认效果不一致，需要自定义，参见getCustomerTootip
 *
 * 折线有多条时候，图表的图例过多会自动显示滚动条
 *
 * 横坐标日期根据数据自适应展示，若日期过多，可最多显示15条，其余数据可不展示日期，直接以折线图上的“点”代替
 * 根据测试，echart绘图时候，会根据 不互相遮盖 的原则 动态计算显示多少 横坐标label，
 * 不会显示所有的横坐标数据，一般不会超过15条。 *
 *
 */
// import NP from "number-precision";
export default {
    props: {
        chartData: {
            type: Object,
            default(){
                return {
                    xAxisData: [], //直角坐标系，X轴的数组
                    seriesData: [] //折线或者柱状图的数组
                }
            }
        },
        legend: {
            //是否需要显示 图例
            type: Boolean,
            default: false
        },
        title:{
            // 图表标题
            type: Array,
            default(){
                return []
            } 
        }
    },
    data() {
        return {
            myChartIns: null //图标对象
        };
    },
    watch: {
        //数据变化，重新绘制图表
        chartData: {
            handler() {
                this.drawChart();
            },
            deep: true
        }
    },
    created() {},
    mounted() {
        // console.log("chart mounted");
        this.drawChart();
    },
    methods: {
        drawChart() {
            // console.log("chart drawChart");
            var that = this;
            // 基于准备好的dom，初始化echarts实例
            if (!that.myChartIns) {
                that.myChartIns = echarts.init(
                    document.getElementById("chartBox")
                );
            }
            if (
                that.myChartIns &&
                that.chartData &&
                that.chartData.xAxisData &&
                that.chartData.xAxisData.length > 0 &&
                that.chartData.seriesData &&
                that.chartData.seriesData.length > 0
            ) {
                // that.myChartIns.hideLoading();
                // 指定图表的配置项和数据
                var option = {
                    title: this.title,
                    tooltip: {
                        trigger: "axis" //坐标系触发，
                        // //提示框
                        // show: true,
                        // backgroundColor: "#ffffff",
                        // borderColor: "#333333",
                        // broderWidth: 1,
                        
                        // axisPointer: {
                        //     type: "line" //指示器类型
                        // },
                        // textStyle: {
                        //     color: "#333333"
                        // },
                        // formatter: function (params) {
                        //     return that.getCustomerTootip(params);
                        // },
                        // extraCssText: "box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);"
                    },
                    //直角坐标系的X轴的数据
                    xAxis: {
                        axisTick: {
                            show: true,
                            //可以保证刻度线和标签对齐
                            alignWithLabel: true,
                            //坐标轴刻度的显示间隔，
                            interval: () => {
                                //第一个参数是类目的 index，第二个值是类目名称，如果跳过则返回 false
                                return true;
                            },
                            axisLabel: {
                                show: true,
                                interval: 0
                            }
                        },
                        data: that.chartData.xAxisData
                    },
                    //直角坐标系的y轴的数据
                    yAxis: {},
                    series: that.chartData.seriesData
                };
                if (that.legend) {
                    //动态设置是否需要显示图例
                    option.legend = {
                        //设置图例样式
                        icon: "rect", //图例前面的图标的样式
                        itemHeight: 2, //图例前面的图标的高度
                        itemWidth: 15, //图例前面的图标的宽度
                        type: "scroll", //当数据过多的时候，图例可以滑动
                        orient: "horizontal", //当数据过多的时候，图例左右滑动
                        bottom: 0, //设置图标位于底部
                        textStyle: { padding: [3, 0, 3, 0] }
                    };
                    //图标绘制区域大小设置，保证图表区域跟图例区域 不要重叠
                    option.grid = { bottom: 60 };
                }
                // 使用刚指定的配置项和数据显示图表。
                that.myChartIns.setOption(option);
            } else {
                console.info("some error");
                // that.myChartIns.showLoading();
            }
        },
        /**
         * 自定义鼠标悬停的提示框
         */
        getCustomerTootip(params) {
            const that = this;
            //根据列名的长度设置2个宽度，
            let tooltipMap = { short: "140px", long: "175px" };
            let tootipWidth = tooltipMap["short"];
            if (params[0].name.length > 10) {
                tootipWidth = tooltipMap["long"];
            }
            var tooltipHtml =
                "<div style='width:" +
                tootipWidth +
                ";'>" +
                "<div style='font-size:14px;padding:5px;'>" +
                params[0].name
            +"</div>";
            for (var i = 0, l = params.length; i < l; i++) {
                let lineHeight = 18;
                let lineWordLegth = 8; //每行字体最大宽度
                let lineRealHeight = that.getLineRealHeight(
                    params[i].seriesName.length,
                    lineWordLegth,
                    lineHeight
                );
                // console.log("lineRealHeight=" + lineRealHeight);
                tooltipHtml +=
                    "<div><div style='position:relative;font-size:12px;height:" +
                    lineRealHeight +
                    "px;'>" +
                    "<div style='position:absolute;width:95px;'>" +
                    "<div style='float:left;padding:8px 5px 8px 0px;'><div style='height:3px;width:3px;background:" +
                    params[i].color +
                    ";'></div></div>" +
                    "<div style='margin-left:8px;display:block;word-wrap:break-word;word-break:break-all;white-space:pre-wrap;'>" +
                    params[i].seriesName +
                    "</div>" +
                    "</div>" +
                    "<div style='position:absolute;left:95px;right:0;text-align:right;white-space:nowrap;'>" +
                    params[i].value +
                    "</div>" +
                    "</div></div>";
            }
            tooltipHtml += "</div>";
            return tooltipHtml;
        },
        /**
         * 根据字体的长度动态计算组件的高度
         */
        // getLineRealHeight(size, wordSize, lineHeight) {
        //     let r1 = Math.floor(NP.divide(NP.minus(size, 1), wordSize));
        //     // console.log("r1=" + r1);
        //     return NP.times(NP.plus(r1, 1), lineHeight);
        // },
        getLineRealHeight(){}
    }
};
</script>