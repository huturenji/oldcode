<template>
    <view class="container">
        <view class="top">
            <image src="https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/O2O/icon/btn_common_success.svg" mode="widthFix"></image>
            <view class="text">核销成功</view>
        </view>

        <view class="remarks">
            <view class="title">备注<text>(可选填)</text></view>
            <view class="input_part">
                <u--textarea v-model="remarks" placeholder="请输入备注" count maxlength="200" :adjustPosition="false" autoHeight border="none"></u--textarea>
            </view>
        </view>
        
        <view class="btn_wrap">
            <u-button @click="gotoIndex" text="返回首页" :plain="true" color="#ff711e" shape="circle"></u-button>
            <u-button @click="updateMark" text="提交备注" :disabled="checkMark()" color="#ff711e" shape="circle"></u-button>
        </view>
    </view>
</template>

<script>
import shopHandler from '@/views/shop/handler';
import { isEmpty, trimAllStr } from '@/utils/common';
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
   
    computed:{
      
    },

    watch:{
       
    },
 
    onLoad() {
        this.couponMemberId = this.$Route.query.couponMemberId || ''
        this.remarks = this.$Route.query.remarks || ''
    },
    onHide(){
    },
 
    methods: {
        checkMark(){
            return isEmpty(trimAllStr(this.remarks))
        },
        gotoIndex(){
            uni.reLaunch({
                url: '/views/shop/index'
            });
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
                    this.gotoIndex();
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
<style lang="scss">
page{
    background-color: #fff;
}
</style>

<style lang="scss" scoped>

.top{
    padding-top: 80rpx;
    text-align: center;
    image{
        width: 120rpx;
        height: 120rpx;
    }
    .text{
        margin-top: 24rpx;
        font-size: 36rpx;
        font-weight: 600;
    }
}
.btn_wrap{
    margin-top: 120rpx;
    padding: 0 40rpx;
    display: flex;
    justify-content: space-between;
    ::v-deep .u-button{
        flex: 1;
        height: 88rpx;
        font-size: 30rpx;
        font-weight: 600;
        margin-left: 30rpx;
        &:first-child{
            margin-left: 0;
        }
    }
}
.remarks{
    padding: 0 40rpx;
    margin-top: 56rpx;
    .title{
        font-size: 30rpx;
        font-weight: 600;
        position: relative;
        padding-left: 20rpx;
        &::before{
            content: "";
            position: absolute;
            top: 9rpx;
            left: 0rpx;
            width: 8rpx;
            height: 28rpx;
            background: #ff711e;
        }
        text{
            font-weight: normal;
            color: #999;
            margin-left: 10rpx;
        }
    }
    .input_part{
        margin-top: 20rpx;
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
            .u-textarea__field{
                min-height: 100rpx !important;
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
