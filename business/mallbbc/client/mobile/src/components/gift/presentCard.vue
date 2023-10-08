<!-- 鹅毛情支付成功底部的贺卡封面选择 -->
<template>
    <view>
        <view class="title">
            <view class="left">选择贺卡：</view>
            <view @click="gotoCard" class="right">查看更多<image :src="imgUrl + 'common/icon/icon_common_rightarrow.svg'" mode="widthFix"></image></view>
        </view>
        <scroll-view class="scroll-view-presentcard" :scroll-x="true" :scroll-left="scrollLeft" :scroll-with-animation="true">
            <view v-for="(item, index) in number" :class="{active: index == current}" @click="choosePresent(index)" :key="index" class="scroll-view-item">
                <image class="card" :src="dealImg(index)" mode="widthFix"></image>
                <image @click.stop="viewSvga(index)" class="play" :src="imgUrl + 'common/icon/btn_emq_bofang.svg'" mode="widthFix"></image>
                <image v-if="index == current" class="choosed" :src="imgUrl + 'common/icon/choosed.png'" mode="widthFix"></image>
            </view>
        </scroll-view>

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
import { getQuerySelector } from '@/utils/common.js'
export default {
    components: { svga },
    data(){
        return {
            imgUrl: getApp().globalData.imgUrl,
            current: 0, // 当前选中的卡片
            number: config.PRESENT_CARD_NUMBER, //一共有几套礼物卡片模板
            showSvga: false, //是否显示svga动画
            svgaSrc: null, // 动画地址
            scrollLeft: 0, // 横向滚动条位置
            scrollLeftList:[]
        }
    },
    props: {
        type: {
            type: String
        }
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
    mounted(){
        // 初始化距离左侧距离列表
        this.initScrollItemLeft();
    },
    activated(){
        // 初始化距离左侧距离列表
        this.initScrollItemLeft();
    },
    watch:{},
    methods: {
        dealImg(index){
            return `https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/card/${index}/cover.png`
        },
        choosePresent(index){
            this.current = index;
            this.$emit('choose', index);
            this.scrollToIndex(index)
        },

        initScrollItemLeft(){
            if(this.scrollLeftList.length > 0){ return }
            setTimeout( ()=> {
                try {
                    this.scrollLeftList = [];
                    getQuerySelector('.scroll-view-item', true, this).then(res => {
                        this.scrollLeftList = res.map((item) => {
                            return (item.left - 30)
                        })
                    })
                } catch (error) {
                    
                }
            }, 100)
        },

        // 选择之后，将选中的滑动到页面能见到的地方
        async scrollToIndex(index){
            if(!!!this.scrollLeftList.length || this.scrollLeftList.length <= 0){ return }
            try {
                await this.$nextTick()
                setTimeout(() => {
                    this.scrollLeft = this.scrollLeftList[index];
                }, 100)
            } catch (error) {
                
            }
        },

        // 跳转到贺卡列表
        gotoCard(){
            this.$Router.push({
                path: '/views/gift/card/index',
                query: {
                    cardIndex: this.current,
                    type: this.type 
                }
            })
            this.$emit('viewMore')
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
.scroll-view-presentcard{
    white-space: nowrap;
    width: 100%;
    display: flex;
    
    .scroll-view-item{
        display: inline-block;
        border-radius: 20rpx;
        margin-right: 14rpx;
        
        width: 294rpx;
        height: 224rpx;
        padding: 10rpx;
        position: relative;
        box-sizing: content-box;
        &.active{
            border: 2rpx dashed #ff0000;
        }
        &:last-child{
            margin-right: 40rpx;
        }
        &:first-child{
            margin-left: 40rpx;
        }
        .card{
            width: 294rpx;
            height: 224rpx;
            border-radius: 20rpx;
        }
        .choosed{
            width: 48rpx;
            height: 50rpx;
            position: absolute !important;
            right: 10rpx;
            bottom: 10rpx;
        }
        .play{
            width: 48rpx;
            height: 48rpx;
            position: absolute !important;
            left: 16rpx;
            bottom: 12rpx;
        }
    }
}
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
.svga-mask{
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background: rgba(0,0,0,.7);
    z-index: 200;
}
</style>