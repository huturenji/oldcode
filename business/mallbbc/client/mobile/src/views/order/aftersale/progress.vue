<!-- 售后进度详情 -->
<template>
    <view class="container">
        <view class="gap"></view>
        <view class="progress_content">
            <view class="progress_content_item" v-for="(item,index1) in returnLogList" :key="index1">
                <view class="progress_date_wrap">
                    <view class="progress_date">{{formatDate(item.createTime)}}</view>
                    <view class="progress_time">{{formatTime(item.createTime)}}</view>
                </view>
                <view class="circle_icon_wrap">
                    <view v-if="index1 == 0" class="circle_active"></view>
                    <view class="circle_icon" v-else></view>
                    <view class="progress_line"></view>
                </view>
                <view class="progress_text" :class="{progress_text_active:index1 == 0}" v-html="item.content"></view>
            </view>
        </view>
    </view>
</template>

<script>
import {
    mapState
} from 'vuex';
export default {
    data(){
        return {
            to_right:getApp().globalData.imgUrl+'common/icon/icon_common_rightarrow.svg',
            afsSn:'', // 售后单号
            state:'' ,// 退换货状态
            returnLogList:[],
            imgUrl: getApp().globalData.imgUrl
        }
    },
    computed: {
        ...mapState(['userInfo'])
    },
    mounted(){
        this.afsSn = this.$Route.query.afsSn
        this.state = this.$Route.query.state
        this.loadData()
    },
    onLoad(){
        // this.afsSn = this.$Route.query.afsSn
        // this.state = this.$Route.query.state
        // this.loadData()
    },
    methods:{
        // 售后详情
        loadData(){
            let param = {}
            if (this.state == 2){ //换货详情
                param.url = 'v1/front/member/afterSale/replacementDetail'
            } else { // 仅退款、退货退款
                param.url = 'v3/postsale/front/after/sale/detail'
            }
            param.method = 'GET';
            param.data = {};
            param.data.afsSn = this.afsSn;
            this.$request(param).then(res => {
                if (res.state == 200) {
                    this.returnLogList = res.data.returnLogList.reverse();
                } else {
                    this.$api.msg(res.msg);
                }
            }).catch(() => {
                //异常处理
            })
        },
        // 日期时间格式化
        formatDate(val){
            let date = val.split(' ')[0]
            let date1 = date.split('-')[1]
            let date2 = date.split('-')[2]
            return date1+'-'+date2
        },
        formatTime(val){
            let time = val.split(' ')[1]
            return time.split(':')[0]+':'+time.split(':')[1]
        }
    }
}
</script>

<style lang="scss">
.container{
    width: 750rpx;
    margin: 0 auto;
    .gap{
        width:100%;
        height:20rpx;
        background-color:#F8F8F8;
    }
    .progress_content{
        margin-top:20rpx;
        padding-top: 30rpx;
        padding-bottom: 20rpx;
        background-color: #fff;
        .progress_content_item{
            display:flex;
            align-items: flex-start;
            padding-left:30rpx;
            .progress_date_wrap{
                margin-right:10rpx;
                display:flex;
                flex-direction: column;
                align-items: flex-end;
                white-space: nowrap;
                .progress_date{
                    font-weight: 600;
                    font-size:28rpx;
                    color:#949494;
                }
                .progress_time{
                    font-size:22rpx;
                    color:#949494;
                }
            }
            .circle_icon_wrap{
                width:40rpx;
                display: flex;
                flex-direction: column;
                align-items: center;
                margin-right:37rpx;
                .circle_icon{
                    width: 26rpx;
                    height: 26rpx;
                    background: #FFFFFF;
                    border: 2rpx solid var(--radioCheckedColor);
                    border-radius: 50%;
                    // margin-left:6rpx;
                    // margin-right:10rpx;
                }
                .circle_active{
                    width: 42rpx;
                    height: 42rpx;
                    background: var(--selectRadio);
                    background-size: 100% 100%;
                }
                .progress_line{
                    width:1rpx;
                    height:76rpx;
                    background:#DDDDDD;
                }
            }
            .progress_text{
                white-space: pre-wrap;
                font-size:26rpx;
                color:#999999;
                font-weight: 600;
                width: 520rpx;
            }
            .progress_text_active{
                font-size: 28rpx;
                
                font-weight: 500;
                color: #333333;
                line-height: 32rpx;
            }
        }
    }
    .progress_content>view:last-child .progress_line{
        display: none;
    }
}
.big_price{
    font-size:34rpx;
}
.small_price{
    font-size:24rpx;
}
</style>
