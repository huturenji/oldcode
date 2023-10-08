<!-- 鹅毛情支付成功底部的贺卡封面选择 -->
<template>
    <view>
        <!-- 自定义titleBar start -->
		<u-navbar title="贺卡" placeholder autoBack></u-navbar>
		<!-- 自定义titleBar end -->
        <view class="wrap">
            <view v-for="(item, index) in number" :class="{active: index == current}" @click="choosePresent(index)" :key="index" class="card-item">
                <image class="card" :src="dealImg(index)" mode="widthFix"></image>
                <image @click.stop="viewSvga(index)" class="play" :src="bofangImage" mode="widthFix"></image>
                <image v-if="index == current" class="choosed" :src="chooseImage" mode="widthFix"></image>
            </view>
        </view>
        <!-- 收礼物初始化动画 -->
        <template v-if="showSvga">
            <svga 
                :src="svgaSrc" 
                :style="svgaStyle"
                :loops="1"
                width="344px"
                height="618px"
                contentMode="AspectFill"
                :showCloseIcon="true"
                :closeIconStyle="closeIconStyle"
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
import svga from '@/views/components/svga/index.vue';
import systemMixin from '@/common/mixin/system.js'
export default {
    mixins: [systemMixin],
    components: {svga},
    data(){
        return {
            bofangImage: 'https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/common/icon/btn_emq_bofang.svg',
            chooseImage: 'https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/common/icon/choosed.png',
             
            current: 0, // 当前选中的卡片
            number: config.PRESENT_CARD_NUMBER, //一共有几套礼物卡片模板
            showSvga: false, //是否显示svga动画
            svgaSrc: null // 动画地址
        }
    },
    onShow(){
        this.current = this.$Route.query.cardIndex || 0;
        this.showSvga = false;
        this.svgaSrc = null;
    },
    props: {
       
    },
    computed:{
        // 动画容器的样式
        svgaStyle(){
            return {
                position: 'fixed',
                top: '0',
                bottom: '0',
                left: '0',
                right: '0',
                zIndex: 10000,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }
        },
        closeIconStyle(){
            return {
                'top': (this.navHeight + 50) + 'px', // 该变量在system.js 混入里面
            }
        }
    },
    methods: {
        dealImg(index){
            return `https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/card/${index}/cover.png`
        },
        choosePresent(index){
            this.current = index;
            try {
                const pages = getCurrentPages(); //当前页面栈
                if (pages.length > 1) {
                    const beforePage = pages[pages.length - 2]; //获取上一个页面实例对象
                    beforePage.$vm.$refs.presentCard.choosePresent(index); //触发上个面中的方法
                    this.$Router.back(1);
                }
            } catch (error) {
                console.log('error', error);
            }
        },
        // 预览动画
        async viewSvga(index){
            this.svgaSrc = `https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/card/${index}/animate.svga`;
            this.showSvga = true;
        }
    }
}
</script>
<style lang="scss" scoped>
.wrap{
    padding: 40rpx;
    display: flex;
    flex-wrap: wrap;
    font-size: 0;
    .card-item{
        border-radius: 20rpx;
        margin-right: 30rpx;
        width: 320rpx;
        height: 244rpx;
        position: relative;
        &.active::after{
            content: "";
            border-radius: 24rpx;
            border: 2rpx dashed #ff0000;
            position: absolute;
            top: -12rpx;
            bottom: -12rpx;
            left: -12rpx;
            right: -12rpx;
            z-index: 2;
        }
        &:nth-child(2n){
            margin-right: 0;
        }
        margin-bottom: 30rpx;
        .card{
            width: 320rpx;
            height: 244rpx;
            width: 100%;
            height: auto;
            border-radius: 20rpx;
        }
        .choosed{
            width: 48rpx;
            height: 50rpx;
            position: absolute;
            right: 0;
            bottom: 0;
        }
        .play{
            width: 48rpx;
            height: 48rpx;
            position: absolute !important;;
            left: 16rpx;
            bottom: 12rpx;
            z-index: 30;
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