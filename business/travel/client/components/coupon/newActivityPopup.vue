<template>
  <div class="newActivityPopup_container">
        <!--立即使用弹窗-->
    <CouponUsePopup v-if="isShowUsePopup"
                    :CouponUsePopupToList="ListToPopUpClose"
                    :receiveDataList="receiveDataList"
                    :isDisabled="disabled"
    />
    <div class="cover animated zoomIn">
      <div class="closeBtn cursorp" @click.stop="clickclosePopup">
      </div>
      <div class="topClassContent">
        <!--优惠券插入-->
        <GetAndUseCard
          v-for="(data,index) in newUserCardData"
          :dataList="data"
          :key="index"
          :ListToPopUp="ListToPopUp"
        ></GetAndUseCard>
      </div>
      <div class="mostDiscount">
        <p><span>最高优惠</span>
          <span>￥</span>
          <span>{{newUserCardData[0].CouponValue}}</span>
        </p>
      </div>
      <!--更多优惠券-->
      <div class="moreCard cursorp" @click="gotoActivityCenter">
        <span>查看更多优惠券</span>
        <img class="imgNor" src="./img/wallet_icon_arr_black.png" alt="">
        <img class="imgPre" src="./img/wallet_icon_arr_black_ac.png" alt="">
      </div>
    </div>
  </div>
</template>

<script>
import CouponUsePopup from './couponUsePopup.vue'
import GetAndUseCard from './getAndUseCard.vue'
import {getProductType} from './js/judgePageType.js'
import extendUtils from './js/extend.js'
import {getCouponsForHome,openPage} from './js/requestHandler.js'

export default {
    components: {
        GetAndUseCard,
        CouponUsePopup
    },
    data () {
        return {
            AvtivityPopReceive:true, // 弹出窗如果未领取直接关闭没有个人优惠券的时候显示待领取优惠券
            isShowUsePopup: false, // 使用弹窗默认隐藏
            receiveDataList:null, // 接收list数据
            closeBtn: true,
            disabled:false, // 优惠券详情立即使用按钮的不可使用状态
            newUserCardData: [ // 默认静态数据
                {CouponValue:0}
            ]
        }
    },
    props: [],
    created(){
        let that=this
        setTimeout(()=>{
            if (!extendUtils.getStorage('hasShowNewActivity'+'_'+extendUtils.primaryKey+getProductType('type'))){
                that.getActivityData()
            }
        },500)
    },
    methods: {
        ListToPopUpClose () {
            this.isShowUsePopup = false
        },
        ListToPopUp (data,disabled) { // 弹出窗，传输数据
            var that = this
            this.receiveDataList=data // 点击接收优惠券详情数据
            this.isShowUsePopup = true // 展示优惠券详情
            if (disabled){ // 接收是否未达到使用期判断值
                that.disabled=true
            } else {
                that.disabled=false
            }
        },
        clickclosePopup () {
            this.$parent.isShowNewActivityPopup = false
            this.$parent.dtReceiveCoupon=this.AvtivityPopReceive // 新人活动弹窗关闭，传输领取后关闭或者未领取关闭判断值
        },
        gotoActivityCenter () {
        // this.$router.push({path:'/activityCenter'})
            openPage('wallet.html#/activityCenter?pageFrom=home')
            this.$parent.isShowNewActivityPopup = false // 跳转活动中心关闭新人活动弹窗
        },
        getActivityData(){
            let that=this
            getCouponsForHome(getProductType('code'),2,2,1).then((res)=>{
                if (res.Coupons.length!=0){
                    let that=this
                    that.newUserCardData=res.Coupons
                    that.$parent.isShowNewActivityPopup=true // 第一次弹出
                } else {
                    that.$parent.isShowNewActivityPopup=false // 查不到Coupons就不显示新人弹窗
                    that.$parent.$parent.dtReceiveCoupon=false //  =新人活动弹窗未领取直接关闭
                }
            }).catch(err=>console.log(err))
        }
    },
    mounted () {
    }
}
</script>

