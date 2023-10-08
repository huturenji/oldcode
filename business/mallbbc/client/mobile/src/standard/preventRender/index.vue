<template>
<div class="preventRender-page">
    <div class="preventRender-box">
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
    data() {
        return {
            imgUrl: getApp().globalData.imgUrl,
            appName:'正确的移动应用',
            tips:`请使用正确的移动应用打开`
        }
    },
    async created(){
        try {
            this.appName = await sinosdk.sino.getAppName(this.$Route.query.preventRenderId||'') || '正确的移动应用';
        } catch (error) {
        }
        this.tips = `请使用${this.appName}打开`;
        //清除首页html骨架图
        if (!!document.getElementById('htmlBg')){
            document.getElementById('htmlBg').style.display = 'none';
        }
    }
}
</script>
<style lang="scss" scoped>
page{
    height: 100%;
}
.preventRender-page{
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    background: #fff;
    // padding-top: calc((100vh - var(--titleBarFillHeight, 0px)) * 0.32 - 128rpx);
    .preventRender-box{
        width: 100%;
        text-align: center;
        .tips{
            font-size: 0.3rem;
            line-height: 42rpx;
            color: #222222;
        }
        .img {
            width: 100%;
            height: 932rpx;
            background: url('@/static/shared/common/img/icon_haixia_disanfang.png') no-repeat top;;
            background-size: 100% 100%;
            margin-bottom: 24rpx;
        }
    }
}
</style>