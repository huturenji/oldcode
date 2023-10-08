<template>
  <div class="list_container">
    <div class="couponBox" :style="backgroundDivImg">
      <!--快过期图标-->
      <div class="icon_deadline" v-if="isDeadline">
        <img src="./img/wallet_icon_deadline.png" alt="">
      </div>
      <template v-if="isOnUsedOrDdeadline">
        <!--已过期图标-->
        <div class="icon_overtime" v-show="isOvertime">
          <img src="./img/wallet_icon_overtime.png" alt="">
        </div>
        <!--已使用图标-->
        <div class="icon_used" v-show="isUsed">
          <img src="./img/wallet_icon_used.png" alt="">
        </div>
      </template>
      <div class="flexBox cursorp">
        <div class="price"  @click="showUsePopup">
          <h3><span :style="disabledColor">￥</span><span :style="disabledColor">{{coupon.CouponValue}}</span></h3>
          <div class="CouponValue">
            <span class="discountBox" :style="disabledColorBorder">
                <template v-if='coupon.CouponType==1'>
                    满{{coupon.FullValue}}减￥{{coupon.CouponValue}}
                </template>
                <template v-else>
                    立减￥{{coupon.CouponValue}}
                </template>
            </span>
          </div>
        </div>
        <div class="tips"  @click="showUsePopup">
          <h4 :style="disabledColor">{{getCouponName(coupon.ProductType,'name3')}}</h4>
          <p class="p1" :style="disabledColor">
              {{getCouponName(coupon.ProductType,'name2')}}{{coupon.CouponType=='1'?'满'+coupon.FullValue+'减￥':'立减￥'}}{{coupon.CouponValue}}
            </p>
          <p class="p2" :style="disabledColor">有效期至：{{coupon.ValidPeriod.EndTime | dateFormat}}</p>
        </div>
        <div class="use" v-if="!useBtnone && !useBtnCheck">
        </div>
        <div class="use clear cursorp" v-if="useBtnone" @click="gotoUse">
          <div>
            <span>去使用</span>
            <img src="./img/wallet_icon_arr.png" alt="" class="im1">
            <img src="./img/wallet_icon_arr_ac.png" alt="" class="im2">
          </div>
        </div>
        <div class="checker cursorp" v-if="useBtnCheck">
          <div @click="changeCheckOne">
            <img v-if='checked' src="./img/check_square.png">
            <img v-else src="./img/unCheck_square.png">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {getCouponProduct} from './js/judgePageType'
import {openPage} from './js/requestHandler.js'
export default {
    components: {
    },
    created () {
    },
    props: ['isOnUsedOrDdeadline', 'useBtnone', 'isOvertime', 'isUsed', 'ListToPopUp', 'backgroundDivImg', 'coupon', 'useBtnCheck', 'isDeadline','disabledColorData','productType','checked'],
    data () {
        return {
        // backgroundDivImg   劵背景
        // ListToPopUp  调用弹出窗
            // isDeadline: 0,   // 是否显示快过期标签 预设30天
        // useBtnone: true,   一类使用按钮
            usedOrovertime: 1, // 是否有超时标签
            // isUsed: 0,       // 是否有使用过标签
            //  isOvertime: 1    // 是否有过期标签
            //  isOnUsedOrDdeadline: 0    // 是否进入使用过期页面
            disabledColor: this.disabledColorData?this.disabledColorData[0]:null,
            disabledColorBorder: this.disabledColorData?this.disabledColorData[1]:null
        }
    },
    filters:{
        dateFormat: function(value){
            if (!value){
                return '';
            }
            // return new Date(value).format('yyyy-MM-dd');
            return value.split(' ')[0]
        }
    },
    methods: {
        /**
         * 返回优惠券名字
         */ 
        getCouponName(code,returnType){
            return getCouponProduct(code,returnType)
        },
        showUsePopup () {
            var that=this
            if (!!this.ListToPopUp){
                this.ListToPopUp(this.coupon)
            }
        },
        gotoUse(){
            let that=this
            let ProductType=this.coupon.ProductType // 类型名
            openPage(getCouponProduct(ProductType,'type')+'.html#/?pageFrom=coupon&gotoUse=true')
        },
        changeCheckOne () { // 使用优惠券单选
            this.$emit('setCoupon',this.coupon);
        }
    },
    watch: {},
    mounted () {

    }
}
</script>

<style scoped lang="less" type="text/less">
  @import '~styles/core/common.less';
  @import '~styles/mixins/mixinsStyle.less';

  .list_container {
    margin-top: .2rem;
    padding: 0 .3rem;
    .couponBox {
      position: relative;
      background: url("./img/wallet_coupon.png") no-repeat;
      -webkit-background-size: 100% 2rem;
      background-size: 100% 2rem;
      width: 100%;
      height: 2rem;
      margin-top: .2rem;
      .icon_deadline {
        position: absolute;
        width: .85rem;
        height: .75rem;
        img {
          width: 100%;
          height: 100%;
        }
      }

      .icon_overtime {
        position: absolute;
        width: 1.11rem;
        height: .91rem;
        right: .13rem;
        img {
          width: 100%;
          height: 100%;
        }
      }

      .icon_used {
        position: absolute;
        width: 1.11rem;
        height: .91rem;
        right: .13rem;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .flexBox {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        .use {
          box-sizing: border-box;
          padding-top: .86rem;
          width: 23%;
          height: 2rem;
          color: #ff2651;
          font-size: 0;
          span {
            float: left;
            height: .28rem;
            line-height: .28rem;
            font-size: .28rem;
          }
          img {
            float: left;
            margin-left: .12rem;
            margin-top: .02rem;
            height: .22rem;
            vertical-align: top;
          }
          &:active {
            color: #f8a6a6
          }
          &:active .im1 {
            display: none;
          }
          &:active .im2 {
            display: block;
          }
          .im1 {
            display: block;
          }
          .im2 {
            display: none;
          }

        }
        .price {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          align-items: center;
          box-sizing: border-box;
          @price: #ff2651;
          width: 30%;
          height: 2rem;
          padding: .42rem 0;
          h3{
            font-size: .45rem;
          }
        
          span {
            color: @price;
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
          .CouponValue {
            width: 100%;
            // margin-top: .16rem;
            display: flex;
            justify-content: center;
            text-align: center;
            .discountBox {
              font-weight: normal;
              display: inline-block;
              /*margin: 0 auto;*/
              box-sizing: border-box;
              line-height: .32rem;
              text-align: center;
              font-size: .22rem;
              color: @price;
              min-width: 1.1rem;
              min-height: .32rem;
              border: 0.02rem solid @price; //
              -webkit-border-radius: .04rem;
              -moz-border-radius: .04rem;
              border-radius: .04rem;
              padding: .02rem;
            }
          }
        }
        .tips {
          box-sizing: border-box;
          width: 45%;
          height: 2rem;
          padding-left: .4rem;
          padding-top: .42rem;
          h4 {
            font-weight: normal;
            font-size: .3rem;
            line-height: .3rem;
            color: @text-color;

          }
          p {
            font-size: .22rem;
            line-height: .22rem;
            color: #999999;
          }
          .p1 {
            margin-top: .25rem;
          }
          .p2 {
            margin-top: .13rem;
          }

        }
      }

    }
    .checker {
      width: 1.59rem;
      height: 2rem;
      padding-right: .5rem;
      box-sizing: border-box;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: flex-end;
      img {
        width: .4rem;
        height: .4rem;
      }
    }
  }

</style>
