<template>
  <div id="manualBookFlightMsg">
    <div class="airlineItemSpan">
      <div class="orderBaseInfo">
        <div>商旅通订单号：{{orderBase.orderNo}}</div>
        <div>{{parseProviderName()}}订单号：{{orderBase.supplierOrderNo}}</div>
        <div>供应商：{{parseProviderName() + "（"+ (orderBase.providerPhone||"")+"）"}}</div>
      </div>
      <div v-for="airlineItem in msgFlight" :key="airlineItem.flightNo">
        <!--航班信息-->
        <div class="aireLineinfoAll">
          <div class="aireLineinfo">
            <div class="leftDiv">
              <div class="aireLineName">
                <img
                  :src="require('assets//airlogo/'+ getAirLogo(airlineItem.airLineCode)+'.png')"
                />
                <span class="name">{{airlineItem.airLineName +airlineItem.flightNo}}</span>
              </div>
              <div class="aireLineStation">
                <div class="station">
                  <div>{{airlineItem.startCityName}}-{{airlineItem.endCityName}}</div>
                  <div class="time">{{airlineItem.beginDate +" "+ airlineItem.beginTime}}</div>
                </div>
                <div>
                  <span>{{airlineItem.cabinName + airlineItem.cabin}}</span>
                </div>
              </div>
            </div>
            <div class="rightDiv">
              <div class="rightTop">
                <div class="startT">
                  <div class="startName">{{airlineItem.beginTime}}</div>
                  <div>{{airlineItem.startAirportName + airlineItem.startTerminal}}</div>
                </div>
                <div class="airelineTime">
                  <div class="timeLong">
                    <div class="allTime">{{!!airlineItem.duration ? '经'+airlineItem.duration : ''}}</div>
                    <div class="lineDiv"></div>
                    <div class="stops" v-if="airlineItem.stopNum > 0">
                      <div>经停/</div>
                      <div
                        v-for="(item,index) in airlineItem.stopItems"
                        :key="item.stopCityName"
                      >{{(index > 0 ?"、":"") + item.stopCityName}}</div>
                    </div>
                  </div>
                  <div class="airlogo"></div>
                </div>
                <div class="startT">
                  <div class="startName">{{airlineItem.arriveTime}}</div>
                  <div>{{airlineItem.endAirportName + airlineItem.endTerminal}}</div>
                </div>
              </div>
              <div class="rightBottom">
                <div>{{airlineItem.planeType}}</div>
                <div>{{airlineItem.hasMeal?'有餐饮':'无餐饮'}}</div>
                <div>准点率{{!!airlineItem.onTimeRate ? airlineItem.onTimeRate + '%': '：无'}}</div>
              </div>
            </div>
          </div>
          <div class="amountInfo"></div>
          <div class="iconBack" v-if="airlineItem.isGaiOrder">
            <div class="iconCss"></div>
          </div>
        </div>
        <!--乘客信息-->
        <div
          class="passengerItem"
          v-for="passenger in airlineItem.passengers"
          :key="passenger.psgID"
        >
          <div class="leftIcon">
            <img src="~assets//icon_customer_head.png" />
          </div>
          <div class="rightDiv">
            <div class="firstLine">
              <span class="spanF">{{passenger.psgName}}</span>
              <InfoLabel
                class="spanT"
                :infoName="parseCardType(passenger.cardType)"
                :infoValue="passenger.cardNo"
                classForName="infoLabel5"
                classForValue="infoLabel2"
              >
                <span class="spanT2" slot="middlePoint">:</span>
              </InfoLabel>
              <InfoLabel
                class="spanT"
                infoName="联系电话"
                :infoValue="passenger.phone||passenger.mobile"
                classForName="infoLabel5"
                classForValue="infoLabel2"
              >
                <span class="spanT2" slot="middlePoint">:</span>
              </InfoLabel>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import utils from "bislibs/utils";
