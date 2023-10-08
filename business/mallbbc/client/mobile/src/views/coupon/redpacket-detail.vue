<!-- 红包详情 -->
<template>
    <view class="redpacket_detail" :class="{invalid_bg:getState}">
        <view class="rest_amount" v-if="detail" :class="{white:getState}">
            <view class="num-font balance">
                <text class="int">{{$getPartNumber(getBalance,'int')}}</text>
                <text class="decimal">{{$getPartNumber(getBalance,'decimal')}}</text>
            </view>
            <view>{{$L('可用余额 [元]')}}</view>
        </view>
        <view class="content">
            <view class="state_icon" :class="{expired:detail.useState == 3,invalid:detail.useState == 4}" v-if="getState"></view>
            <view class="desc" v-if="detail">
                <view class="desc_item">
                    <view class="tit">{{$L('红包名称')}}</view>
                    <view class="con">{{detail.couponName}}</view>
                </view>
                <view class="desc_item">
                    <view class="tit">{{$L('初始面额')}}</view>
                    <view class="con num-font">￥{{detail.randomAmount}}</view>
                </view>
                <view class="desc_item">
                    <view class="tit">{{$L('领取时间')}}</view>
                    <view class="con omission">{{maskTime(detail.receiveTime)}}</view>
                </view>
                <view class="desc_item">
                    <view class="tit">{{$L('有效日期')}}</view>
                    <view class="con omission">{{maskTime(detail.effectiveStart).trim().substr(0,10)}}~{{maskTime(detail.effectiveEnd).trim().substr(0,10)}}</view>
                </view>
                <view class="desc_item" :class="{padBot:showArrowIconFlag && showAlldescFlag}">
                    <view class="tit">{{$L('使用规则')}}</view>
                    <view class="common_con" @click="showAlldesc()" ref="descContainer" :class="{up_con:showArrowIconFlag && showAlldescFlag,down_con:showArrowIconFlag && !showAlldescFlag}">
                        <text ref="descText">{{detail.description}}</text>
                        <view v-if="showArrowIconFlag" class="arrow" :class="{down_arrow:showArrowIconFlag && !showAlldescFlag,up_arrow:showArrowIconFlag && showAlldescFlag}"></view>
                    </view>
                </view>
            </view>
            <view class="history" v-if="historyList && historyList.length>0">
                <view class="record_title">{{$L('消费记录')}}</view>
                <view class="detail">
                    <view class="detail_item flex_row_between_start" v-for="(item,index) in historyList" :key="index">
                        <view class="left flex_column_between_start">
                            <view class="name">{{item.content}}</view>
                            <view v-if="item.orderSn" class="orderSn">订单号：{{item.orderSn}}</view>
                            <view class="orderSn">{{maskTime(item.createTime)}}</view>
                        </view>
                        <view class="right">
                            <view class="amount num-font" :class="{redColor:item.type!='1'}">{{item.type=='1'?'-':'+'}}￥{{item.amount}}</view>
                        </view>
                    </view>
                </view>
            </view>
        </view>
        
    </view>
</template>
<script module="filters" lang="wxs" src="../../utils/filter.wxs"></script>
<script>
    import goodsHandler from '@/components/goods/handler';
    export default {
        components: {
            
        },
        data() {
            return {
                code:'', //红包code
                detail:{}, //红包基本信息
                showAlldescFlag:false, //是否显示全部使用规则
                showArrowIconFlag:false, //是否展示上下图标和省略
                historyList:[] //红包消费记录
            };
        },
        computed: {
            maskTime() {
                return (time) => {
                    let timeStr = ''
                    if (time) {
                        timeStr = time.replaceAll('-','.')
                    }
                    return timeStr
                }
            },
            getBalance() {
                let amount = ''
                if (!this.detail.isHistory && (this.detail.useState == 1 || this.detail.useState == 2)) {
                    amount = this.detail.balance
                } else {
                    amount = 0.00
                }
                return amount
            },
            getState() {
                return this.detail.useState == 3 || this.detail.useState == 4 || (this.detail.useState == 2 && this.detail.isHistory)
            }
        },
        watch: {
        },
        onPageScroll(e) {
            let opacity,bgColor,color,themeMode
            if (e.scrollTop > 0) {
                if(window.titleHeight + window.statusHeight!=0){
                    opacity = e.scrollTop / (window.titleHeight + window.statusHeight - 1);
                }else{
                    opacity = 1
                }
                bgColor = `rgba(255, 255, 255, ${opacity})`;
                opacity = opacity > 1 ? 1 : opacity;
                color = '#222';
                themeMode = 'dark';
            } else {
                bgColor = 'transparent';
                opacity = 0;
                color = '#fff';
                themeMode = 'light';
            }
            this.setTitleBarBackground(bgColor,opacity,color,themeMode)
        },
        mounted(){
            this.detail = JSON.parse(this.$Route.query.redpacketDetail)
            this.code = this.$Route.query.code
            this.getDetail()
            setTimeout(() => {
                if (this.$refs.descContainer?.$el?.offsetWidth < this.$refs.descText?.$el?.offsetWidth) {
                    this.showArrowIconFlag = true
                }
            },100)
            
        },
        methods: {
            setTitleBarBackground(bgColor,opacity,color,themeMode){
                this.$titleBar.set({
                    title: {
                        background: bgColor,
                        opacity:opacity,
                        color:color,
                        themeMode:themeMode
                    },
                    status: {
                        background: bgColor,
                        opacity:opacity,
                        themeMode:themeMode
                    }
                })
            },
            getDetail() {
                let param = {
                    code:this.code
                };
                goodsHandler.getRedpacketDetail(param).then(res => {
                    if (res.state == 200) {
                        this.historyList = res.data.list || []
                        
                    } else {
                        this.$api.msg(res.msg);
                    }
                }).catch((e) => {
                    //异常处理
                })
            },
            showAlldesc() {
                this.showAlldescFlag = !this.showAlldescFlag;
            } 
        }

    }
