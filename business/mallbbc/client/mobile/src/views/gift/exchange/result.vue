<!-- 鹅毛情礼物领取结果页面 -->
<template>
    <view class="result">
        <!-- 用来占位顶部title栏的 -->
        <view class="zhanwei" :style="{opacity: opacity}"></view>
        <view class="top">
            <view class="flex_row_center_center">
                <image :src="imgUrl + result.image[resultState]" />
                <text class="title">{{result.resultStateText[resultState]}}</text>
            </view>
            <view class="tips">{{result.resultTips[resultState]}}</view>
        </view>
        <view class="bottom_btn">
            <!-- 领取成功 -->
            <view class="sucess_btn_wrap" v-if="resultState==0">
                <view class="goIndex" @click="goToFeatherIndex">返回鹅毛情首页</view>
                <!-- <btnFactory :btnInfo="btnConfig.failure" :featherId="featherId"></btnFactory> -->
            </view>

            <!-- 领取失败 -->
            <btnFactory
                v-else
                :btnInfo="btnConfig.failure"
                size="big"
                :otherProps="{ goToIndexType: 'receive' }"
            />
        </view>
    </view>
</template>

<script>
import btnFactory from '@/components/button/btnFactory';
export default {
    data(){
        return {
            imgUrl: getApp().globalData.imgUrl,
            result: {
                image: {
                    0:'gift/icon_common_suc.svg',
                    1:'order/icon_common_failure.png'
                },
                resultStateText: {
                    0:'领取成功',
                    1:'领取失败'
                },
                resultTips: {
                    0:'快递小哥正快马加鞭的为您配送，请您留意快递电话',
                    1:'抱歉，商品太火爆了，过几天再试试吧！商品到货后我们将第一时间通知您'
                }
            },
            resultState:1, //上个页面提交订单的结果 0-成功，1-失败
            btnConfig:{ //成功与失败时显示的按钮
                sucess: {
                    type: 'viewGiftDetail'
                },
                failure: {
                    type: 'havedKnow'
                }
            },
            featherId:'',
            opacity: 0 //为了做沉浸式加的占位图的透明度
        }
    },
    components: {
        btnFactory
    },
    mounted(){
        this.resultState = this.$Route.query.state;
        this.featherId = this.$Route.query.featherId;
    },
    methods:{
        // 返回上两级 
        onPageBack(){
            this.$Router.back(1);
        },
        //重定向到鹅毛情首页  我收的 tab一栏
        goToFeatherIndex(){
            this.$Router.push({
                path: '/gift',
                query: {
                    tabIndex: 1
                }
            })
        }
    }
}
</script>

<style lang="scss" scoped>
page{
    height: 100%;
    background: #50575C;
}
.result{
    width: 750rpx;
    height: 100vh;
    background: url('https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/mallbbc/img/bg_emq_success.png') no-repeat;
    background-size: 100% auto;
    background-position: center bottom;
    color: #fff;
    padding-top: var(--titleBarHeight);
    .top{
        padding: 100rpx;
        image{
            width: 44rpx;
            height: 44rpx;
        }
        .title{
            font-size: 36rpx;
            font-weight: bold;
            color: #fff;
            margin-left: 16rpx;
        }
        .tips{
            width: 100%;
            font-size: 28rpx;
            color: #c2c2c2;
            margin-top: 28rpx;
            text-align: center;
        }
        
    }
    .bottom_btn{
        width: 100%;
        padding: 0 100rpx;
       
        .sucess_btn_wrap{
            display: flex;
            justify-content: space-between;
            align-items: center;
           
            .goIndex{
                width: 100%;
                height: 88rpx;
                line-height: 88rpx;
                border-radius: 44rpx;
                font-size: 30rpx;
                font-weight: bold;
                cursor: pointer;
                color: #fff;
                text-align: center;
                background-color: #F30300;
            } 
            ::v-deep .btn-viewGiftDetail{
                height: 84rpx;
                line-height: 84rpx;
                border-radius: 20rpx;
            }  
        }
    }
}
.zhanwei{
    width: 750rpx;
    height: var(--titleBarHeight);
    position: fixed;
    top: 0;
    z-index: 1000;
    background: #020202;
    opacity: 0;
}

</style>
