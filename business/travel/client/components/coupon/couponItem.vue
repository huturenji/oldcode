<template>
  <div id="coupon-item-container" v-if="!!couponList && couponList.length>0">
      <div class="fLeft stamp-label">
          优惠
      </div>
      <div class="fLeft">
          优惠券
      </div>
      <div class="fLeft remark">
          <span>（{{couponList.length}}张可用）</span>
      </div>
      <div class="fRight detail cursorp" @click="toCouponList">
          <span v-if='currCoupon' class='ft-green'>-<span class='rmb'>&yen;</span>{{currCoupon.CouponValue}}</span>
          <span v-else>未使用（最高立减{{couponList[0].CouponValue}}）</span>
      </div>

      <div v-transfer-dom class="product-coupons">
          <popup v-model="showCouponList" height="100%" width="100%" position="right">
            <ProductCouponCenter :couponList='couponList' :productType='productType' :currCoupon='currCoupon' type='popup' @setCoupon='setCoupon'/>
          </popup>
      </div>

  </div>
</template>
<script>
import {
    TransferDom,
    Popup
} from 'vux';
import extendUtils from './js/extend.js';
import ProductCouponCenter from './productCouponCenter.vue'
export default {
    directives: {
        TransferDom
    },
    components: {
        ProductCouponCenter,
        Popup
    },
    props: {
        productType: {
            type: Number,
            default: 0
        },
        couponList: {
            default:''
        }
    },
    data: function () {
        let that = this;
        let managerData = extendUtils.stateManager.setData([
            {
                name: 'showCouponList',
                parent: '$refs.couponItem',
                show: {
                    callback: function(){
                        let title;
                        switch (that.productType){
                        case 1:
                            title = '机票优惠券'
                            break;
                        case 2:
                            title = '酒店优惠券'
                            break;
                        case 3:
                            title = '火车票优惠券'
                            break;
                        case 4:
                            title = '转账优惠券'
                            break;
                        default: 
                            break;
                        }
                        !!title && (document.title = title);
                    }
                },
                hide: {
                    title: '编辑订单'
                }
            }
        ])
        return Object.assign(managerData,{
            currCoupon: this.couponList!=null && this.couponList.length>0 ? this.couponList[0] : null
        })
    },
    created: function () {
    },
    mounted() {
    },
    watch:{
        couponList: function(value){
            if (!value || value.length==0){
                this.currCoupon = null;
            } else {
                this.currCoupon = value[0];
            }
        }
    },
    methods: {
        toCouponList(){
            this.showCouponList = true;
        },
        setCoupon(coupon){
            this.$emit('setCoupon',coupon);
            this.$nextTick(()=>{
                this.showCouponList = false;
                this.currCoupon = coupon;
            })
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

  #coupon-item-container{
    margin-top: .2rem;
    padding: .3rem;
    background: #ffffff;
    line-height: .4rem;
    font-size: .32rem;
    .clear;

     .stamp-label{
         color: #F83939;
         border: .02rem solid #F83939;
         width: .57rem;
         height: .28rem;
         line-height: .28rem;
         margin: .06rem .1rem .06rem 0;
         border-radius: 0.03rem;
         font-size: .22rem;
         text-align: center;
     }

    .detail{
        padding: 0 .35rem;
        background: url('./img/icon_right.png') no-repeat right center;
        background-size: .12rem .24rem;
    }

    .remark{
        font-size: .26rem;
        color: #999;
        span{
            vertical-align: middle;
        }
    }
    
    .ft-green{
        color: #F83939;
    }

}
.product-coupons .vux-popup-dialog{
    z-index: 503;
}

</style>
