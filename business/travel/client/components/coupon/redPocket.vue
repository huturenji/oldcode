<template>
    <!-- 新人优惠券红包入口-->
    <div class="redPocket cursorp" @click="showActivityCenter">
        <img class="img1" src="./img/redPocketEnter.png" alt="">
        <img class="img2" src="./img/redPocketEnter_pre.png" alt="">
    </div>
</template>
<script>
import {openPage} from './js/requestHandler.js'
export default {
    components: {
    },
    props: [],
    data() {
        return {
            //    hasCouponReceive:false, // 活动中心是否有待领取优惠券
            //   hasCouponCanUse:false, //  个人中心是否有可使用优惠券
        }
    },
    created: function(){
    },
    filters: {
    },
    methods: {
        showActivityCenter(){ // 跳转活动中心
            openPage('wallet.html#/activityCenter?pageFrom=home')
        }
        // getPersonalCoupon(){
        //     let that=this
        //     getMyCoupons(0,1).then((res)=>{  // 查询个人中心是否有可使用优惠券
        //     if(res){
        //         if(res.Coupons.length!=0){
        //             that.hasCouponCanUse=true
        //         }else{
        //             that.hasCouponCanUse=false
        //         }
        //     }
        //     }).catch(err=>console.log(err))
        // },
        // getActivityData(){
        //     let that=this
        //     getCouponsForHome(0,2,1,1).then((res)=>{// 查询活动中心是否有待领取优惠券
        //     if(res.Coupons.length==0){
        //        that.hasCouponReceive=false
        //     }else{
        //         that.hasCouponReceive=true
        //     }
        //     }).catch(err=>console.log(err))
        // }
    },
    mounted() {
        //  let that=this
         
        //     that.getActivityData()
        //     that.getPersonalCoupon()
            
    },
    watch: {
    }
}
</script>
<style scoped lang="less">
@import '~styles/core/common.less';
  @import '~styles/mixins/mixinsStyle.less';
.redPocket{
    position: fixed;
    top:.24rem;
    right:.24rem;
    width: .57rem;
    height: .57rem;
    .img2{
        display: none;
    }
    &:active{
        .img1{
            display:none;
        }
        .img2{
            display: block;
        }
    }
    img{
        width: .57rem;
        height: .57rem;
    }
}
</style>

