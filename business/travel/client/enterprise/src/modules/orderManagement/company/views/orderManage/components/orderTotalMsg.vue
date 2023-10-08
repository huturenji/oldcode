<template>
    <div class="orderTotalMsg_container">
        <div class="res550" v-if='isPC'>
            <ul>
                <li>
                    <p>订单数</p>
                    <p class="fitFont num-font blue"><span>{{dataStatistics.totalOrderNum}}</span></p>
                    <p class="resNo normal-btn cursorp" @click="gotoOrderNum">查看详情<img
                            src="~assets/img/company/company_icon_array_right.png" alt=""></p>
                </li>
                <li>
                    <p>总支出</p>
                    <p class="fitFont num-font blue"><span
                            style="font-size: 0.6em">￥</span><span>{{dataStatistics.spendingAmount}}</span>
                    </p>
                    <p></p>
                </li>
                <li>
                    <p>有退款</p>
                    <p class="fitFont num-font blue"><span
                            style="font-size: 0.6em">￥</span><span>{{dataStatistics.totalRefundAmount}}</span></p>
                    <p></p>
                </li>
            </ul>
        </div>
        <div class="resNormal" v-else>
            <!--此处需要滚动-->
            <p class="tips">
                以下数据来源于{{ENABLE_USE_TYPE ? '因公出行' : '企业支付'}}的已交易订单
            </p>
            <ul>
                <li class="cursorp normal-btn" @click="gotoOrderNum">
                    <p class="fitFont num-font"><span>{{dataStatistics.totalOrderNum}}</span></p>
                    <p>订单数(笔)</p>
                </li>
                <li>
                    <p class="fitFont num-font"><span>{{dataStatistics.spendingAmount}}</span></p>
                    <p>总支出(元)</p>
                </li>
                <li>
                    <p class="fitFont num-font"><span>{{dataStatistics.totalRefundAmount}}</span></p>
                    <p>有退款(元)</p>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>

import requestHandler from 'orderCommon/requestHandler.js';
import {
    TransferDom
} from 'vux'

