<!-- 领取卡密红包 -->
<template>
    <view class="container">
        <view class="my_redpacket_pre">
            <view class='redpacket-content'>
                <view class="redpacket_pre_left">
                    <view class="redpacket_pre_price" v-if="redpacketInfo.publishValue">
                        <text class="unit">¥ </text>
                        <text class="price_int num-font">{{getPriceByUnit(redpacketInfo.publishValue,'int')}}</text>
                        <text class="price_demical num-font">{{getPriceByUnit(redpacketInfo.publishValue,'demical')}}</text>
                    </view>
                </view>
                <view class="redpacket_pre_cen">
                    <view class="redpacket_pre_title">{{redpacketInfo.couponName}}</view>
                    <view class="redpacket_pre_time" v-if="redpacketInfo.effectiveStart && redpacketInfo.effectiveEnd">
                        <view>{{formateDate(redpacketInfo.effectiveStart)}}</view>
                        <view>~</view>
                        <view>{{formateDate(redpacketInfo.effectiveEnd)}}</view>
                    </view>
                    <view class="redpacket_pre_time" v-else>
                        {{
                            redpacketInfo.description
                        }}
                    </view>
            
                </view>
                <view class="redpacket_pre_right">
                    <view class="haveNotUse" v-if="redpacketInfo.publishValue">
                        <view>
                            {{
                                $L(redpacketState ? '已领取' : '已失效')
                            }}
                        </view>
                        <view @click="toUse" v-if="redpacketState">{{$L('去使用')}}</view>
                    </view>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
import redpacketHandler from '@/components/redpacket/handler';
import { isEmpty } from '@/utils/common.js'

export default {
    data() {
        return {
            showPrice: false,//自适应字体大小前先不展示金额
            redpacketInfo: {},
            imgUrl: getApp().globalData.imgUrl,
            redpacketState: 0 // 0 已失效 1 正常
        };
    },
    created(){
        this.getRedpacketByPwd();
    },
    methods:{
        formateDate(dateStr){
            if(!dateStr){
                return ''
            }
            let date = new Date(dateStr.replace(/-/g, '/'));
            let month = date.getMonth()+1;
            month = month < 10 ? '0'+month : month;
            let day = date.getDate()
            day = day < 10 ? '0' + day : day;
            return date.getFullYear() + '.'+ month + '.' + day
        },
        async getRedpacketByPwd(){
            
            uni.showLoading()
            let password = SnUtils.getUserPara('password');
            if(isEmpty(password)){
                return
            }
            try{
                const res = await redpacketHandler.receiveRedpacket({password})

                if (res.state == 200 && res.data && res.data.publishValue) {
                    this.redpacketState = 1;
                    this.redpacketInfo = res.data;
                    this.$api.msg('红包领取成功')
                } else {
                    // 已兑换情况
                    if(res.data?.receiveState == 2) {
                        this.redpacketState = 1;
                    }
                    
                    const redpacketInfo = await redpacketHandler.getByPassword({password}
                    )
                    // 已兑换情况
                    if(redpacketInfo.data?.receiveState == 2) {
                        this.redpacketState = 1;
                    }
                    this.redpacketInfo = redpacketInfo.data

                    // 其他异常情况直接显示错误信息
                    this.$api.msg(res.msg);
                }
            }catch(e){
                this.$api.msg('获取红包信息失败');
                console.error('获取红包详情失败：', e)
            }finally{
                uni.hideLoading();
            }
        },
        getPriceByUnit(value,unit){
            if(unit === 'int'){
                return parseFloat(value).toFixed(2).toString().split('.')[0]
            } 
            return '.' + parseFloat(value).toFixed(2).toString().split('.')[1]
        },
        toUse(){
            this.$Router.push({
                path: '/pages/index/index'
            })
        }
    }
}
</script>

<style lang='scss'>
$redpacketWidth: 632rpx;
//覆盖wrapper背景色
page{
    position: relative;
    height: 100%;
    background-color: #fff;
    z-index: 0;
}
.container{
    background-color: #EFF2F5;
    position: relative;
    display: flex;
    flex-direction: column;
    height: 100%;

    .my_redpacket_pre {
        position: relative;
        top: -10rpx;
        flex: auto;
        padding: 40rpx 32rpx 10rpx;
        background-size: 100% 100%;
        overflow: hidden;

        .redpacket-content {
            width: 100%;
            height: 190rpx;
            background: url('@/static/shared/redpacket/bg_wode_hongbao_used.png') no-repeat;
            background-size: cover;
            display: flex;

            .redpacket_pre_left {
                width: 188rpx;
                padding-left: 32rpx;
                display: flex;
                align-items: center;

                .redpacket_pre_price {
                    text-align: center;
                    line-height: 32rpx;
                    padding: 0 20rpx;
                    color: #F30300;
                    font-weight: normal;
                    

                    .unit{
                        font-size: 28rpx;
                    }

                    .price_int{
                        font-size: 56rpx;
                    }

                    .price_demical {
                        font-size: 40rpx;
                    }
                }
            }

            .redpacket_pre_cen {
                width: 264rpx;
                margin: 0 20rpx 0 62rpx ;
                padding-top: 46rpx;

                
                .redpacket_pre_title {
                    font-size: 36rpx;
                    color: #fff;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    display: -webkit-box;
                    -webkit-line-clamp: 1;
                    -webkit-box-orient: vertical;
                    word-break: break-all;
                }

                .redpacket_pre_time {
                    display: flex;
                    flex-wrap: wrap;
                    margin-top: 20rpx;
                    font-size: 22rpx;
                    color: #fff;
                }
            }

            .redpacket_pre_right {
                width: 136rpx;
                .haveNotUse {
                    width: 136rpx;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    align-items: center;
                    padding: 40rpx 0;
                    height: 100%;
                    &>view:first-child{
                        font-size: 26rpx;
                        text-align: center;
                        color: #fff;
                    }
                    &>view:nth-child(2){
                        font-size: 28rpx;
                        padding: 4rpx 22rpx;
                        line-height: 20px;
                        background: #f30300;
                        color: #fff;
                        border-radius: 24rpx;
                        font-weight: bold;
                    }
                }
            }
        }

    }

}

</style>
