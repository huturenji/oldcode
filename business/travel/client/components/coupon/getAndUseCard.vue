<!--下单页面的优惠券信息-->
<template>
  <div class="list2_container">
    <div class="couponBox clear">
      <div class="priceBox cursorp" @click="showUsePopup">
        <div class="price">
          <h4><span>￥</span><span>{{dataList.CouponValue}}</span></h4>
        </div>
        <div class="tips clear">
          <span>{{getCouponName(dataList.ProductType)}}</span>
          <div class="discount">
            <p class="discountBox"><span v-if="dataList.CouponType==1">满{{dataList.FullValue}}减￥{{dataList.CouponValue}}</span><span v-else>立减￥{{dataList.CouponValue}}</span></p>
          </div>
        </div>
      </div>
      <div class="useBox cursorp" @click="useBoxBtn">
        <!--领取按钮-->
        <div class="use clear" v-if="useBtnone&&dataList.CanReceive">
          <span>立即领取</span>
        </div>
        <!--使用按钮-->
          <div class="use clear" v-else>
            <span>去使用</span>
            <img class="imgNor" src="./img/wallet_icon_arr_white.png" alt="">
            <img class="imgPre" src="./img/wallet_icon_arr_ac.png" alt="">
          </div>
      </div>
      <!--已领取按钮-->
      <div class="icon_get" v-if="!dataList.CanReceive||!useBtnone">
        <img src="./img/wallet_icon_alreadyGet.png" alt="">
      </div>

    </div>
  </div>
</template>
<script>
import {getCouponProduct} from './js/judgePageType'
import extendUtils from './js/extend.js'
import {useCoupon,openPage} from './js/requestHandler.js'
export default {
    components: {
    },
    props: ['dataList','ListToPopUp'],
    data () {
        return {
            OutOfTime:false, // 是否超时
            useBtnone: true,
            thisTime:new Date().getTime(), // 当前时间戳
            startUseTime:!!this.dataList.ValidPeriod?new Date(this.dataList.ValidPeriod.StartTime.replace(/-/g,'/')).getTime():''// 时间可使用时间开始时间戳
        }
    },
    created: function () {
    },
    methods: {
        /**
         * 返回优惠券名字
         */ 
        getCouponName(code){
            return getCouponProduct(code)
        },
        showUsePopup () { // 显示详情弹窗
            if (!!this.ListToPopUp){
                if (this.thisTime<=this.startUseTime){ // 判断当前时间是否小于可使用时间
                    this.OutOfTime=true
                } else {
                    this.OutOfTime=false
                }
                this.ListToPopUp(this.dataList,this.OutOfTime||(this.useBtnone&&this.dataList.CanReceive)) // 传数据，使用期控制按钮可用性 未到使用时间或者未领取
            }
        },
        useBoxBtn(){
            let that=this 
            if (that.useBtnone&&that.dataList.CanReceive){ // 领取
                useCoupon(that.dataList.CouponNo).then((res)=>{
                    if (res.CouponId){
                        that.useBtnone = false
                        if (window.location.hash.indexOf('activityCenter')==-1){ // 非活动中心页面
                            that.$parent.$parent.$refs.insertTips.getPersonalCoupon() //刷新insertTip中个人中心数据数量
                            that.$parent.AvtivityPopReceive=false // newActivityPopup 关闭按钮控制insertTip显示优惠券数量
                        }
                    }
                }).catch(err=>console.log(err))
            } else { // 去使用
                if (that.thisTime<=that.startUseTime){ // 判断是否不在可用期内
                    let text='当前时间未到该优惠券有效期内，暂无法使用该优惠券'
                    extendUtils.showConfirm(text, null, 2, '查看使用规则', '知道了', null, that.showUsePopup, false)
                } else {
                    let ProductType=this.dataList.ProductType // 类型名
                    if (window.location.hash.indexOf('activityCenter')==-1){ // 非活动中心页面
                        that.$parent.$parent.isShowNewActivityPopup=false // 去使用关闭新人活动弹窗
                    } else { // 活动中心页面跳转
                        openPage(getCouponProduct(ProductType,'type')+'.html#/?pageFrom=coupon')
                        that.$parent.$parent.isShowNewActivityPopup=false // 去使用关闭新人活动弹窗
                    }
                }
            }
        },
        gotoActivityCenter () {
            this.$router.push({
	            	path:'/activityCenter'
	            })
        }
    },
    mounted () {
    },
    watch: {},
    filters: {}

}
</script>
<style scoped lang="less" type="text/less">
  @import '~styles/core/common.less';
  @import '~styles/mixins/mixinsStyle.less';

  .list2_container {
    margin-bottom: .2rem;
    padding: 0 .3rem;
    .couponBox {
      position: relative;
      /*width: 6.7rem;*/
      width: 100%;
      /*box-sizing: border-box;*/
      height: 1.52rem;
      /*margin: 0 auto;*/
      background: url("./img/wallet_activityCenter_tiecket_BG.png") no-repeat;
      -webkit-background-size: 100% 1.52rem;
      background-size: 100% 1.52rem;
      .priceBox {
        float: left;
        height: 100%;
        width: 70%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        .price {
          padding-top: .26rem;
          /*margin-left: 1.71rem;*/
          h4 {
            span {
              color: #ff2651;
              font-weight: bold;
              &:first-child {
                font-size: .45rem;
                line-height: .45rem;
              }
              &:nth-child(2) {
                font-size: .6rem;
                line-height: .6rem;
              }
            }
          }
        }
        .tips {
          padding-bottom: .2rem;
          color: #ff2651;
          background: none;
          .flex-box;
          .align-items(center);

          span {
            font-size: .26rem;
            line-height: .26rem;
          }
          .discount {
            margin-left: .07rem;
            float: left;
            p.discountBox {
              display: inline-block;
              min-width: 1.1rem;
              min-height: .3rem;
              padding: .02rem;
              margin-top: -.03rem;
              line-height: .30rem;
              text-align: center;
              font-size: .22rem;
              color: #ff2651;
              /*width: .95rem;*/

              border: 0.02rem solid #ff2651; //
              -webkit-border-radius: .04rem;
              -moz-border-radius: .04rem;
              border-radius: .04rem;
            }
          }
        }
      }
      .useBox {
        height: 100%;
        float: left;
        width: 30%;

        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        .imgNor{
            display: block;
            }
            .imgPre{
                display: none;
            }
            &:active .use{
                color:#f8a6a6;
            }
            &:active .imgNor{
                display: none;
            }
            &:active .imgPre{
                display: block;
            }
        .use {
          /*position: absolute;*/

          height: .28rem;
          /*top: 50%;*/
          /*margin-top: -.14rem;*/
          color: #FFFFFF;
          z-index: 10;
          span {
            float: left;
            line-height: .28rem;
          }
          img {
            width: .13rem;
            height: .22rem;
            float: left;
            margin-left: .12rem;
            margin-top: .02rem;
          }
          
        }
      }

      .icon_get {
        position: absolute;
        right: .42rem;
        top: 0;
        width: 1.11rem;
        height: .9rem;
        img {
          width: 1.11rem;
          height: .9rem;
        }
      }
    }
  }
</style>

