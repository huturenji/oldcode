<!-- 鹅毛情支付成功底部的贺卡封面选择 -->
<template>
    <view>
        <view class="title">
            <view class="left">选择贺卡：</view>
            <view @click="gotoCard" class="right">查看更多<image :src="imgUrl + 'common/icon/icon_common_rightarrow.svg'" mode="widthFix"></image></view>
        </view>

        <view class="swiper-wrap">
            <swiper class="swiper" circular :duration="20" :current="current" previous-margin="40rpx" next-margin="390rpx">
                <swiper-item class="swiper-item" v-for="(item, index) in number" :key="index">
                    <view class="content" :class="{active: index == current}" @click="choosePresent(index)">
                        <image class="card"  :src="dealImg(index)" mode="widthFix"></image>
                        <image @click="viewSvga(index)" class="play" :src="imgUrl + 'common/icon/btn_emq_bofang.svg'" mode="widthFix"></image>
                        <image v-if="index == current" class="choosed" :src="imgUrl + 'common/icon/choosed.png'" mode="widthFix"></image>
                    </view>
                </swiper-item>
            </swiper>
        </view>

        <!-- 收礼物初始化动画 -->
        <template v-if="showSvga">
            <svga 
                @click.native="showSvga=false"
                :src="svgaSrc" 
                :containerStyle="svgaStyle"
                :loops="1"
                :width="344"
                :height="618"
                :showCloseIcon="true"
                @done="showSvga=false"
                @close="showSvga=false"
            />
            <!-- 礼物动画的遮罩蒙层 -->
            <view @click="showSvga=false" class="svga-mask"></view>
        </template>
    </view>
</template>
<script>
import config from '@/common/lib/config';
import svga from '@/components/svga/index.vue';
export default {
    components: {svga},
    data(){
        return {
            imgUrl: getApp().globalData.imgUrl,
            current: 0, // 当前选中的卡片
            number: config.PRESENT_CARD_NUMBER, //一共有几套礼物卡片模板
            showSvga: false, //是否显示svga动画
            svgaSrc: null // 动画地址
        }
    },
    props: {
        
    },
    watch:{
        
    },
    computed:{
        // 动画容器的样式
        svgaStyle(){
            return {
                position: 'fixed',
                top: 'var(--titleBarFillHeight, 0px)',
                bottom: '0',
                left: '0',
                right: '0',
                zIndex: 10000,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }
        }
    },
    methods: {
        dealImg(index){
            return `https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/card/${index}/cover.png`
        },
        choosePresent(index){
            this.current = index;
            this.$emit('choose', index)
        },
        // 跳转到贺卡列表
        gotoCard(){
            this.$Router.push({
                path: '/views/gift/card/index',
                query: {
                    cardIndex: this.current
                }
            })
        },
        // 预览动画
        async viewSvga(index){
            this.svgaSrc = `https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/card/${index}/animate.svga`;
            await this.$nextTick();
            this.showSvga = true;
        }
    }
}
</script>
<style lang="scss" scoped>
.title{
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    padding: 0 40rpx;
    margin-bottom: 34rpx;
    .left{
        font-size: 34rpx;
        font-weight: bold;
    }
    .right{
        color: #999999;
        font-size: 28rpx;
        display: flex;
        align-items: center;
        image{
            width: 24rpx;
            height: 24rpx;
        }
    }
}
.swiper{
    height: 244rpx;
}
.swiper-item{
    border-radius: 20rpx;
    .content{
        width: 314rpx;
        height: 244rpx; 
        overflow: hidden;
        position: relative;
        border-radius: 24rpx;
        padding: 10rpx;
        &.active{
            border: 2rpx dashed #ff0000;
        }
        .card{
            width: 294rpx;
            height: 224rpx;
            border-radius: 20rpx;
        }
        .choosed{
            width: 48rpx;
            height: 50rpx;
            position: absolute !important;;
            right: 0;
            bottom: 0;
        }
        .play{
            width: 48rpx;
            height: 48rpx;
            position: absolute !important;;
            left: 16rpx;
            bottom: 12rpx;
        }
    }
    
}
.svga-mask{
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background: rgba(0,0,0,.7);
    z-index: 200;
    .close_icon{
        width: 48rpx;
        height: 48rpx;
        position: absolute;
        top: 320rpx;
        right: 80rpx;
    }
}
</style>