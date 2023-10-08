<template>
    <view class="container">
        <view class="remarks">
            <view class="input_part">
                <u--textarea v-model="remarks" placeholder="请输入备注" count maxlength="200" autoHeight border="none"></u--textarea>
            </view>
        </view>
        
        <view class="btn_wrap">
            <u-button class="btn" @click="updateMark" text="提交备注" :disabled="checkMark()" color="#ff711e" shape="circle"></u-button>
        </view>
    </view>
</template>

<script>
import { isEmpty, trimAllStr } from '@/utils/common';
import shopHandler from '@/views/shop/handler';
export default {
    mixins: [],
    data() {
        return {
            couponMemberId: '',
            remarks: ''
        };
    },
    components: {
    },
    // 设置当前页面分享到朋友
    onShareAppMessage(option) {
        
    },
    computed:{
      
    },

    watch:{
       
    },
 
    created() {
        this.couponMemberId = this.$Route.query.couponMemberId || ''
        this.remarks = this.$Route.query.remarks || ''
    },
    onHide(){
    },
 
    methods: {
        checkMark(){
            return isEmpty(trimAllStr(this.remarks))
        },
        updateMark(){
            if(this.checkMark()){
                uni.showToast({
                    icon: 'none',
                    title: '核销备注不能为空'
                })
                return
            }

            if(isEmpty(this.couponMemberId)){
                uni.showToast({
                    icon: 'none',
                    title: '会员消费券ID不能为空'
                })
                return
            }

            let params = {
                couponMemberId: this.couponMemberId,
                remarks: this.remarks
            }
            uni.showLoading({
                title: '加载中',
                mask: true
            })
            shopHandler.updateRemarks(params).then(res => {
                if(res.state == 200){
                    this.$Router.back();
                } else {
                    uni.showToast({
                        icon: 'none',
                        title: res.msg
                    })
                }
            }).catch(e => {
                console.log(e);
            }).finally(() => {
                uni.hideLoading()
                this.loading = false;
            })

        }
    }
}
</script>

<style lang="scss" scoped>
page{
    background-color: #fff;
}
.btn_wrap{
    margin-top: 120rpx;
    padding: 0 40rpx;
    display: flex;
    justify-content: space-between;
    .btn{
        flex: 1;
        height: 88rpx;
        font-size: 30rpx;
        font-weight: 600;
    }
}
.remarks{
    padding: 40rpx 40rpx 0 40rpx;
    .input_part{
        background-color: #eff2f5;
        border-radius: 20rpx;
        ::v-deep .u-textarea{
            font-size: 28rpx;
            background-color: #eff2f5;
            border-radius: 20rpx;
            min-height: 250rpx;
            padding: 20rpx 28rpx;
            padding-bottom: 80rpx;
            .u-textarea__count{
                background-color: #eff2f5 !important;
                right: 34rpx;
                bottom: 24rpx;
                font-size: 28rpx;
            }
            .uni-textarea-textarea{
                min-height: 200rpx;
            }
            .uni-textarea-wrapper{
                min-height: 30px !important;
            }
        }
    }
}
</style>
