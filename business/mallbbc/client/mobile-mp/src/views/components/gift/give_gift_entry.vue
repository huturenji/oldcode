<template>
    <!-- 商品详情鹅毛情卡片组件 -->
    <view class="give_gift_entry">
        <view class="process">
            <image @click="viewFeather" class="left" src="https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/gift/icon_emq_liaojieemq.png"></image>
            <image @click="clickBtn" class="right" src="https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/gift/icon_emq_qusongli.png"></image>
        </view>
    </view>
</template>

<script>
export default {
    data() {
        return {
             
        }
    },
    props:{
        // 跳转按钮是否置灰
        customGiftFlag: {
            type: Boolean
        }
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
                    showBtn: 0 //不显示立即送礼
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
        position: relative;
        height: 156rpx;
        display: flex;
        background: url('https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/gift/bg_emq_xiangqing.png') center no-repeat;
        background-size: 100% auto;
        .left{
            position: absolute;
            left: 32rpx;
            top: 20rpx;
            width: 286rpx;
            height: 36rpx;
        }
        .right{
            position: absolute;
            right: 30rpx;
            top: 18rpx;
            width: 132rpx;
            height: 66rpx;
        }
        > image{
            width: 100%;
            height: 100%;
        }
    }
}
</style>