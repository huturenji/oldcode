<template>
  <div class="point-card-container" v-if='maxCouponValus'>
      <div class='title'>新人福利社，红包任性领</div>
      <div class='coupon-des'>最高优惠<span>￥{{maxCouponValus}}</span></div>
      <img class='btn cursorp' src="./img/reciveRedPocket.png" @click="goActivityCenter"></img>
  </div>
</template>
<script>
import {getCouponsForHome,openPage} from './js/requestHandler.js'

export default {
    directives: {
    },
    components: {
    },
    props: {
        productType: null
    },
    data: function () {
        return {
            maxCouponValus: 0
        }
    },
    created: function () {
        this.getMaxCoupon();
    },
    mounted() {
    },
    watch:{
    },
    methods: {
        getMaxCoupon(){
            let that = this;
            if (!that.productType){
                return;
            }
            getCouponsForHome(parseInt(that.productType),2,2,1).then((res)=>{
                if (!!res.Coupons && res.Coupons.length!=0){
                    that.maxCouponValus = res.Coupons[0].CouponValue;
                }
            }).catch(err=>console.log(err))
        },
        goActivityCenter(){
            openPage('wallet.html#/activityCenter?pageFrom=home')
        }
    }
}
</script>
<style scoped lang="less">
  @import '~styles/core/common.less';
  @import '~styles/mixins/mixinsStyle.less';

  *{
    box-sizing: border-box;
  }

  .fLeft{
    float: left;
  }

  .fRight{
      float: right;
  }

  .point-card-container{
    background:
    url('./img/couponCardCoinL.png') .32rem .15rem no-repeat ,
    url('./img/couponCardCoinR.png') right .15rem bottom .15rem no-repeat,
    url('./img/couponCardRedPocket.png') center no-repeat,
    url('./img/couponCardBg.png') left top repeat-y ;
    background-size: .5rem .39rem,.5rem .39rem,2.08rem 1.75rem,100%;
    height: 2.3rem;
    margin: 0.4rem;
    padding: .55rem .32rem 0;
    color: #fff0c8;
    text-shadow: 0 0.02rem 0.1rem rgba(130, 66, 15,0.3);
    position: relative;
    border-radius: .18rem;

        .title{
            margin-bottom: .12rem;
            font-size: .42rem;
            font-family: PingFangSC-Semibold;
        }
        .coupon-des{
            font-size: .22rem;
            font-family: PingFangSC-Regular;
            span{
                font-size: .31rem;
            }
        }
        .btn{
            position: absolute;
            background-size: contain;
            top: .46rem;
            right: .25rem;
            width: 1.4rem;
            height: 1.4rem;
            display: block;
        }
   }

   @media screen and (min-width: @screen-sm) {
    .point-card-container{
        .title,.coupon-des{
            font-family: Microsoft Yahei;
        }
    }
   }

</style>