</script>

<style lang="scss">
.redpacket_detail {
    width: 100%;
    padding: 0 30rpx;
    margin-top: calc(-1*var(--titleBarFillHeight));
    background: url("@/static/shared/redpacket/bg_sh_bg.png") left top/100% 542rpx no-repeat;
    &.invalid_bg {
        background: url("@/static/shared/redpacket/bg_sh_bg_invalid.png") left top/100% 542rpx no-repeat;
    }
    .rest_amount {
        margin: 188rpx auto 0;
        width: fit-content;
        height: 120rpx;
        color: #FFF4E6;
        font-size: 28rpx;
        font-weight: bold;
        text-align: center;
        .balance {
            font-weight: normal;
            .int {
                font-size: 64rpx;
            }
            .decimal {
                font-size: 44rpx;
            }
        }
        
        &.white {
            color: #ffffff;
        }
    }
    .content {
        padding-top: 24rpx;
        position: relative;
        .state_icon {
            position: absolute;
            width: 160rpx;
            height: 160rpx;
            right: 58rpx;
            top: -96rpx;
            background: url('@/static/shared/redpacket/icon_yhq_yishiyong.svg') center/100% 100% no-repeat;
            &.expired {
                background: url('@/static/shared/redpacket/icon_yhq_yiguoqi.svg') center/100% 100% no-repeat;
            }
            &.invalid {
                background: url('@/static/shared/redpacket/icon_common_yishixiao.svg') center/100% 100% no-repeat;
            }
        }
        .desc {
            padding: 28rpx 30rpx;
            border-radius: 20rpx;
            background: linear-gradient(180deg,rgba(255,255,255,0.67), #ffffff 17%, #ffffff);
            border: 2rpx solid #ffffff;
            .desc_item {
                margin-top: 20rpx;
                display: flex;
                justify-content: space-between;
                font-size: 28rpx;
                &.padBot {
                    padding-bottom: 22rpx;
                }
                .tit {
                    width: 178rpx;
                    line-height: 40rpx;
                    color: #666666;
                }
                .con {
                    flex: 1;
                    text-align: right;
                    color: #222222;
                    &.omission {
                        text-overflow: ellipsis;
                        white-space: nowrap;
                        overflow: hidden;
                    }
                }
                .common_con {
                    position: relative;
                    width: calc(100% - 178rpx);
                    text-align: right;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    line-height: 40rpx;
                    &.up_con {
                        height: fit-content;
                        white-space: normal;
                        overflow: visible;
                        // text-align: left;
                    }
                    &.down_con {
                        padding-right: 32rpx;
                    }
                    .arrow {
                        width: 24rpx;
                        height: 24rpx;
                        position: absolute;
                        right: 0;
                        &.down_arrow {
                            top: 8rpx;
                            background: url('@/static/shared/common/icon/btn_common_downarrow1.svg') center/100% 100% no-repeat;
                        }
                        &.up_arrow {
                            bottom: -24rpx;
                            background: url('@/static/shared/common/icon/btn_common_uparrow1.svg') center/100% 100% no-repeat;
                        }
                    }
                }
                &:first-of-type {
                    margin-top: 0;
                }
                
            }
        }
    }
    .history {
        .record_title {
            margin: 32rpx 0 16rpx 0;
            padding-left: 20rpx;
            height: 44rpx;
            line-height: 44rpx;
            font-size: 32rpx;
            font-weight: bold;
            color: #000000;
            position: relative;
            &::before {
                display: block;
                content: '';
                width: 8rpx;
                height: 28rpx;
                position: absolute;
                top: 10rpx;
                left: 0;
                background: #f30300;
            }
        }
        .detail {
            padding-bottom: 30rpx;
            .detail_item {
                min-height: 156rpx;
                margin-top: 24rpx;
                padding: 20rpx 30rpx;
                border-radius: 20rpx;
                background: #fff;
                &:first-of-type {
                    margin-top: 0;
                }
                .left {
                    flex: 1;
                    min-height: calc(156rpx - 40rpx);
                    .name {
                        line-height: 40rpx;
                        font-size: 28rpx;
                        color: #000000;
                        font-weight: bold;
                    }
                    .orderSn {
                        line-height: 34rpx;
                        font-size: 24rpx;
                        color: #999999;
                    }
                }
                .right {
                    width: 160rpx;
                    .amount {
                        line-height: 38rpx;
                        font-size: 32rpx;
                        text-align: right;
                        color: #222222;
                        &.redColor {
                            color: #f30300;
                        }
                    }
                }
            }
        }
    }
}

</style>