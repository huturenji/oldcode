<template>
    <div class="tab">
        <div class="orderSuc">
            <div class="topWrap">
                <div class="top">
                    <Icon type='icon_common_success' size='1.16' class='icon'/>
                    <div class="tit">提交成功！</div>
                    <div class="mt10">等待确认</div>
                    <div class="text">稍后您将收到酒店确认短信</div>
                </div>
            </div>
        </div>
        <div class='btn-group'>
            <SnButton type="primary" class="submit_btn normal-btn cursorp" @click.native="toOrderDetail()">查看订单</SnButton>
            <div class="rightTips icon-btn cursorp" @click="toTripList"> 我的行程 </div>
        </div>
    </div>
</template>

<script>
import hotelHandler from 'hotelHandler/hotelHandler.js'
const Icon = ()=>import('components/icon');
const SnButton = ()=>import('components/button');
export default {
    components: {
        Icon,
        SnButton
    },
    props: ['orderNo'],
    methods: {
        /**
         * 前往订单详情
         */
        toOrderDetail() {
            hotelHandler.hotelOpenPage('order/index.html#/detail/hotel?pageFrom=cash&orderNo='+this.orderNo);
        },
        /**
         * 前往我的行程
         */
        toTripList() {
            hotelHandler.hotelOpenPage('trip/index.html#/')
        }
    }
}
</script>
<style scoped lang="less">
@import '~styles/core/common.less';

.orderSuc {
    .topWrap {
        background: #fff;

        .top {
            padding-top: .54rem;
            text-align: center;
            color: @text-color;
            font-size: 0.32rem;

            .icon{
                fill: @success-color;
            }

            .tit {
                color: @success-color;
                font-size: 0.32rem;
                margin: .08rem 0 0.2rem;
                font-weight: bold;
            }

            .text {
                color: @placeholder-color;
                margin-top: 0.08rem;
                font-size: 0.24rem;
            }
            
            .mt10 {
                font-size: 0.3rem;
            }
        }
    }
}

.tab {
    background-color: #fff;
    margin-bottom: .2rem;
}

.btn-group {
    margin: .6rem .3rem 0;
}

.rightTips {
    padding: 0.3rem 0 .4rem;
    font-size: 0.28rem;
    color: @theme-color;
    text-align: right;
}

</style>
