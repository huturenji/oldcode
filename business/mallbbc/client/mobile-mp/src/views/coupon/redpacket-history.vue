<!-- 红包历史记录 -->
<template>
    <view class="my_redpacket"  ref="contentDom">
        <scroll-view class="my_redpacket_content" @scrolltolower='getMoreData' scroll-y>
            <view class="my_redpacket_list" ref="redpacketListDom" v-if="redpacketList && redpacketList.length>0">
                <!-- 返回状态useState：1-未使用（可用），2-已使用，3-已过期，4-已失效 -->
                <view class="my_redpacket_con flex_row_start_start" v-for="(item,index) in redpacketList" :key="index" 
                :class="{expired:item.useState == 3,invalid:item.useState == 4}" @click="goDetail(item)">
                    <view class="left flex_row_center_center">
                        <view class="price_box num-font">
                            <text class="unit num-font" :style="{fontSize:redpacketFitFontSize['small'][getPartNumber(item.randomAmount,'int').toString().length]}">¥</text>
                            <text class="price_int num-font" :style="{fontSize:redpacketFitFontSize['int'][getPartNumber(item.randomAmount,'int').toString().length]}">{{getPartNumber(item.randomAmount,'int')}}</text>
                            <text class="price_decimal num-font" v-if="getPartNumber(item.randomAmount,'decimal')!='.00'" :style="{fontSize:redpacketFitFontSize['decimal'][getPartNumber(item.randomAmount,'int').toString().length]}">{{getDecimalVal(getPartNumber(item.randomAmount,'decimal'))}}</text>
                        </view>
                    </view>
                    <view class="right flex_row_start_center">
                        <view class="right_con flex_column_center_start">
                            <view class="title">{{item.couponName}}</view>
                            <view class="original_amount">初始面额：{{item.randomAmount}}元</view>
                            <view class="valid_date">{{maskTime(item.effectiveStart).trim().substr(0,10)}}~{{maskTime(item.effectiveEnd).trim().substr(0,10)}}</view>
                        </view>
                    </view>
                    <view class="symbol"></view>
                </view>
            </view>
            <loadingState :state='loadingState' mTop='400rpx' class="loadingState" 
            v-if="loadingState=='first_loading' || loadingState=='loading' || (loadingState=='no_more_data' && redpacketList && redpacketList.length>0 && showNoMoreDataTips)"
            :class="{loading:loadingState=='loading'}"/>
            <view class="no_data" v-if="loaded && (!redpacketList || redpacketList.length==0)">
                <view class="imgWrap"></view>
                <text>暂无红包~</text>
            </view> 
        </scroll-view>
    </view>
