<template>
    <view class="container">
        <u-navbar title="云豆" autoBack :bgColor="bgColor">
        </u-navbar>
        <view class="integral_content">
            <view class="integral_top">
                <view class="total_num_box">
                    <view class="title">我的云豆</view>
                    <view class="num num-font">{{my_points}}</view>
                </view>
                <view @click="goIntegralRules" class="rules_entry"></view>
                <view class="fudai"></view>
            </view>
            <view class="integral_title flex_row_start_center">云豆明细</view>
            <view class="integral_main">
                <scroll-view class="my_integral_content" @scrolltolower='getMoreData' scroll-y>
                    <view class="integral_item_wrap" v-if="info_list && info_list.length>0">
                        <view class="integral_item flex_row_between_center" v-for="(item,index) in info_list" :key="index">
                            <view class="left">
                                <view class="integral_item_content">{{item.description}}</view>
                                <view class="order_sn common" v-if="item.refCode">订单 {{item.refCode}}</view>
                                <view class="integral_item_date common">{{item.createTime}}</view>
                            </view>
                            <view class="right" :class="{subtract_Integral:item.state==0}">
                                <text>{{item.state==1? '+':'-'}}<text class="num-font">{{item.value}}</text></text>
                            </view>
                        </view>
                    </view>
                    <loadingState :state='loadingState' v-if="!is_show_empty" />
                    <view class="empty_page" v-if="is_show_empty">
                        <view class="empty_img"></view>
                        <view class="empty_text">暂无数据</view>
                    </view>
                </scroll-view> 
            </view>
        </view>
        
    </view>
</template>

<script>
import loadingState from "@/common/components/loading/loading.vue";
import personalHandler from "@/views/components/personal/handler";
import { checkPaginationHasMore } from '@/utils/common';
export default {
    components: {
        loadingState
    },
    data() {
        return {
            is_default: true, //是否默认选择收入
            my_points: '', //我的云豆
            info_list: [], //收支列表
            current: 1,
            pageSize: 10,
            loadingState: 'first_loading',
            is_show_empty: false,
            hasMore: false,
            scrollFlag:false,
            bgColor: 'transparent'
        }
    },
    onPageScroll({scrollTop}) {
        if(scrollTop > 3){
            let opacity = scrollTop / 100;
            opacity = opacity > 1 ? 1 : opacity;
            this.bgColor = `rgba(255, 255, 255, ${opacity})`;
        }else{
            this.bgColor = 'transparent';
        }
    },
    mounted(){
        this.getUserPoints()
        this.getPointsList()
    },
    methods: {
        //页面触底事件
        getMoreData() {       
            if (this.hasMore) {
                this.getPointsList();
            }
        },
        // 去积分规则页面
        goIntegralRules() {
            this.$Router.push('/views/user/myIntegralRules')
        },
        // 获取总积分
        getUserPoints() {
            let param = {}
            personalHandler.getMemberIntegral(param).then(res => {
                if (res.state == 200) {
                    this.my_points = res.data.memberIntegral
                }
            })
        },
        // 获取积分列表
        getPointsList() {
            let param = {}
            param = {
                current: this.current,
                pageSize: this.pageSize
            }
            this.loadingState = this.loadingState == 'first_loading' ? this.loadingState : 'loading';
            personalHandler.getMemberIntegralList(param).then(res => {
                if (res.state == 200) {
                    if (this.current == 1) {
                        this.info_list = res.data.list
                    } else {
                        this.info_list = this.info_list.concat(res.data.list);
                    }
                    if (this.loadingState == 'first_loading') {
                        this.loadingState = ''
                    }
                    this.hasMore = checkPaginationHasMore(res.data.pagination); //是否还有数据
                    if (this.hasMore) {
                        this.current++;
                        this.loadingState = 'allow_loading_more';
                    } else {
                        this.loadingState = 'no_more_data';
                    }
                    if (this.info_list.length == 0) {
                        this.is_show_empty = true;
                        // this.$forceUpdate();
                    } else {
                        this.is_show_empty = false;
                    }
                } else {
                    this.loadingState = '';
                    uni.showToast({
                        title:res.msg,
                        icon:'none'
                    })
                }
            })
        }
    }
}
</script>

<style lang="scss">
    .container {
        width: 750rpx;
        padding: 0 30rpx;
        overflow-x: hidden;
        background: url("https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/yundou/bg_dabeijing.png") left top/100% 486rpx no-repeat;
        .integral_content {
            height: 100vh;
            padding-top: 200rpx;
        }
        .integral_top {
            height: 238rpx;
            border-radius: 24rpx;
            background: linear-gradient(135deg,#FFCB86,#FF5525);
            position: relative;
            .total_num_box {
                width: fit-content;
                padding: 52rpx 0 0 38rpx;
                color: #FFF4E6;
                .title {
                    line-height: 40rpx;
                    font-size: 28rpx;
                    font-weight: bold;
                }
                .num {
                    line-height: 100rpx;
                    font-size: 84rpx;
                }
            }
            .rules_entry {
                position: absolute;
                top: 26rpx;
                right: 0;
                width: 132rpx;
                height: 44rpx;
                background: url("https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/yundou/bg_xq_yundouguize.png") center/100% 100% no-repeat;
            }
            .fudai {
                position: absolute;
                top: 70rpx;
                right: 80rpx;
                width: 224rpx;
                height: 160rpx;
                background: url("https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/yundou/fudai.png") center/100% 100% no-repeat;
            }

        }
        .integral_title {
            margin-top: 30rpx;
            line-height: 44rpx;
            font-size: 32rpx;
            font-weight: bold;
            color: #000;
            &::before {
                content: '';
                display: block;
                width: 10rpx;
                height: 32rpx;
                margin-right: 16rpx;
                background: #ff864e;
                border-radius: 10rpx;
            }
        }

        .integral_main {
            .my_integral_content {
                height: 100%;
            }
            .integral_item_wrap {
                box-sizing: border-box;

                .integral_item {
                    margin-top: 20rpx;
                    padding: 26rpx 30rpx 28rpx 30rpx;
                    border-radius: 20rpx;
                    background: #fff;
                    .integral_item_content {
                        font-size: 28rpx;
                        font-weight: bold;
                        word-break: break-all;
                        color: #000;
                    }

                    .integral_item_date {
                        font-size: 28rpx;
                        color: #999;
                        margin-top: 10rpx;
                    }
                    .common {
                        margin-top: 6rpx;
                        line-height: 34rpx;
                        font-size: 24rpx;
                        color: #999999;
                    }
                    .right {
                        padding-left: 42rpx;
                        font-size: 38rpx;
                        color: #f30300;
                        background: url("https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/yundou/icon_douzi.png") left center/36rpx 36rpx no-repeat;
                        &.subtract_Integral {
                            color: #666666;
                        }
                    }
                }
            }

            .integral_item_wrap>view:nth-last-child(1) {
                border-bottom: none;
            }
        }
    }

    .empty_page {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        margin-top: 150rpx;

        .empty_img {
            width: 256rpx;
            height: 256rpx;
            margin-bottom: 20rpx;
            background: url('https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/empty/icon_defpage_zwnr.png') center no-repeat;
            background-size: 100% 100%;
        }

        .empty_text {
            font-size: 28rpx;
            color: $main-third-color;
        }
    }
</style>
