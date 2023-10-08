<template>
    <view class="four flex_column_center_center">
        <view class="img"></view>
        <view>{{$L('页面不见了')}}</view>
    </view>
</template>

<script>
export default {
    data() {
        return {
            imgUrl: getApp().globalData.imgUrl
        };
    },
    
    components: {},
    props: {},
        
       
    mounted(){
            
    },
        
    
    methods: {

    
    }
};
</script>

<style lang="scss">
    .four{
        text-align: center;
        padding-top: calc((100vh - var(--titleBarFillHeight, 0px)) * 0.32 - 128rpx);
        width: 100%;

        .img {
            width: 256rpx;
            height: 256rpx;
            background: var(--fourEmptyImg);
            background-size: 100% 100%;
        }
        view {
            color: $main-third-color;
            font-size: 28rpx;
        }
    }
    
</style>

