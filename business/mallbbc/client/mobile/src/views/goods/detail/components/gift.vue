<template>
    <!-- 商品详情鹅毛情卡片组件 -->
    <view class="give_gift_entry">
        <view class="process">
            <view class="left" @click="viewFeather"></view>
            <view class="right" @click="clickBtn"></view>
        </view>
    </view>
</template>

<script>
export default {
    data() {
        return {
            imgUrl: getApp().globalData.imgUrl
        }
    },
    props:{

    },
    methods:{
        clickBtn(){
            this.$emit('click');
        },
        
        //跳转到了解鹅毛情的页面
        viewFeather(){
            this.$Router.push({
                path: '/views/gift/preview/index',
                query: {
                    showFeatherConfirmBtn: 0 //不显示立即送礼
                }
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.give_gift_entry{
    width: 100%;
    height: 156rpx;
    overflow: hidden;
    
    .process{
        height: 156rpx;
        display: flex;
        background: url('@/static/shared/gift/bg_emq_xiangqing.png') center no-repeat;
        background-size: 100% auto;
        position: relative;
        .left{
            position: absolute;
            left: 32rpx;
            top: 20rpx;
            width: 286rpx;
            height: 36rpx;
            cursor: pointer;
            background: url('@/static/shared/gift/icon_emq_liaojieemq.png') center no-repeat;
            background-size: 100% 100%;
        }
        .right{
            cursor: pointer;
            position: absolute;
            right: 30rpx;
            top: 18rpx;
            width: 132rpx;
            height: 66rpx;
            background: url('@/static/shared/gift/icon_emq_qusongli.png') center no-repeat;
            background-size: 100% 100%;
        }
        > image{
            width: 100%;
            height: 100%;
        }
    }
}
</style>