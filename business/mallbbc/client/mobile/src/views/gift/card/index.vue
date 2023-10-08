<!-- 鹅毛情支付成功底部的贺卡封面选择 -->
<template>
    <view class="wrap">
        <view v-for="(item, index) in number" :class="{active: index == current}" @click="choosePresent(index)" :key="index" class="card-item">
            <image class="card"  :src="dealImg(index)" mode="widthFix"></image>
            <image @click.stop="viewSvga(index)" class="play" :src="imgUrl + 'common/icon/btn_emq_bofang.svg'" mode="widthFix"></image>
            <image v-if="index == current" class="choosed" :src="imgUrl + 'common/icon/choosed.png'" mode="widthFix"></image>
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
            svgaSrc: null, // 动画地址
            type: '' 
        }
    },
    onShow(){
        this.current = this.$Route.query.cardIndex || 0;
        this.type = this.$Route.query.type; // 为空代表正常来的鹅毛情订单，为字符串"zero"代表 0元支付来的鹅毛情订单
    },
    props: {
       
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
            try {
                if(this.type == 'zero'){
                    this.$api.prePage().$refs.voucherSucess.$refs.presentCard.choosePresent(index);
                } else {
                    this.$api.prePage().$refs.presentCard.choosePresent(index);
                    window.featherPayResult = index;
                }
                this.$Router.back();
            } catch (error) {
                console.log('error', error);
            }
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