export default {
    directives: {
        TransferDom
    },
    components: {
    },
    props: {
        dataStatistics: {
            default: () => { }
        },
        formatValue: {
            default: ''
        },
        startPcCalendarDate: {
            default: ""
        },
        endPcCalendarDate: {
            default: ""
        },
        startDate: { default: "" },
        endDate: { default: "" },
        departmentSelect: { default: 0 },
        QueryDate: { default: "" },
        changeFilter: { type: Boolean },
        departmentId: { default: "" }

    },
    data() {
        return {
            isPC: requestHandler.isPC(),
            ENABLE_USE_TYPE: requestHandler.ENABLE_USE_TYPE
        }
    },
    created: function () {
    },
    mounted() {
    },
    watch: {
        dataStatistics: {
            handler() {
                this.$nextTick(() => {
                    this.fitFontSize()
                })
            },
            deep: true
        }
    },
    filters: {},
    methods: {
        fontOverFlow(dom) {
            let parent = dom.parentElement;
            let parentStyle = requestHandler.getStyle(parent);
            return dom.offsetWidth >= dom.parentElement.offsetWidth - parseFloat(parentStyle.paddingLeft) - parseFloat(parentStyle.paddingRight);
        },
        fitFontSize() {
            let that = this;
            let fontDom = document.querySelectorAll('.orderTotalMsg_container .fitFont');
            let zoom = false;
            Array.prototype.forEach.call(fontDom, dom => {
                if (that.fontOverFlow(dom)) {
                    zoom = true;
                }
            })
            zoom && Array.prototype.forEach.call(fontDom, dom => {
                dom.style.fontSize = parseInt(requestHandler.getStyle(dom, 'fontSize')) - 1 + 'px';
                //pc最小12px，再小的字号不支持
                if (that.isPC && parseFloat(dom.style.fontSize) < 12) {
                    dom.style.whiteSpace = 'normal';
                    dom.style.lineHeight = 'initial';
                    return;
                }
                if (that.fontOverFlow(dom)) {
                    that.fitFontSize()
                }
            })
        },
        gotoOrderNum() {
            requestHandler.openPageLib('enterprise/index.html#/order/mine?role=company&orderDispatch=0&queryStartDate=' + this.startDate + "&queryEndDate=" + this.endDate + '&departmentId=' + this.departmentId);
        },
        gotoTotalPay() {
            // 跳转支出页面
            this.$router.push({
                path: '/order/refundorpay',
                query: {
                    title: 'totalPay',
                    SpendingAmount: this.SpendingAmount,
                    startDate: this.startDate,
                    endDate: this.endDate,
                    startPcCalendarDate: this.startPcCalendarDate,
                    endPcCalendarDate: this.endPcCalendarDate,
                    departmentSelect: this.departmentSelect,
                    QueryDate: this.QueryDate,
                    formatValue: this.formatValue,
                    changeFilter: this.changeFilter,
                    departmentId: this.departmentId
                }
            })
            // showToast('跳转总支出页面')
        },
        gotoRefund() {
            // 跳转退款页面
            this.$router.push({
                path: '/order/refundorpay',
                query: {
                    title: 'totalRefund',
                    SpendingAmount: this.SpendingAmount,
                    startDate: this.startDate,
                    endDate: this.endDate,
                    startPcCalendarDate: this.startPcCalendarDate,
                    endPcCalendarDate: this.endPcCalendarDate,
                    departmentSelect: this.departmentSelect,
                    QueryDate: this.QueryDate,
                    formatValue: this.formatValue,
                    changeFilter: this.changeFilter,
                    departmentId: this.departmentId
                }
            })
            // showToast('跳转退款页面')
        }

    }
}
</script>
<style scoped lang="less" type="text/less">
    @import '~themes/default/styles/common/index.less';
  @import '~styles/mixins/mixinsStyle.less';

    .orderTotalMsg_container {
      .res550 {

        background-color: rgba(255, 255, 255, 1);
        width: 100%;
        box-sizing: border-box;
        height: 124px;
        padding: 18px 0;
        display: flex !important;
        align-items: center;
        border-radius: 1px;
        box-shadow: 0 0 16px 3px rgba(35, 72, 134, .23);
        ul {
          height: 100%;
          width: 100%;
          display: flex;
          justify-content: space-between;
          li {
            flex: none;
            width: 33.33%;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            align-items: center;
            border-right: 1px solid #e5e5e5;
            box-sizing: border-box;
            padding: 0 .24rem;
            .fitFont{
                display: block;
                word-break: keep-all;
                white-space: nowrap;
                line-height: 0.56rem;
            }
            .blue {
              font-size: 24px;
              color: #262DD9;
              font-weight: bold;
            }
            &:last-child {
              border-right: 0;
            }
            p {
              &:first-child {
                font-size: 14px;
                color: #191919;
              }
              &:last-child {
                font-size: 14px;
                color: #7F7F7F;
                cursor: pointer;
                &:active{
                    color: #999
                }

                img{
                  width: 6px;
                  height: 12px;
                  vertical-align: middle;
                  padding-left: 8px;
                }
              }
            }
          }

        }
      }
    }

  /*初始状态*/

  .orderTotalMsg_container {
    .resNormal {
      background-color: rgba(255, 255, 255, 1);
      width: 100%;
      box-sizing: border-box;
      height: 2.46rem;
      padding: .36rem .4rem;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      border-radius: .2rem;
      box-shadow: 0px .04rem .3rem -.04rem rgba(125, 155, 250, 0.22);

      .tips {
        font-size: .24rem;
        color: #A4ACB2;
        text-align: center;
        margin: 0 0 .26rem;
      }
      ul {
        height: 1.1rem;
        display: flex;
        justify-content: space-between;
        li {
          flex: none;
          width: 33.33%;
          background-color: rgba(255, 255, 255, 1); 
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          align-items: center;
          box-sizing: border-box;
          position: relative;
          padding: 0 .12rem;

          &:not(:last-of-type):after{
              content: '';
              display: block;
              border-right: 1px solid #D3D3D3;
              height: 40%;
              position: absolute;
              right: 0;
              top: 25%;
              transform: translateY(-50%);
          }

          .fitFont{
            display: block;
            word-break: keep-all;
            white-space: nowrap;
            line-height: 0.56rem;
          }

          .num-font {
            font-size: .4rem;
            font-weight: bold;
          }
          p {
            font-size: .24rem;
            color: #666;
          }
          &:last-child {
            border-right: 0;
          }

          .resNo {
            display: none;
            &:active{
                color: #999;
            }
          }
        }
      }
    }
  }

</style>