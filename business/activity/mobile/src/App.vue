<script>
import sensorHandler from '@/utils/sensorHandler';
export default {
    //全局配置
    globalData: {
        imgUrl: `./static/shared/`, // 静态资源地址前置
        apiUrl: window.location.origin + '/',
        userParams: {},// 授权信息
        userBaseParams: {},// 用户信息
    },
    onLaunch: function () {
        //数据埋点上报初始化
        sensorHandler.init();
    },
    onShow: function () {},
    onHide: function () {},
}
</script>

<style lang="scss">
@import './static/css/base.css';

/*每个页面公共css */
/* #ifdef H5 */
page {
    width: 750rpx;
    margin: 0 auto;
}
/* #endif */

::-webkit-scrollbar {
    display: none;
    width: 0;
    height: 0;
    color: transparent;
    display: flex;
    justify-content: center;
}

 /* 页面wrapper的位置在titlebar下方，tabbar上方 */
uni-page-wrapper{
    position: absolute;
    top: var(--titleBarFillHeight, 0px);
    left: 0;
    width: 100%;
    background-color: $bg-color-split;
    height: calc(100% - var(--titleBarFillHeight, 0px) - var(--tabBarHeight, 0px) );
    padding-bottom:env(safe-area-inset-bottom);
    z-index: 0;
}

@media screen and (min-width: 616px){
    uni-page-wrapper{
        left: 50%;
        margin-left: -375rpx;
        width: auto;
    }
}

/* 防止uni-page-wrapper的marginTop坍塌 */
uni-page-body, uni-page-body > uni-view:first-of-type{
    &::before{
        content: '';
        display: block;
        overflow: hidden;
    }
}

// 全局修改toast样式
uni-toast .uni-toast{
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    width: auto;
    min-width: 660rpx;
    min-height: 528rpx;
    margin: 0;
    padding: 96rpx 108rpx 84rpx 108rpx;
    border-radius: 72rpx;
    background: rgba(0,0,0,.8);
    transform: translate(-50%,-50%) scale(0.3333);

    .uni-icon_toast{
        margin: 0;
    }

    .uni-icon-error::before{
        font-size: 40px;
    }

    .uni-toast__content{
        margin: 0;
        color: #fff;
        font-size: 84rpx;
        max-width: 1044rpx;
        min-width: 504rpx;
        word-break: keep-all;
        word-wrap: break-word;
        line-height: 120rpx;
    }
}
uni-toast .uni-sample-toast{
    transform: none;
    width: 100%;
}
uni-toast .uni-simple-toast__text{
    position: relative;
    left: -50%;
    background-color: rgba(0,0,0,.8);
    border-radius: 16rpx;
    font-size: 28rpx;
    min-width: 304rpx;
    max-width: 650rpx;
    font-weight: 400;
    line-height: 40rpx; 
}

uni-toast .uni-icon_toast.uni-loading {
    width: 180rpx;
    height: 180rpx;
}
</style>