import  * as travelfun from "bislibs/traveloperationfun.js";
import InfoLabel from "biscomponents/infolabel/msglabel.vue";
export default {
  props: ["msgFlight", "orderBase"],
  directives: {},
  components: { InfoLabel },
  data() {
    return {};
  },
  watch: {
    /**
     * 监听prop动态更新，刷新当前页面数据
     */
    msgFlight: function(val, oldVal) {
      let that = this;
      //  console.log("msgFlight");
      if (val != oldVal && !!val) {
        //  console.log("msgFlight--");
      }
    }
  },
  computed: {},
  created() {},
  mounted() {},
  methods: {
    //供应商名称
    parseProviderName() {
      return this.orderBase.providerShortName || travelfun.getProviderNameForId(this.orderBase.providerType);
    },
    /**
     * 解析证件的展示
     */
    parseCardType(cardType) {
      return utils.getCardTypeName(parseInt(cardType));
    },
    /**
     * 动态获取航司Logo
     */
    getAirLogo(airCode) {
      return utils.getAirCpyLogo(airCode);
    }
  }
};
</script>
<style scoped lang="less">
@import "~styles/common.less";
@import "~styles/variables.less";
@import "~styles/mixins/mixins.less";
#manualBookFlightMsg {
  background: #ffffff;

  .airlineItemSpan {
    margin-bottom: 0px;
    // height: 260px;
    // overflow-y: auto;
    .orderBaseInfo {
      background: #478aee;
      font-size: 12px;
      color: #ffffff;
      display: flex;
      padding: 10px;
      justify-content: space-between;
      word-break: break-all;
    }
    .aireLineinfoAll {
      background: #478aee;
      position: relative;
      .aireLineinfo {
        display: flex;
        align-content: space-between;
        padding: 10px;
        .leftDiv {
          flex: 2;
          color: white;
          .aireLineName {
            display: flex;
            align-content: flex-start;
            margin-bottom: 40px;
            align-items: center;
            img {
              height: 20px;
              width: 20px;
              margin-right: 5px;
              background: white;
            }
            .name {
              font-size: 14px;
              font-weight: bold;
              margin-right: 20px;
            }
          }
          .aireLineStation {
            display: flex;
            justify-content: flex-start;
            align-items: baseline;
            .station {
              font-size: 14px;
              font-weight: bold;
              margin-right: 60px;
              .time {
                font-size: 12px;
                font-weight: normal;
                margin-top: 10px;
              }
            }
            span {
              font-size: 12px;
              align-self: center;
              color: white;
            }
          }
        }
        .rightDiv {
          flex: 2;
          margin-top: 20px;
          color: white;
          .rightBottom {
            margin-top: 10px;
            display: flex;
            justify-content: center;
            font-size: 12px;
            font-weight: bold;
            div {
              padding: 0 20px;
              border-right: 1px solid #ffffff;
            }
            div:nth-child(3) {
              border-right: 1px solid transparent;
            }
          }
          .rightTop {
            display: flex;
            justify-content: flex-start;
            .startT {
              font-size: 12px;
              .startName {
                margin-bottom: 10px;
                font-size: 14px;
                font-weight: bold;
              }
            }
            .airelineTime {
              display: flex;
              align-content: flex-start;
              font-size: 12px;
              align-items: center;
              img {
                height: 14px;
                width: 14px;
              }
              .timeLong {
                margin: 0px 4px 0px 10px;
                .allTime {
                  font-size: 16px;
                  text-align: center;
                  height: 20px;
                }
                .lineDiv {
                  margin: 6px 0px;
                  height: 11px;
                  width: 162px;
                  background: url(~assets//icon_train_arrorow.png)
                    no-repeat;
                }
                .stops {
                  text-align: center;
                  display: flex;
                  justify-content: center;
                }
              }
              .airlogo {
                display: none;
                height: 15px;
                width: 22px;
                margin-right: 10px;
                background: url(~assets//icon_flight.png)
                  no-repeat;
              }
            }
          }
        }
      }
      .amountInfo {
        border-top: 1px dashed #ffffff;
        display: flex;
        // justify-content: flex-end;
        margin: 0 10px;
        align-items: baseline;
        color: #ffffff;
        font-size: 14px;
        font-weight: bold;
        // padding: 10px 0px;
        height: 40px;
        // .unit {
        //     font-size: 14px;
        // }
      }
      .iconBack {
        position: absolute;
        background: transparent;
        top: 0;
        /*right: 0;*/
        .iconCss {
          height: 60px;
          width: 60px;
          right: 0px;
          top: 0px;
          background: url(~assets//gai.png)
            no-repeat;
          background-size: contain;
        }
      }
    }
    .passengerItem {
      background: white;
      display: flex;
      align-content: flex-start;
      padding: 10px 40px;
      .leftIcon {
        width: 24px;
        margin-right: 10px;
        img {
          height: 24px;
        }
      }
      .rightDiv {
        width: 100%;
        .firstLine {
          display: flex;
          align-content: flex-start;
          font-size: 14px;
          align-items: flex-end;
          .spanF {
            margin-right: 80px;
            color: #333333;
          }
          .spanS {
            margin-right: 40px;
            color: #333333;
          }
          .spanT {
            margin-right: 40px;
          }
          .spanT2 {
            margin-right: 10px;
          }
        }
      }
    }
  }
}
</style>




