<template>
    <div class="insertTips_container cursorp" v-if='hasCouponCanUse || dtReceiveCoupon' @click="goPage">
    <div class="left">
      <img src="./img/redPocket.png" alt="">
      <p v-if="!hasCouponCanUse && !!dtReceiveCoupon">会员专享，更多优惠券等你来拿</p>
      <p v-if="!!hasCouponCanUse">
        您有{{CouponNum}}张<span>{{getProductTypeName()}}</span>优惠券, 最高<span v-if="CouponType==1">满减</span><span v-else>立减</span>
        <span style="fontWeight:bold">{{CouponValue}}</span>元
      </p>
    </div>
    <div class="right">
      <img class="im1" src="./img/red_array_right.png" alt="">
      <img class="im2" src="./img/red_array_right_pre.png" alt="">
    </div>
    </div>
</template>
<script>
import {getCouponsForHome,getMyCoupons,openPage} from './js/requestHandler.js'
import {getProductType} from './js/judgePageType.js'
export default {
    components: {
    },
    props: ['dtReceiveCoupon'],
    data() {
        return {
            //   hasCouponReceive:true, // 活动中心是否有待领取优惠券
            hasCouponCanUse:false, //  个人中心是否有可使用优惠券
            // dtReceiveCoupon:false, // 是否不领取活动券直接关闭
            CouponNum:'',
            CouponValue:'',
            CouponType:''
        }
    },
    created: function(){
        let that=this
        setTimeout(()=>{
            that.getActivityData()
            that.getPersonalCoupon()
        },500)
    },
    filters: {
    },
    methods: {
        getProductTypeName(){ // 根据pathname判断入口类型
            return getProductType('name')
        },
        goPage(){
            if (this.hasCouponCanUse){
                openPage('wallet.html#/myCoupon?pageFrom=home')
            } else {
                openPage('wallet.html#/activityCenter?pageFrom=home')
            }
        },
        getPersonalCoupon(){
            let that=this
            getMyCoupons(getProductType('code'),1).then((res)=>{ // 查询个人中心是否有可使用优惠券
                if (res){
                    if (res.Coupons.length!=0){
                        that.hasCouponCanUse=true
                        that.CouponNum=res.Coupons.length
                        that.CouponValue=res.Coupons[0].CouponValue
                        that.CouponType=res.Coupons[0].CouponType
                    }
                }
            }).catch(err=>console.log(err))
        },
        getActivityData(){
            let that=this
            getCouponsForHome(getProductType('code'),2,100,1).then((res)=>{ // 查询活动中心是否有待领取优惠券
                if (res.Coupons.length==0){
                    // that.hasCouponReceive=false // 没有可领券
                    that.$parent.dtReceiveCoupon=false
                } else { // 非第一次不弹有可领取不显示有多少券
                    that.$parent.dtReceiveCoupon=true
                }
                // if(that.$route.query.gotoUse){  // 是否点击去使用按钮 显示优惠券数量
                //     that.$parent.dtReceiveCoupon=false
                // }
            }).catch(err=>console.log(err))
        }
    },
    mounted() {
    },
    watch: {
        hasCouponCanUse(){
            this.$parent.boxBlockShow= (!!this.hasCouponCanUse || !!this.dtReceiveCoupon)
        },
        dtReceiveCoupon(){
            this.$parent.boxBlockShow= (!!this.hasCouponCanUse || !!this.dtReceiveCoupon)
        }
    }
}
</script>
<style scoped lang="less">
    @import '~styles/core/common.less';
  @import '~styles/mixins/mixinsStyle.less';
 
  
.insertTips_container{
  margin-left: -0.4rem;
  margin-right: -0.4rem;
  padding: 0 .3rem;
  color:#f83939;
  font-size: .26rem;
  height: .6rem;
  background-color: #fff4d7;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .left{
    display: flex;
    justify-content: space-between;
    align-items: center;
    img{
      width: .21rem;
      height: .25rem;
      margin-right: .09rem;
    }
  }
  .right{
    
  }

  &:active{
      background-color: @placeholder-color;
      .im1{
        display: none;
      }
      .im2{
        display: block;
      }
    }
    .im2{
      display: none;
    }
    img{
      width: .44rem;
      height: .44rem;
    }
}
</style>

