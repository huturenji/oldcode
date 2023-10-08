<template>
<div class="empty-page">
    <div class="empty-box flex_column_center_center">
        <view class="img"></view>
        <p class="tips">
            <span>{{tips}}</span>
            <!-- 插槽用来处理无数据刷新等相关的操作，需要业务测自己处理 -->
            <slot />
        </p>
    </div>
</div>
</template>
<script>
export default {
    props:{
        //空白页面显示的文字内容
        tips:{
            type:String,
            default:'比N家模块已停用'
        },
        emptyImg:{ //config.js 里面配置的图片名
            type:String,
            default:'DEFAULT_EMPTY_IMG'
        }
    },
    data() {
        return {
            imgUrl: getApp().globalData.imgUrl
        }
    }
}
</script>
<style lang="scss" scoped>
page{
    height: 100%;
}
.empty-page{
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    padding-top: calc((100vh - var(--titleBarFillHeight, 0px)) * 0.32 - 128rpx);
    .empty-box{
        text-align: center;
        .tips{
            font-size: 0.28rem;
            color: #999;
        }
        .img {
            width: 256rpx;
            height: 256rpx;
            background: var(--emptyImg);
            background-size: 100% 100%;
        }
    }
}
</style>