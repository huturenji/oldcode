<template>
  <div
    id="PillarIdDes"
    style="width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;"
  ></div>
</template>

<script>
import NP from "number-precision";
export default {
  data() {
    return {
      time: null
    };
  },
  props: ["pillarData", "pillarColor", "loadingFlag", "pillarCityY"],
  computed: {},
  methods: {
    getFormatMount(data) {
      return data > 10000 ? NP.round(NP.divide(data, 10000), 2) + "w" : data;
    },
    drawChart() {
      var that = this;
      var myChart = echarts.init(document.getElementById("PillarIdDes"));
      myChart.showLoading({
        text: "loading",
        color: "#c23531",
        textColor: "#000",
        maskColor: "rgba(255, 255, 255, 1)",
        effect: "whirling",
        zlevel: 0
      });
      if (that.loadingFlag) {
        myChart.hideLoading();
      }

      let optionData = {
        // color: that.pillarColor,
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
          },
          formatter: function(params) {
            //让series 中label文字转换、
            return `<div position: absolute;  border-style: solid; white-space: nowrap; z-index: 9999999; transition: left 0.4s cubic-bezier(0.23, 1, 0.32, 1) 0s, top 0.4s cubic-bezier(0.23, 1, 0.32, 1) 0s; background-color: rgba(50, 50, 50, 0.7); border-width: 0px; border-color: rgb(51, 51, 51); border-radius: 4px; color: rgb(255, 255, 255); font: 14px/21px &quot;Microsoft YaHei&quot;; padding: 5px; left: 671px; top: 148px;>
                    <span
                    style='display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:#3398DB;'
                    ></span>出差支出: ${that.getFormatMount(params[0].data)}
                </div>`;
          }
        },
        grid: {
          left: "5%",
          right: "9%",
          bottom: "8%",
          // right:'12%',
          // bottom: '9%',
          containLabel: true
        },
        xAxis: [
          {
            type: "category",
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
            type: "value",
            splitLine: {
              // 是否显示横向分割虚线
              show: true,
              lineStyle: {
                type: "dashed"
              }
            },
            axisTick: {
              // 横向数据标线
              show: false
            },
            axisLabel: {
              //  formatter: '{value}%'   // 格式化提示数据
              show: false
            },
            axisLine: {
              // 是否显示Y线
              show: false
            },
            max: function(value) {
              // 设置柱形图y轴最大值标注
              if (!!that.pillarCityY) {
                return that.pillarCityY;
              } else {
                return null;
              }
            }
            // max:'dataMax' // 以图表上最大值作为最高刻度
          }
        ],
        series: [
          {
            name: "出差支出",
            type: "bar",
            barWidth: "30%",
            // data: [600, 420, 330, 320, 280, 200],
            data: that.pillarData.value,
            label: {
              normal: {
                show: true,
                position: "top",
                color: "#000000",
                formatter: function(val) {
                  //让series 中label文字转换
                  var { data } = val;
                  console.log("val="+JSON.stringify(val.data))
                  return "￥" + that.getFormatMount(val.data);
                }
              }
            },
            itemStyle: {
              normal: {
                //每根柱子颜色设置
                //   color: function(params) {
                //       let colorList = that.pillarColor;
                //       return colorList[params.dataIndex];
                //   }
                color: that.pillarColor
              }
            }
          }
        ]
      };
      myChart.setOption(optionData);

      console.log("create pillarChart");
    }
  },
  watch: {
    pillarData: {
      handler(newVal, oldVal) {
        this.drawChart();
      },
      deep: true
    }
  },
  beforeCreate() {},
  created() {},
  beforeMount() {},
  mounted() {}
};
</script>

<style scoped lang="less" type="text/less">
</style>