<style scoped lang="less" type="text/less">
  @import '~styles/core/common.less';
  @import '~styles/mixins/mixinsStyle.less';
  .animated {
      -webkit-animation-duration: 1s;
      animation-duration: 1s;
      -webkit-animation-fill-mode: both;
      animation-fill-mode: both
  }

  .animated.infinite {
      -webkit-animation-iteration-count: infinite;
      animation-iteration-count: infinite
  }

  .animated.hinge {
      -webkit-animation-duration: 2s;
      animation-duration: 2s
  }
  .animated.sdfgh {
      -webkit-animation-duration: 3s;
      animation-duration: 3s
  }
  @-webkit-keyframes zoomIn {
      0% {
          opacity: 0;
          -webkit-transform: scale3d(.3, .3, .3);
          transform: scale3d(.3, .3, .3)
      }
      50% {
          opacity: 1
      }
  }

  @keyframes zoomIn {
      0% {
          opacity: 0;
          -webkit-transform: scale3d(.3, .3, .3);
          -ms-transform: scale3d(.3, .3, .3);
          transform: scale3d(.3, .3, .3)
      }
      50% {
          opacity: 1
      }
  }

  .zoomIn {
      -webkit-animation-name: zoomIn;
      animation-name: zoomIn
  }
@media screen and (max-height:580px) and(min-width: 616px) {
    .newActivityPopup_container .cover .closeBtn{
        bottom: -0.2rem !important;
    }
}
  .newActivityPopup_container {
    left: 0;
    right: 0;
    top:0;
    bottom: 0;
    position: fixed;
    background: rgba(0, 0, 0, 0.7);
    z-index: 2000;
    .cover {
      -webkit-transform: translate3d(0,0,0); /*开启硬件加速*/
      -webkit-backface-visibility: hidden; /*元素旋转时隐藏背面*/
      -webkit-transform-style: preserve-3d; /*保留3D空间*/
      width: 7.5rem;
      height: 8.9rem;
      /*background-color: #ffbe00;*/
      background: url("./img/wallet_newUserPop_BG.png") no-repeat;
      -webkit-background-size: 7.5rem 8.9rem;
      background-size: 7.5rem 8.9rem;
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      top: 0;
      margin: auto;
      .closeBtn {
        width: .6rem;
        height: .6rem;
        position: absolute;
        bottom: -1.27rem;
        left: 50%;
        margin-left: -.3rem;
        background: url('./img/wallet_newUser_iconCloseBtn.png') center no-repeat;
        background-size: contain;

        &:active{
            background: url('./img/wallet_newUser_iconCloseBtn_ac.png') center no-repeat;
            background-size: contain;
        }
      }
      .topClassContent {
        position: absolute;
        left: calc(1rem + -0.3rem);
        top: 3.34rem;
        width: calc(5.52rem + 0.6rem);
        height: 1.52rem;
        /*background-color: #ffbe00;*/

      }
      .mostDiscount {
        position: absolute;
        left: 4.67rem;
        top: 2.06rem;
        min-width: 1.85rem;
        height: .39rem;
        border-radius: .2rem;
        border: .01rem dashed #FFFFFF;
        padding: .03rem;
        p {
          text-align: center;
          font-size: 0;
          span {
            font-size: .26rem;
            color: #fece00;
            line-height: .26rem;
            &:first-child {
              font-size: .22rem;
              line-height: .22rem;
              color: #FFFFFF;
            }
            &:last-child {
              font-weight: 500;
              font-size: .34rem;
              line-height: .34rem;
            }
          }
        }
      }
      .moreCard {
        position: absolute;
        text-align: left;
        line-height: .26rem;
        width: 2.08rem;
        height: .26rem;
        color: @text-color;
        /*background-color: #ffbe00;*/
        left: 50%;
        margin-left: -1.04rem;
        bottom: 1.7rem;
        font-size: 0;
        span {
          font-size: .26rem;
        }
        img {
          /*vertical-align: top;*/
          /*line-height: .26rem;*/
          margin-top: .02rem;
          width: .13rem;
          height: .22rem;
          margin-left: .08rem;
        }
        .imgNor{
            display: inline-block;
            }
            .imgPre{
                display: none;
            }
            &:active span{
                opacity: 0.6;
            }
            &:active .imgNor{
                display: none;
            }
            &:active .imgPre{
                display: inline-block;
            }
      }

    }

  }


</style>
