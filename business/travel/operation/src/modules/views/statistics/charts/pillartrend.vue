<template>
  <div
    id="PillarIdTrend"
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
  props: [
    "pillarData",
    "pillarColor",
    "loadingFlag",
    "pillarCityY",
    "trendHiglightIndex"
  ],
  computed: {},
  methods: {
    getFormatMount(data) {
      return data > 10000 ? NP.round(NP.divide(data, 10000), 2) + "w" : data;
    },
    drawChart() {
      var that = this;
      var myChart = echarts.init(document.getElementById("PillarIdTrend"));
      myChart.showLoading({
        // loading
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
        // color: that.pillarColor, 颜色
        tooltip: {
          show: true,
          trigger: "item"
        },
        //   tooltip: {
        //     trigger: 'axis',
        //     axisPointer: {            // 坐标轴指示器，坐标轴触发有效
        //       type: 'shadow',        // 默认为直线，可选为：'line' | 'shadow'
        //     },
        //     formatter: function (params) {   //让series 中label文字转换、
        //     return `<div position: absolute;  border-style: solid; white-space: nowrap; z-index: 9999999; transition: left 0.4s cubic-bezier(0.23, 1, 0.32, 1) 0s, top 0.4s cubic-bezier(0.23, 1, 0.32, 1) 0s; background-color: rgba(50, 50, 50, 0.7); border-width: 0px; border-color: rgb(51, 51, 51); border-radius: 4px; color: rgb(255, 255, 255); font: 14px/21px &quot;Microsoft YaHei&quot;; padding: 5px; left: 671px; top: 148px;>
        //             ${params[0].axisValue}
        //             <br>
        //             <span
        //             style='display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:#FFD591;'
        //             ></span>销售金额: ${that.getFormatMount(params[0].result)}
        //             <br>
        //             <span
        //             style='display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color: #FA9A93;'
        //             ></span>退款金额: ${that.getFormatMount(params[1].result)}
        //             <br>
        //             <span
        //             style='display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:#F6564A;'
        //             ></span>订单数: ${params[2].result/800}
        //         </div>`
        //           }
        //   },
        legend: {
          left: 0,
          data: ["销售金额", "退款金额", "订单数"]
        },
        grid: {
          left: "-3%",
          right: "0",
          bottom: "4%",
          // right:'12%',
          // bottom: '9%',
          containLabel: true
        },
        xAxis: [
          {
            type: "category",
            //  data: ['1月', '2月', '3月', '4月', '5月', '6月','7月','8月','9月','10月','11月','12月'],
            data: that.pillarData.month,
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
              show: true,
              padding: [0, 0, 0, 30],
              formatter: function(val) {
                //让中label文字转换
                //    console.log(val)
                //    ""
                if (val == 0) {
                  return "";
                } else {
                  // return  val+""
                  var el = "￥" + that.getFormatMount(val);
                  //  console.log(el)
                  return el;
                }
              }
            },
            interval: that.pillarData.intervalSalesAmount,
            max: that.pillarData.salesAmountMax,
            minInterval: 1,
            axisLine: {
              // 是否显示Y线
              show: false
            }
            //   max:function(value) {  // 设置柱形图y轴最大值标注
            //         if(!!that.pillarCityY){
            //             return  that.pillarCityY
            //         }else{
            //             return null
            //         }
            //     },
            // max:'dataMax' // 以图表上最大值作为最高刻度
          },
          {
            show: true, //  是否显示Y轴部分
            type: "value",
            //   splitNumber:5,
            interval: that.pillarData.intervalOrderNum,
            max: that.pillarData.orderNumMax,
            minInterval: 1,
            splitLine: {
              // 是否显示横向分割虚线
              show: true,
              lineStyle: {
                type: "dashed"
                //   color:['#333']
              }
            },
            axisTick: {
              // 横向数据标线
              show: false
            },
            // minInterval:1,
            axisLabel: {
              formatter: function(val) {
                //让series 中label文字转换
                if (val == 0) {
                  return "";
                } else {
                  return NP.round(val, 0);
                  // return  val*1/800
                }
              }, // 格式化提示数据
              show: true,
              padding: [0, 10, 0, 0]
            },
            axisLine: {
              // 是否显示Y线
              show: false
            }
            //   max:function(value) {  // 设置柱形图y轴最大值标注
            //         if(!!that.pillarCityY){
            //             return  that.pillarCityY
            //         }else{
            //             return null
            //         }
            //     },
            // max:'dataMax' // 以图表上最大值作为最高刻度
          }
        ],
        series: [
          {
            name: "销售金额",
            type: "bar",
            barWidth: "30%",
            barGap: 0,
            itemStyle: {
              normal: {
                color: function(params) {
                  let colorList = [];
                  for (let i = 0; i < 12; i++) {
                    if (that.trendHiglightIndex.indexOf(i) != -1) {
                      colorList.push("#FFAF2A"); // 高亮色
                    } else {
                      colorList.push(that.pillarColor[0]);
                    }
                  }
                  return colorList[params.dataIndex];
                }
              }
            },
            tooltip: {
              position: "top",
              formatter: function(params) {
                //让series 中label文字转换、
                //   console.log(params)
                return `<div position: absolute;  border-style: solid; white-space: nowrap; z-index: 9999999; transition: left 0.4s cubic-bezier(0.23, 1, 0.32, 1) 0s, top 0.4s cubic-bezier(0.23, 1, 0.32, 1) 0s; background-color: rgba(50, 50, 50, 0.7); border-width: 0px; border-color: rgb(51, 51, 51); border-radius: 4px; color: rgb(255, 255, 255); font: 14px/21px &quot;Microsoft YaHei&quot;; padding: 5px; left: 671px; top: 148px;>
                        ${params.name}
                        <br>                
                        <span
                        style='display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:#FFD591;'
                        ></span>销售金额: ${that.getFormatMount(params.data)}
                    </div>`;
              }
            },
            // label: {
            //     normal: {
            //       show: true,
            //       // position: 'insideTopRight',
            //       position: 'top',
            //       color: '#000000',
            //       formatter: function (val) {   //让series 中label文字转换
            //         if(val.result==0){
            //           return ''
            //       }else{
            //         var {data} = val
            //         return  '￥'+that.getFormatMount(val.result)
            //       }
            //       }
            //     }
            //   },
            data: that.pillarData.salesAmount
            // data: [800, 332, 301, 334, 390,222,222,222,222,222,222,222]
          },
          {
            name: "退款金额",
            type: "bar",
            barWidth: "30%",
            itemStyle: {
              normal: {
                color: function(params) {
                  let colorList = [];
                  for (let i = 0; i < 12; i++) {
                    if (that.trendHiglightIndex.indexOf(i) != -1) {
                      colorList.push("#F6564A"); // 高亮色
                    } else {
                      colorList.push(that.pillarColor[1]);
                    }
                  }
                  return colorList[params.dataIndex];
                }
              }
            },
            tooltip: {
              position: "top",
              formatter: function(params) {
                //让series 中label文字转换、
                // console.log(params)
                return `<div position: absolute;  border-style: solid; white-space: nowrap; z-index: 9999999; transition: left 0.4s cubic-bezier(0.23, 1, 0.32, 1) 0s, top 0.4s cubic-bezier(0.23, 1, 0.32, 1) 0s; background-color: rgba(50, 50, 50, 0.7); border-width: 0px; border-color: rgb(51, 51, 51); border-radius: 4px; color: rgb(255, 255, 255); font: 14px/21px &quot;Microsoft YaHei&quot;; padding: 5px; left: 671px; top: 148px;>
                        ${params.name}
                        <br>                   
                        <span
                        style='display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color: #FA9A93;'
                        ></span>退款金额: ${that.getFormatMount(params.data)}
                    </div>`;
              }
            },
            // label: {
            //     normal: {
            //       show: true,
            //       // position: 'insideTopLeft',
            //       position: 'top',
            //       color: '#000000',
            //       formatter: function (val) {   //让series 中label文字转换
            //         if(val.result==0){
            //           return ''
            //       }else{
            //         var {data} = val
            //         return  '￥'+that.getFormatMount(val.result)
            //       }
            //       }
            //     }
            //   },
            data: that.pillarData.refundAmount
            // data: [600, 182, 191, 234, 290,222,222,222,222,222,222,222]
          },
          {
            name: "订单数",
            type: "line",
            yAxisIndex: 1,
            itemStyle: {
              normal: {
                lineStyle: {
                  color: that.pillarColor[2]
                }
              }
            },
            tooltip: {
              position: "top",
              formatter: function(params) {
                //让series 中label文字转换、
                // console.log(params)
                return `<div position: absolute;  border-style: solid; white-space: nowrap; z-index: 9999999; transition: left 0.4s cubic-bezier(0.23, 1, 0.32, 1) 0s, top 0.4s cubic-bezier(0.23, 1, 0.32, 1) 0s; background-color: rgba(50, 50, 50, 0.7); border-width: 0px; border-color: rgb(51, 51, 51); border-radius: 4px; color: rgb(255, 255, 255); font: 14px/21px &quot;Microsoft YaHei&quot;; padding: 5px; left: 671px; top: 148px;>
                        ${params.name}
                        <br>                   
                        <span
                        style='display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:#F6564A;'
                        ></span>订单数: ${params.data}
                    </div>`;
              }
            },
            // label: {
            //     normal: {
            //       show: true,
            //       position: 'top',
            //       color: '#000000',
            //       formatter: function (val) {   //让series 中label文字转换
            //         if(val.result==0){
            //           return ''
            //       }else{
            //         var {data} = val
            //         return  data*1/800
            //       }
            //       }
            //     }
            //   },
            data: that.pillarData.orderNum
            // data: [300, 150, 400, 200, 100,50,600,200,450,320,111,10]
          }

          // {
          //   name: '出差支出',
          //   type: 'bar',
          //   barWidth: '30%',
          //    data: [220, 182, 191, 234, 290,222,222,222,222,222,222,222],
          //   label: {
          //     normal: {
          //       show: true,
          //       position: 'top',
          //       color: '#000000',
          //       formatter: function (val) {   //让series 中label文字转换
          //         var {data} = val
          //         return '￥' + data
          //       }
          //     }
          //   },
          //   itemStyle:{
          //     normal: {
          //           //每根柱子颜色设置
          //         //   color: function(params) {
          //         //       let colorList = that.pillarColor;
          //         //       return colorList[params.dataIndex];
          //         //   }
          //         color:that.pillarColor
          //       }
          //   }

          // }
        ]
      };
      myChart.setOption(optionData);

      // console.log('create pillarChart')
      //  console.log( this.loadingFlag,'zzzzzzzzzzzzzzzz')
    }
  },
  watch: {
    pillarData: {
      handler(newVal, oldVal) {
        if (!!newVal && !!newVal.salesAmount) {
          let max = newVal.salesAmount[0];
          for (let i = 0; i < newVal.salesAmount.length - 1; i++) {
            max =
              max < newVal.salesAmount[i + 1] ? newVal.salesAmount[i + 1] : max;
          }
          newVal.salesAmountMax = NP.times(max, 1.0);
          newVal.intervalSalesAmount = NP.divide(newVal.salesAmountMax, 5);
        }
        if (!!newVal && !!newVal.refundAmount) {
          let max = newVal.refundAmount[0];
          for (let i = 0; i < newVal.refundAmount.length - 1; i++) {
            max =
              max < newVal.refundAmount[i + 1]
                ? newVal.refundAmount[i + 1]
                : max;
          }
          newVal.refundAmountMax = NP.times(max, 1.0);
          newVal.intervalRefundAmount = NP.divide(newVal.refundAmountMax, 5);
        }
        if (!!newVal && !!newVal.orderNum) {
          let max = newVal.orderNum[0];
          for (let i = 0; i < newVal.orderNum.length - 1; i++) {
            max = max < newVal.orderNum[i + 1] ? newVal.orderNum[i + 1] : max;
          }
          newVal.orderNumMax = NP.times(max, 1.0);
          newVal.intervalOrderNum = NP.divide(newVal.orderNumMax, 5);
        }
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
