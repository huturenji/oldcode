<template>
    <view>
        <w-loading ref="loading"></w-loading>
        <view v-if="requestOk">       
            <view class="box">
                <thumbGiftDetail :goodsInfo='giftInfo[0].orderProductListVOList' :storeName='giftInfo[0].storeName' />
                <button class="share_btn" open-type="share">分享礼单</button>
            </view>
        </view>
    </view>
</template>

<script>
import thumbGiftDetail from '@/views/components/goods/thumb/thumb-gift-detail'
import { getGiftDetail } from '@/views/components/gift/handler'
import shareMixin from '@/common/mixin/share';

export default {
    mixins: [shareMixin],
    components: {
        thumbGiftDetail
    },
    data() {
        return {
            requestOk: false,
             
            giftInfo: [], //商品信息 
            featherId: '' //鹅毛情id
        }
    },
    mounted() {
    },
    onReady(){
       
    },
    onLoad() {
        this.featherId = this.$Route.query.featherId;
        this.cardIndex = this.$Route.query.cardIndex;
        this.getGiftInfo()
    },
    // 设置当前页面分享到朋友
    onShareAppMessage(option) {
        let shareMessage = {
            path: `/views/gift/receive/index?featherId=${this.featherId}&cardIndex=${this.cardIndex}`,
            imageUrl: `https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/card/${this.cardIndex}/share.png`
        }
        // 全局混入share.js
        let share = this.setShareAppMessage(shareMessage)
         
        return share;
    },
    computed: {},
    methods: {
        //获取鹅毛情礼物
        getGiftInfo() {
            let params = {}
            params.featherId = this.featherId
            this.$refs?.loading?.open();
            getGiftDetail(params).then(res => {
                if (res.state == 200) {
                    this.giftInfo = res.data?.orderDetailVOs[0]?.childOrdersVOS || [];
                } else {
                    this.requestOk = false;
                    uni.showToast({
                        title: res.msg,
                        icon: 'none'
                    })
                }
            }).catch(e => {
                console.log(e);
            }).finally( e=> {
                this.requestOk = true;
                this.$refs?.loading?.close();
            })
        }, 
    }
}
</script>

<style scoped lang="scss">
.box {
    width: 100vw;
    padding: 30px 20px 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    font-size: 0;

    .share_btn {
        width: 100%;
        margin-top: 80rpx;
        padding: 0 54rpx;
        height: 80rpx;
        line-height: 80rpx;
        text-align: center;
        color: #fff;
        border-radius: 44rpx;
        background: #f30300;
        font-size: 30rpx;
    }

    ::v-deep .imageWrap {
        background-color: #fff;
        padding: 24px 24px 0;
        border-radius: 18rpx 18rpx 0 0;
        height: 600rpx;
    }

    ::v-deep .nameWrap {
        background-color: rgba($color: #ffffff, $alpha: 0.66);
        backdrop-filter: blur(12px);
        border-radius: 0 0 18rpx 18rpx;
        color: #222;
        font-size: 30rpx;
        padding: 32rpx;

        .name {
            font-weight: bold;
        }

        .desc {
            display: flex;
            align-items: flex-start;
            justify-content: space-between;

            .spec {
                width: 400rpx;
                line-height: 22px;
                text-overflow: ellipsis;
                overflow: hidden;
                white-space: nowrap;
            }

            .num {
                height: 22px;
                line-height: 22px;
                width: 80px;
                margin-left: 10px;
            }
        }
    }
}
</style>


