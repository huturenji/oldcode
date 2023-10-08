<template>
  <div
    :id="pieId"
    class="pick"
    style="width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
align-items: center"
  ></div>
</template>

<script>
//  import echarts from 'echarts'

export default {
  data() {
    return {
      time: null
    };
  },
  props: [
    "pieId",
    "pieData",
    "circleColor",
    "chartType",
    "index",
    "loadingFlagPie"
  ],
  computed: {},
  methods: {
    drawChart() {
      var that = this;
      // debugger
      var myChart = echarts.init(document.getElementById(that.pieId));
      if ("pieId0" == that.pieId) {
        myChart.showLoading({
          text: "loading",
          color: "#c23531",
          textColor: "#000",
          maskColor: "rgba(255, 255, 255, 1)",
          effect: "whirling",
          zlevel: 0
        });
        if (that.loadingFlagPie[that.pieId]) {
          myChart.hideLoading();
        }
      }

      if ("pieId1" == that.pieId) {
        myChart.showLoading({
          text: "loading",
          color: "#c23531",
          textColor: "#000",
          maskColor: "rgba(255, 255, 255, 1)",
          effect: "whirling",
          zlevel: 0
        });

        if (that.loadingFlagPie[that.pieId]) {
          myChart.hideLoading();
        }
      }

      if ("pieId2" == that.pieId) {
        myChart.showLoading({
          text: "loading",
          color: "#c23531",
          textColor: "#000",
          maskColor: "rgba(255, 255, 255, 1)",
          zlevel: 0
        });

        if (that.loadingFlagPie[that.pieId]) {
          myChart.hideLoading();
        }
      }

      var option = {
        title: {
          // text: '天气情况统计',
          // subtext: '总支出',
          // left: 'left'
        },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b}: {c} ({d}%)"
        },
        // legend: {
        //   orient: 'vertical',
        //   x: 'left',
        //   data: ['机票', '火车票', '酒店']
        // },
        series: [
          {
            name: that.chartType,
            type: "pie",
            radius: ["20%", "35%"],
            avoidLabelOverlap: true,
            labelLine: {
              normal: {
                //   show: true,
                length: 5 // 提示线长度
              }
            },
            label: {
              normal: {
                show: true,
                position: "left",
                color: "#000000",
                formatter:"{topstyle|{c}}\n{hr|}\n{bottomstyle|{b}}({bottomstyle2|{d}}%)",
                rich: {
                  topstyle: {
                    align: "center"
                  },
                  topstyle: {
                    color: "#333",
                    fontSize: 12,
                    lineHeight: 22,
                    align: "center"
                  },
                  hr: {
                    borderColor: that.circleColor[that.index],
                    width: "100%",
                    borderWidth: 0.5,
                    height: 1
                  },
                  bottomstyle: {
                    color: "#999",
                    fontSize: 10,
                    lineHeight: 22,
                    align: "right"
                  },
                  bottomstyle2: {
                    color: "#333",
                    fontSize: 12,
                    lineHeight: 22
                  }
                }
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
      };
      myChart.setOption(option);

      console.log("create pieChart");
    }
  },
  watch: {
    pieData: {
      handler(newVal, oldVal) {
        if (newVal != oldVal && oldVal[0].value == 0) {
          this.drawChart();
        } else {
          this.drawChart();
        }
      },
      deep: true
    },
    loadingFlagPie: {
      handler(newVal, oldVal) {
        let that = this;
        //因为loadingFlagPie与pieData数据不同步，需要单独监听，处理loading事件。
        var myChart = echarts.init(document.getElementById(that.pieId));
        if (that.loadingFlagPie[that.pieId]) {
          myChart.hideLoading();
        }        
      },
      deep: true
    },
  },
  beforeCreate() {},
  created() {},
  beforeMount() {},
  mounted() {
    // this.drawChart()
  }
};
</script>

<style scoped lang="less" type="text/less">
/*#mainPie {*/
/*!*width: 100%;*!*/
/*!*height: 100%;*!*/
/*display: flex;*/
/*justify-content: center;*/
/*canvas {*/

/*}*/
/*}*/
</style>
