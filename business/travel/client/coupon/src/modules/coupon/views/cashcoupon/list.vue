<template>
  <div class="my_coupon"  ref="contentDom">
        <div class="my_coupon_content">
            <mescroll-vue ref="mescroll" :down="mescrollDown" :up="mescrollUp" @init="mescrollInit">
                <div class="my_coupon_list" v-if="couponList && couponList.length>0">
                    <div class="my_coupon_pre" v-for="(item,index) in couponList" :key="index">
                        <couponItem :couponItem='item' :isMobileModuleEnabled='isMobileModuleEnabled'/>
                    </div>
                </div>
                <div class="no_data" v-if="couponList && couponList.length == 0">
                    <div class="imgWrap"></div>
                    <div class="text">暂无代金券~</div>
                </div>                  
            </mescroll-vue>
        </div>
        <div v-transferDom>
            <div class='history_entry' @click="goHistory">历史代金券</div>
        </div>
    </div>
</template>

<script>
import MyCouponHandler from 'modules/coupon/views/MyCouponHandler.js';
import MescrollVue from 'mescroll.js/mescroll.vue';
import {TransferDom} from 'vux';
import couponItem from '@/components/cashcoupon/previewItem'
export default {
    directives: {
        TransferDom
    },
    mixins: [MyCouponHandler.mixin.tChatEventMixin],
    components: {MescrollVue, couponItem},
    data () {
        return {
            mescroll: null, // mescroll实例对象
            mescrollUp: { // 上拉加载的配置.
                callback: this.getCouponList, 
                htmlNodata: '<p class="upwarp-nodata">没有更多数据了~</p>',
            },
            couponList: null,
            useState: 1,//1-未使用；2-已使用；3-已过期；5-已失效
            isMobileModuleEnabled: false
        }
    },
    async mounted(){
        this.isMobileModuleEnabled = await MyCouponHandler.isMobileModuleEnabled()
    },
    methods: {
        mescrollInit (mescroll) {
            this.mescroll = mescroll  
        },
        changeTab(type){
            this.useState = type;
            this.mescroll.resetUpScroll(true);
        },
        async getCouponList(page, mescroll){
            try {
                const couponListResponse = await MyCouponHandler.getCouponList({useState: this.useState, pageIndex: page.num, pageSize: page.size})
                if (couponListResponse.resultCode != 0){
                    const errorMsg = couponListResponse.resultMessage || '获取优惠券列表失败'
                    MyCouponHandler.showToast(errorMsg)
                    throw errorMsg
                }
                this.couponList = page.num == 1 ? couponListResponse.result.list : this.couponList.concat(couponListResponse.result.list)
                mescroll.endByPage(couponListResponse.result.list.length, couponListResponse.result.pageCount);
            } catch (e){
                console.error('获取优惠券列表失败！' + e);
                mescroll.endErr();
            }
        },
        goHistory(){
            this.$router.push({path: '/cashcoupon/history'})
        },
        goBackFun(){
            MyCouponHandler.closePage();
        }
    }
}
</script>

<style scoped lang="less" type="text/less">
@import '~themes/default/styles/cashcoupon/list.less';
</style>
