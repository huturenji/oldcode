<template>
    <view class="custom_swiper_dot" :style="[swiperDotStyle]">
        <view v-if="mode === 'default'" :style="{background:background}" class="dot_container">
            <view v-for="index in dotNum" :key="index" :class="['default_dot', index === currentIndex ? 'default_dot_active' : '']" :style="{backgroundColor:index === currentIndex?activeDotColor:dotColor}"></view>
        </view>
        <view v-if="mode === 'nav'" class="nav_container" :style="{background:background}">
            <view class="nav_dot"><text :style="activeNavDotStyle">{{(currentIndex+1)+"/"}}</text><text :style="navDotStyle" class="dotNum">{{dotNum}}</text></view>
        </view>
    </view>
</template>
<script>

export default {
    props:{
        //轮播容器的样式
        swiperDotStyle:{
            type:Object,
            default:() => {}
        },
        // 类型 ：default(默认)
        mode: {
            type: String,
            default: 'default'
        },
        // 轮播点个数
        dotNum:{
            type:Number
        },
        // 当前索引
        currentIndex:{
            type:[Number, String]
        },

        // 轮播点组件背景色
        background:{
            type:String,
            default:'transparent'
        },
        // default未选中点背景色
        dotColor:{
            type:String,
            default:'rgba(255,255,255,0.5)'
        },
        // default选中点背景色
        activeDotColor:{
            type:String,
            default:'#ffffff'
        },

        //nav当前数字样式
        activeNavDotStyle:{
            type:Object,
            default() {
                return {
                    color:'#fff',
                    fontSize:'26rpx'
                }
            }
        },
        //nav总数字样式
        navDotStyle:{
            type:Object,
            default() {
                return {
                    color:'#fff',
                    fontSize:'18rpx'
                }
            }
        }
        
    }
}
</script>
<style lang='scss' scoped>
.dot_container{
    width: fit-content;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 6rpx 0rpx 6rpx 12rpx;
    border-radius: 10rpx;
    .default_dot{
        width: 20rpx;
        height: 6rpx;
        transform: skew(-30deg);
        border-radius: 2px;
        margin-right: 12rpx;
        &.default_dot_active{
            width: 30rpx;
        }
    }
}
.nav_container{
    width: 80rpx;
    height: 44rpx;
    border-radius: 22rpx;
    .nav_dot{
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        text-align: center;
        line-height: 32rpx;
        font-size: 26rpx;
        color: #fff;
        .dotNum{
            font-size: 18rpx;
        }
    }
}
</style>