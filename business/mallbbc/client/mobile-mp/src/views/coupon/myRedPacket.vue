<!-- 我的红包 -->
<template>
    <view class="my_redpacket"  ref="contentDom">
        <view class="fixedTop" ref="fixedTopDom">
            <view class="total_amout flex_column_between_center" ref="topTotalDom">
                <view class="amout num-font">
                    <text class="big_amout">{{getPartNumber(totalAmout || 0,'int')}}</text>
                    <text class="small_amout">{{getPartNumber(totalAmout || 0,'decimal')}}</text>
                </view>
                <view class="title">可用余额 [元]</view>
                <view @click="goRules" class="rules"></view>
            </view>
        </view>
        <view class="my_redpacket_conBox">
            <scroll-view class="my_redpacket_content" @scrolltolower='getMoreData' scroll-y>
                <view class="my_redpacket_list" ref="redpacketListDom" v-if="redpacketList && redpacketList.length>0">
                    <view class="my_redpacket_con flex_row_start_start" v-for="(item,index) in redpacketList" :key="index" @click="goDetail(item)">
                        <view class="left flex_row_center_center">
                            <view class="price_box num-font">
                                <text class="unit num-font" :style="{fontSize:redpacketFitFontSize['small'][getPartNumber(item.balance,'int').toString().length]}">¥</text>
                                <text class="price_int num-font" :style="{fontSize:redpacketFitFontSize['int'][getPartNumber(item.balance,'int').toString().length]}">{{getPartNumber(item.balance,'int')}}</text>
                                <text class="price_decimal num-font" v-if="getPartNumber(item.balance,'decimal')!='.00'" :style="{fontSize:redpacketFitFontSize['decimal'][getPartNumber(item.balance,'int').toString().length]}">{{getDecimalVal(getPartNumber(item.balance,'decimal'))}}</text>
                            </view>
                        </view>
                        <view class="right flex_row_start_center">
                            <view class="right_con flex_column_center_start">
                                <view class="title">{{item.couponName}}</view>
                                <view class="original_amount">初始面额：{{item.randomAmount}}元</view>
                                <view class="valid_date">{{maskTime(item.effectiveStart).trim().substr(0,10)}}~{{maskTime(item.effectiveEnd).trim().substr(0,10)}}</view>
                            </view>
                        </view>
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
        <view class="fixed_bottom" @click="goRedpacketHistory()" ref="fixedBottomDom"><view class="redpacket_history">历史红包</view></view>
    </view>
</template>
<script>
    import loadingState from "@/common/components/loading/loading.vue";
    import {getPartNumber, checkPaginationHasMore} from '@/utils/common.js'
    import goodsHandler from '@/views/components/goods/handler';
    export default {
        components: {
            loadingState
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
                helpTipsCon:'', //使用帮助内容
                totalAmout:'', //可用红包总额
                redpacketList:[], //红包列表
                useState:1, //查询红包的状态 1-可用 2-不可用
                loadingState:'first_loading',
                showNoMoreDataTips:true //数据加载完是否显示’数据加载完毕~‘。超过一屏才显示
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
        async mounted(){
            this.getRedpacketList()
            // this.getHelpTips();
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
                goodsHandler.getMyRedpacketList(param).then(res => {
                    if (res.state == 200) {
                        this.totalAmout = res.data?.amount
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
            //去红包历史记录页面
            goRedpacketHistory() {
                this.$Router.push('/views/coupon/redpacket-history')
            },
            // 显示使用帮助
            goRules(){
                this.$Router.push('/views/coupon/redpacket-rules')
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
                    isHistory:false
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
    .my_redpacket_conBox {
        height: 100%;
        display: flex;
        flex-direction: column;
        overflow: auto;
        padding: 156rpx 0 calc(88rpx + var(--safe-area-inset-bottom)) 0; 
    }
    .my_redpacket_content{
        height: 100%;
    }
    .my_redpacket {
        width: 750rpx;
        height: 100%;
        margin: 0 auto;
        .fixedTop {
            position: fixed;
            top: var(--bar-height);
            z-index: 100;
            width: 750rpx;
            box-sizing: border-box;
        }
        .total_amout {
            position: relative;
            padding: 20rpx 0 24rpx 0;
            height: 156rpx;
            font-size: 28rpx;
            background: #fff;
            color: #222222;
            .title {
                padding: 12rpx 8rpx 0 0;
            }
            .amout {
                color: #f30300;
                font-size: 28rpx;
                .big_amout {
                    font-size: 56rpx;
                }
                .small_amout {
                    font-size: 40rpx;
                }
            }
            .rules {
                position: absolute;
                top: 20rpx;
                right: 0;
                width: 136rpx;
                height: 52rpx;
                background:url('https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/decorate/redpacket/icon_cj_dzp_guize@2x.png') center center/100% 100% no-repeat;
            }
        }

        .my_redpacket_list {
            display: flex;
            flex-direction: column;
            padding: 0 32rpx;
            overflow-y: scroll;
            .my_redpacket_con {
                width: 100%;
                height: 190rpx;
                margin-top: 32rpx;
                position: relative;
                background:url('https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/decorate/redpacket/bg_wode_hongbao.png') center center/100% 100% no-repeat;
                .left {
                    width: 232rpx;
                    padding: 0 0 0 12rpx;
                    height: 100%;
                    flex-shrink: 0;
                    .price_box {
                        padding: 0 10rpx;
                        font-size: 28rpx;
                        color: #f30300;
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
                    padding: 0 40rpx 0 52rpx;
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
            }
        }
        
        .fixed_bottom{
            display: flex;
            align-items: center;
            justify-content: center;
            background: #FFFFFF;
            position: fixed;
            bottom: 0;
            z-index: 100;
            width: 750rpx;
            height: calc(88rpx + var(--safe-area-inset-bottom));
            padding-bottom: var(--safe-area-inset-bottom);
            box-sizing: border-box;
            .redpacket_history{
                padding: 0 28rpx;
                line-height: 42rpx;
                font-size: 30rpx;
                text-align: center;
                font-weight: bold;
                transform: translateX(-14px);
                color: #f30300;
                background:url('https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/common/icon/btn_common_rightarrow_red.svg') right center no-repeat;
                background-size: 20rpx 20rpx;
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
        }
    }
    .loadingState{
        padding-bottom: calc(100rpx + var(--safe-area-inset-bottom));
    }
    .helpTips_box{
        width: 590rpx;
        height: 100%;
        position: relative;
        padding-bottom: 40rpx;
        border-radius: 32rpx;
        border: 8rpx solid #e0aa7b;
        background: #ffffff;
        .scrollY{
            min-height: 232rpx;
            max-height: 552rpx;
            white-space: pre-wrap;
        }
        .helpTips_con{
            width: 100%;
            line-height: 40rpx;
            margin: 28rpx 0 40rpx 0;
            overflow-y: scroll;
            padding: 0 40rpx;
            flex: 1;
            font-size: 28rpx;
            color: #222222;
            .noScroll{
                white-space: pre-wrap;
            }
        }
        .helpTips_title{
            width: 272rpx;
            height: 64rpx;
            margin-top: -20rpx;
            background: url("https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/coupon/icon_yhq_help.png") no-repeat;
            background-size: 100% 100%;
        }
        .close{
            width: 100%;
            height: 80rpx;
            padding: 0 40rpx;
            view{
                width: 100%;
                height: 100%;
                border: 2rpx solid #c2c2c2;
                border-radius: 40rpx;
                font-size: 30rpx;
                color: #222222;
                font-weight: bold;

            }
        }
    }
</style>