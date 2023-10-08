<template>
  <div class="temporaryCouponCenter_container">
    <div class="checkAllBox">
      <div class="topCheckAll">
        <P>不使用优惠券</P>
        <div class="checker">
          <block @click="changeCheckAll">
            <img v-if='hasChooseAll' src="./img/check_square.png">
            <img v-else src="./img/unCheck_square.png">
          </block>
        </div>
      </div>
    </div>
    <OrdinaryUseCard
      v-for="(coupon,index) in couponList"
      v-show="!coupon.isUsed&&!coupon.isOvertime"
      :checked='coupon.checked'
      :productType='productType'
      :key="index"
      :coupon="coupon"
      :useBtnCheck="true"
      ref="checkChild"
      @setCoupon='setCoupon'
    ></OrdinaryUseCard>
  </div>
</template>

<script>
import OrdinaryUseCard from './ordinaryUseCard.vue'
import extendUtils from './js/extend.js'
export default {
    directives: {
    },
    components: {
        OrdinaryUseCard
    },
    props: {
        productType: {
            type: Number,
            default: 0
        },
        couponList: {
            type: Array,
            default: null
        },
        currCoupon: {
            type: Object
        },
        type: {//跳转类型，router还是popup
            type: String,
            default: 'router'
        }
    },
    data () {
        return {
            hasChooseAll: false
        }
    },
    created: function () {
        if (!!this.type && this.type=='router'){
            this.notifyAppBackAndRefresh();
        }
    },
    computed: {

    },
    methods: {
        notifyAppBackAndRefresh(){
            let that = this;
            //注册刷新事件，入口页面强制刷新
            sinosdk.sino.onRefresh(()=>{ location.reload() });
            //注册并监听t信返回事件
            sinosdk.sino.onBack(function() { //点击app返回事件
                extendUtils.throttle(function () {
                    that.$router.go(-1)
                }, this);
            }.bind(this));
        },
        changeCheckAll () { // 点击不使用优惠券
            this.hasChooseAll = true;
            this.couponList.forEach((coupon)=>{
                this.$set(coupon,'checked',false);
            })
            this.$emit('setCoupon');
        },
        setCoupon(currCoupon){
            if (!currCoupon){
                return;
            }
            this.couponList.forEach((coupon)=>{
                if (coupon.CouponId!=currCoupon.CouponId){
                    this.$set(coupon,'checked',false);
                } else {
                    this.$set(coupon,'checked',true);
                }
            })
            this.hasChooseAll = false;
            this.$forceUpdate();
            this.$emit('setCoupon',currCoupon);
        },
        /**
       * 默认选中的优惠券
       */ 
        setDefaultCoupon(){
            if (!this.currCoupon || !this.couponList){
                return;
            }
            //如果已经选择了不要优惠券，则不设置默认的优惠券
            if (!!this.hasChooseAll){
                this.changeCheckAll();
                return;
            }
            this.couponList.forEach((coupon)=>{
                if (coupon.CouponId==this.currCoupon.CouponId){
                    this.$set(coupon,'checked',true);
                }
            })
            this.hasChooseAll = false;
        }
    },
    watch: {
        couponList: function(){
            setTimeout(()=>{
                this.setDefaultCoupon();
            },0);
        }
    },
    mounted () {
        this.setDefaultCoupon();
    },
    filters: {}

}
</script>
<style scoped lang="less" type="text/less">
  @import '~styles/core/common.less';
  @import '~styles/mixins/mixinsStyle.less';

  .temporaryCouponCenter_container {
    margin-top: .2rem;

    .checkAllBox {
      padding: 0 .3rem;

      .topCheckAll {
        background: url("./img/wallet_coupon_noCheckBG.png") no-repeat;
        -webkit-background-size: 100% 1.22rem;
        background-size: 100% 1.22rem;
        width: 100%;
        height: 1.22rem;

        /*padding: 0 .3rem;*/
        p {
          float: left;
          font-size: .3rem;
          color: @text-color;
          margin-top: .47rem;
          margin-left: .56rem;
        }
        .checker {
          float: right;
          margin-right: .5rem;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: space-around;
          img {
            width: .4rem;
            height: .4rem;
          }
        }

      }

    }

  }

</style>