</template>
<script>
    import loadingState from "@/common/components/loading/loading.vue";
    import {getPartNumber, checkPaginationHasMore} from '@/utils/common.js'
    import goodsHandler from '@/views/components/goods/handler';
    import uniPopup from '@/common/components/uni-popup/uni-popup.vue'
    export default {
        components: {
            loadingState,
            uniPopup
        },
        data() {
            return {
                pageObj:{
                    current:1,
                    pageSize: 10
                },
                hasMore: false, //是否还有数据
                loaded:false, //数据是否请求完
                redpacketFitFontSize:{
                    'small':{1:'28rpx',2:'28rpx',3:'28rpx',4:'28rpx',5:'28rpx',6:'28rpx',7:'24rpx',8:'24rpx'},
                    'int':{1:'56rpx',2:'56rpx',3:'56rpx',4:'56rpx',5:'48rpx',6:'44rpx',7:'36rpx',8:'32rpx'},
                    'decimal':{1:'40rpx',2:'40rpx',3:'40rpx',4:'40rpx',5:'32rpx',6:'28rpx',7:'28rpx',8:'24rpx'}
                },
                redpacketList:[], //红包列表
                useState:2, //查询红包的状态 1-可用 2-不可用
                loadingState:'first_loading',
                showNoMoreDataTips:true
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
            getDecimalVal() {
                return (val) => {
                    let value = ''
                    value = val.indexOf('0')==(val.length-1)?val.substring(0,(val.length-1)):val
                    return value
                }
            }
        },
        mounted(){
            this.getRedpacketList()
        },
        methods: {
            // 处理金额的显示
			getPartNumber(number, type){
				return getPartNumber(number, type)
			},
            //页面触底事件
            getMoreData() {       
                if (this.hasMore) {
                    this.getRedpacketList();
                }
            },
            //获取优惠券列表
            getRedpacketList() {
                let param = {};
                param.current = this.pageObj.current;
                param.pageSize = this.pageObj.pageSize;
                param.useState = this.useState;
                this.loadingState = this.loadingState == 'first_loading' ? this.loadingState : 'loading';
                goodsHandler.getMyRedpacketList(param).then(async res => {
                    if (res.state == 200) {
                        if (this.pageObj.current == 1) {
                            this.redpacketList = res.data.page.list
                        } else {
                            this.redpacketList = this.redpacketList.concat(res.data.page.list);
                        }
                        this.loaded = true
                        if (this.loadingState == 'first_loading') {
                            this.loadingState = ''
                        }
                        this.hasMore = checkPaginationHasMore(res.data.page.pagination); //是否还有数据
                        if (this.hasMore) {
                            this.pageObj.current++
                            this.loadingState = 'loading';
                        } else {
                            this.loadingState = 'no_more_data';
                        }
                        
                    } else {
                        this.loaded = true
                        this.loadingState = '';
                        uni.showToast({ title: res.msg, icon: 'none' })
                    }
                }).catch((e) => {
                    //异常处理
                })
            },
            // 去红包详情页面
            goDetail(item) {
                let redpacketDetail = {
                    couponMemberId:item.couponCode,
                    couponName:item.couponName,
                    randomAmount:item.randomAmount,
                    receiveTime:item.receiveTime,
                    effectiveStart:item.effectiveStart,
                    effectiveEnd:item.effectiveEnd,
                    description:item.description,
                    balance:item.balance,
                    useState:item.useState,
                    isHistory:true
                }
                this.$Router.push({
                    path:'/views/coupon/redpacket-detail',
                    query:{
                        code: item.couponCode,
                        redpacketDetail:JSON.stringify(redpacketDetail)
                    }
                })
            }
        },

    }
</script>

<style lang="scss">
    page {
        background: $uni-bg-color;
        height: 100%;
    }
    .my_redpacket_content{
        height: 100%;
        display: flex;
        flex-direction: column;
        overflow: auto;
    }
    .my_redpacket {
        width: 750rpx;
        height: 100%;
        margin: 0 auto;
        padding-bottom: var(--safe-area-inset-bottom);
        .total_amout {
            .amout {
                color: #f30300;
                font-size: 36rpx;
                span {
                    font-size: 20rpx;
                }
            }
        }
        .loadingState{
            padding-bottom: calc(40rpx + var(--safe-area-inset-bottom));
        }

        .my_redpacket_list {
            display: flex;
            flex-direction: column;
            padding: 0 32rpx;
            .my_redpacket_con {
                width: 100%;
                height: 190rpx;
                margin-top: 32rpx;
                position: relative;
                background:url('https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/decorate/redpacket/bg_wode_hongbao_guoqi.png') center center/100% 100% no-repeat;
                .left {
                    width: 232rpx;
                    padding: 0 0 0 12rpx;
                    height: 100%;
                    flex-shrink: 0;
                    .price_box {
                        padding: 0 10rpx;
                        font-size: 28rpx;
                        color: #222222;
                        .price_int {
                            font-size: 56rpx;
                        }
                        .price_decimal {
                            font-size: 40rpx;
                        }
                    }
                }
                .right {
                    // flex: 1;
                    width: calc(100% - 232rpx);
                    height: 100%;
                    color: #fff;
                    padding: 0 100rpx 0 52rpx;
                    .right_con {
                        width: fit-content;
                        max-width: 100%;
                        height: 100%;
                        padding-bottom:6rpx;
                    }
                    .title {
                        width: 100%;
                        font-size: 32rpx;
                        font-weight: bold;
                        overflow:hidden;
                        text-overflow:ellipsis;
                        white-space:nowrap;
                        line-height: 36rpx;
                    }
                    .original_amount {
                        margin-top: 8rpx;
                        font-size: 26rpx;
                        line-height: 36rpx;
                    }
                    .valid_date {
                        margin-top: 10rpx;
                        font-size: 24rpx;
                        line-height: 34rpx;
                    }
                }
                .symbol {
                    width: 136rpx;
                    height: 136rpx;
                    position: absolute;
                    right: 0;
                    top: 0;
                    background:url('https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/redpacket/icon_yhq_yishiyong.svg') center center/100% 100% no-repeat;
                }
                &.expired {
                    .symbol {
                        background:url('https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/redpacket/icon_yhq_yiguoqi.svg') center center/100% 100% no-repeat;
                    }
                }
                &.invalid {
                    .symbol {
                        background:url('https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/redpacket/icon_common_yishixiao.svg') center center/100% 100% no-repeat;
                    }
                }
            }
        }

        .no_data {
            height: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            padding-top: calc((100vh - 90rpx - var(--titleBarFillHeight, 0px)) * 0.32 - 128rpx);
            .imgWrap {
                width: 256rpx;
                height: 256rpx;
                background: url('https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/empty/icon_defpage_zwyhq.png') center no-repeat;
                background-size: 100%;
            }

            text {
                font-size: 28rpx;
                font-family: Source Han Sans CN;
                font-weight: 400;
                color: $main-third-color;
                margin: 0rpx 0 48rpx;
            }

            .go_coupon_center {
                width: 228rpx;
                height: 64rpx;
                background: #f30300;
                border-radius: 32rpx;
                font-size: 28rpx;
                font-family: PingFang SC;
                font-weight: 600;
                color: #fff;
                text-align: center;
                line-height: 64rpx;
            }
        }
    }
</style>