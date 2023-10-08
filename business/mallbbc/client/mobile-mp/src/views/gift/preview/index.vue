<template>
    <view class="feather_wrapper" :class="{padt: !!showBtn}">
        <!-- 自定义titleBar start -->
        <u-navbar title="了解鹅毛情" bgColor="#000" leftIconColor="#fff" :titleStyle="{ color: '#fff', 'font-weight': 'bold' }">
            <template slot="left" >
                <!-- 混入isShare:通过点击分享链接进来 -->
                <u-icon v-if="showHome" name="home" size="25" color="#fff" @click="goHome"></u-icon>
                <u-icon v-else name="arrow-left" size="25" color="#fff" @click="$Router.back()"></u-icon>
            </template>
        </u-navbar>

		<!-- 自定义titleBar end -->
        <image class="img" mode="widthFix" src="https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/gift/bg_emq_yingdao_mini.png"></image>
        <view :class="['btn_wrap',iosHairPhone ? 'iosBottomPadding' : 'androidBottomPadding']" v-if="!!showBtn">
            <button @click="goToFeatherConfirm" class="btn">立即送礼</button>
        </view>
    </view>
</template>

<script>
import { setStorageSync } from '@/utils/common.js'
import shareMixin from '@/common/mixin/share';

export default {
    mixins: [shareMixin],
    data() {
        return {
            queryOptions: {}, //url上面的参数
            hasPreviewCacheKey: 'hasPreviewedFeather', // 是否用户点击过了解鹅毛情的缓存key
             
        };
    },
    mounted(){
        // 初始化该页面的时候,此时说明用户已经预览并了解了鹅毛情, 缓存中置为true
        setStorageSync(this.hasPreviewCacheKey, true)
    },
    computed: {
        //是否显示立即送礼的按钮控制变量
        showBtn(){
            return this.queryOptions?.showFeatherConfirmBtn + '' == '1'
        },
    },
    onLoad(options) {
        this.queryOptions = options;
    },
    onPageScroll(e){
        
    },
    methods: {
        // 跳转到鹅毛情的下单页面 
        goToFeatherConfirm(){
            this.queryOptions.FEATHER_ORDER = true;
            this.$Router.push({
                path: '/views/order/confirm/index',
                query: this.queryOptions
            })
        },

    }
};
</script>

<style lang="scss" scoped>
.feather_wrapper{
    width: 100%;
    background-color: #000;
    display: flex;
    &.padt{
        padding-bottom: 120rpx;
    }
    .img{
        flex: 1;
        height: auto;
        margin-top: 40rpx;
    }
}
.btn_wrap{
    box-sizing: border-box;
    position: fixed;
    bottom: 0;
    z-index: 10;
    width: 750rpx;
    background-color: #000;
    padding: 20rpx 30rpx;
    .btn{
        flex: 1;
        height: 80rpx;
        line-height: 80rpx;
        text-align: center;
        color: #fff;
        font-size: 30rpx;
        background-color: #F30300;
        border-radius: 40rpx;
        cursor: pointer;
        font-weight: 600;
    }
}

</style>

