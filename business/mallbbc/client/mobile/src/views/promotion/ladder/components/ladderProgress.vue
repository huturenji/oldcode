<template>
    <view class="program" >
            <view v-for="(item, index) in ladderInfo.ruleList" :key="index" class="p_item">
                <view class="p_tem_main">
                    <view class="p_item_top">
                        <view :class="'ladder_jt_price1 ' + ((ladderInfo.currentLadderLevel==index+1)?'on1':'')">
                            <text>￥</text>
                            <text>{{$getPartNumber(item.ladderPrice,'int')}}</text>
                            <text>{{$getPartNumber(item.ladderPrice,'decimal')}}</text>
                        </view>
                        <text :class="'ladder_num1 ' + ((ladderInfo.currentLadderLevel==index+1)?'on2':'')">{{$L('满')}}{{item.joinGroupNum}}{{$L('人参团')}}</text>
                    </view>
                    <view :class="'p_item_bottom ' + ((ladderInfo.currentLadderLevel==index+1)?'on':'')">
                        <view class="p_line">
                            <text>{{index+1}}</text>
                            <view class="p_line_left_wrap">
                                <view class="p_line_left" :style="'width: ' + ((ladderInfo.currentLadderLevel==index+1)?100:0) + '%'"></view>
                            </view>
                            <view class="p_line_right_wrap">
                                <view class="p_line_left" :style="'width: ' + ((ladderInfo.currentLadderLevel==index+1)?100:0) + '%'"></view>
                            </view>
                        </view>
                        <view class="p_item_txt">{{$L('阶梯')}}{{item.ladderLevel}}</view>
                    </view>
                </view>
            </view>
    </view>
</template>

<script>
export default {
    props:['ladderInfo']
}
</script>

<style lang="scss">
    /* 阶梯团活动进程start */
    .program {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 223rpx;
        padding: 0 54rpx;
        background-color: #fff;
        .p_prev,
        .p_next {
            margin: 0 15rpx;
            transform: translateY(28rpx);
        }
        .p_img {
            width: 19rpx;
            height: 31rpx;
        }
        .p_content {
            flex: 1;
            display: block;
            overflow: hidden;
            white-space: nowrap;
    
        }
        .p_item {
            display: inline-block;
            padding: 0 20rpx;
            font-size: 24rpx;
            color: #808080;
        }
        .p_tem_main {
            display: flex;
            flex-direction: column;
            align-items: center;
        }
        .p_item_top {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: space-around;
            width: 177rpx;
            height: 76rpx;
            margin-bottom: 15rpx;
            border: 3rpx solid transparent;
            .ladder_jt_price1 {
                font-size: 20rpx;
                line-height: 20rpx;
            }
            text:nth-of-type(2) {
                font-size: 24rpx;
            }
            .ladder_num1 {
                font-size: 28rpx;
                line-height: 28rpx;
            }
            .on1 {
                font-size: 20rpx;
                
                font-weight: 500;
                color: #FB2D2D;
                line-height: 20rpx;
            }
            .on2 {
                font-size: 28rpx;
                
                font-weight: 500;
                color: #333333;
                line-height: 28rpx;
            }
        }
        .p_item_bottom {
            display: flex;
            flex-direction: column;
            align-items: center;
            .p_line {
                position: relative;
                text {
                    display: block;
                    width: 40rpx;
                    height: 40rpx;
                    font-size: 28rpx;
                    line-height: 40rpx;
                    text-align: center;
                    border-radius: 50%;
                    overflow: hidden;
                    background-color: #d1d1d1;
                    color: #fff;
                }
                .p_line_left_wrap,
                .p_line_right_wrap {
                    position: absolute;
                    top: 50%;
                    width: 95rpx;
                    height: 2rpx;
                    background-color: #d1d1d1;
                    transform: translateY(-50%);
                }
                .p_line_left_wrap {
                    right: 40rpx;
                }
    
                .p_line_right_wrap {
                    left: 40rpx;
                }
    
                .p_line_left {
                    width: 0;
                    height: 2rpx;
                    background: linear-gradient(90deg, #FFAA06 0%, #FF5C00 0%, #FF561C 0%, #FF9936 100%);
                }
            }
            &.on .p_line text {
                background-color: #FD8D01;
            }
            &.on .p_item_txt {
                color: #ed6307;
            }
        }
    }
    /* 阶梯团活动end */
</style>
