<template>
  <div class="ticketCard_container">
    <div class="res550">
      <ul>
        <li>
          <img  :src="require('assets/img/company/company_icon_'+OrderTypeListEng[OrderType-1]+'.png')" alt>
          <span>{{OrderTypeList[OrderType-1]}}</span>
        </li>
        <li>
          <span>{{orderTimeone}}</span>
          <span>{{orderTimetwo}}</span>
        </li>
        <li>￥{{MoneyAmount}}</li>
        <li>{{PayTypeName?PayTypeName:' '}}</li>
        <li class="cursorp icon-btn" @click="goDetail">查看详情</li>
      </ul>
    </div>
    <div class="resNormal cursorp" @click="goDetail">
      <!-- icon 图 -->
      <img  :src="require('assets/img/company/company_icon_'+OrderTypeListEng[OrderType-1]+'.png')" alt>
      <div class="text">
        <div class="left">
          <p>{{OrderTypeList[OrderType-1]}}</p>
          <p>
            <span>{{orderTimethree}}</span>
            <span>{{orderTimetwo}}</span>
          </p>
        </div>
        <div class="right" :style="this.$route.query.title=='totalPay'?{color:'#333333'}:{color:'#f83939'}">
          <span v-if="this.$route.query.title=='totalRefund'">+</span>{{MoneyAmount}}
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import requestHandler from 'orderCommon/requestHandler.js';
export default {
    data(){
        return {
            OrderTypeList:[
                "机票",'酒店','火车票','快递'
            ],
            OrderTypeListEng:[
                "flight",'hotel','train','express'
            ],
            PayTypeList:['未支付','微信支付','支付宝','企业代付','金贝','厦门国际银行支付'],
            orderTimeone:"",
            orderTimetwo:"",
            orderTimethree:""
        }
    },
    props:['OrderType','PayTypeName','OrderNo','RefOrderNo','OrderTime','MoneyAmount'],
    methods:{
        goDetail(){
            let that=this
            var OrderTypeName=this.OrderTypeListEng[this.OrderType-1]
            requestHandler.openPageLib("enterprise/index.html#/"+"order/detail/"+OrderTypeName+"/app?OrderNo="+that.OrderNo+"&close=1&role=company")
        }
    },
    mounted(){
        // var OrderTypeName=this.OrderTypeListEng[this.OrderType-1]
        this.orderTimeone=this.OrderTime.split(" ")[0].replace(/\//g,'-')
        this.orderTimetwo=this.OrderTime.split(" ")[1].replace(/\//g,'-')
        this.orderTimethree=this.orderTimeone.split("-").splice(1,2).join('-')
    }
}
</script>

<style scoped lang="less" type="text/less">
@import "~themes/default/styles/common/index.less";
@import "~styles/mixins/mixinsStyle.less";
@media screen and (min-width: 616px) and (max-width: @screen-md) {
  /*响应式排布550-1080*/
  .ticketCard_container {
    .resNormal {
      display: none !important;
    }
    .res550 {
      display: block !important;
      width: 92%;
      margin: 0 auto;
      ul {
        border-top: 1px dashed #e5e5e5;
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 40px;
        li {
          color: #333333;
          &:first-child {
            width: 100px;
            display: flex;
            align-items: center;
            img {
              width: 24px;
              height: 24px;
              padding-right: 6px;
            }
          }
          &:nth-child(2) {
            width: 150px;
            span {
              padding-right: 6px;
            }
          }
          &:nth-child(3) {
            width: 92px;
          }
          &:nth-child(4) {
            width: 70px;
            text-align: center;
          }
          &:nth-child(5) {
            width: 70px;
            color: #262DD9;
            cursor: pointer;
          }
        }
      }
    }
  }
}
@media screen and (min-width: @screen-md) {
  /*响应式排布>1080*/
  .ticketCard_container {
    .resNormal {
      display: none !important;
    }
    .res550 {
      display: block !important;
      width: 92%;
      margin: 0 auto;
      ul {
        border-top: 1px dashed #e5e5e5;
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 40px;
        li {
          color: #333333;
          &:first-child {
            width: 100px;
            display: flex;
            align-items: center;
            img {
              width: 24px;
              height: 24px;
              padding-right: 6px;
            }
          }
          &:nth-child(2) {
            width: 150px;
            span {
              padding-right: 6px;
            }
          }
          &:nth-child(3) {
            width: 92px;
          }
          &:nth-child(4) {
            width: 70px;
          }
          &:nth-child(5) {
            width: 70px;
            color: #262DD9;
            cursor: pointer;
          }
        }
      }
    }
  }
}

/*初始
    状态
    */
.ticketCard_container {
  .res550 {
    display: none;
  }
  .resNormal {
    background-color: #fff;
    padding: 0 0.3rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    img {
      width: 0.6rem;
      height: 0.6rem;
    }
    .text {
      flex: 1;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.25rem 0 0.25rem 0.2rem;
      border-bottom: 0.01rem solid #e5e5e5;
      .left {
        p {
          &:first-child {
            height: 0.71rem;
            line-height: 0.71rem;
            font-size: 0.32rem;
            color: #333333;
          }
          span {
            font-size: 0.26rem;
            color: #999999;
            padding-right: 0.2rem;
          }
        }
      }
      .right {
        font-size: 0.36rem;
        color: #f83939;
        font-weight: bold;
      }
    }
      &:active{
        background-color: #e5e5e5;       
      }    
  }
}
</style>
