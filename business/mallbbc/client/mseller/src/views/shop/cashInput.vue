<template>
    <view class="container">
        <view class="title">券码</view>
        <view class="input_part">
            <u--textarea type="text" v-model="code" @input="inputChange" @confirm="getCashDetail" placeholder="请输入券码" autoHeight border="none" :placeholderStyle="placeholderStyle"></u--textarea>
        </view>

        <u-button @click="getCashDetail" class="btn" text="核销券码" color="#FF711E" shape="circle"></u-button>
    </view>
</template>

<script>
import shopHandler from '@/views/shop/handler';
import { isEmpty, trimAllStr } from '@/utils/common';
export default {
    mixins: [],
    data() {
        return {
            code: '',
            shopId: ''
        };
    },
    components: {
    },
    // 设置当前页面分享到朋友
    onShareAppMessage(option) {
        
    },
    computed:{
        placeholderStyle(){
            return{
                fontSize: '52rpx',
                color: '#c2c2c2'
            }
        }
    },

    watch:{
       
    },
 
    created() {
        this.shopId = this.$Route.query.shopId;
    },
    onHide(){
    },
 
    methods: {
        // 检测相关的参数为必填
        checkParams(){
            if(isEmpty(trimAllStr(this.code))){
                uni.showToast({
                    icon: 'none',
                    title: '券码不能为空'
                })
                return false
            }
            return true
        },

        inputChange(e){
            this.code = this.formateNumber(trimAllStr(e))
        },

        // 格式化券码
        formateNumber(s){
            return s.toString().replace(/[0-9a-zA-Z]{4}(?=.)/g, '$& ');
        },

       

        /**
         * 查询消费券详情 通过券码
         */
        getCashDetail(){
            if(!this.checkParams()){ return false }
            let params = {
                couponCode: trimAllStr(this.code)
            }
            uni.showLoading({
                title: '加载中',
                mask: true
            })
            shopHandler.getCashDetail(params).then(res => {
                if(res.state == 200 && res.data.couponCode){
                    this.toCashDetail(res.data.couponCode)
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
            })
        },

        toCashDetail(code){
            this.$Router.push({
                path: '/views/shop/cashDetail',
                query: {
                    code,
                    shopId: this.shopId
                }
            })
        }
    }
}
</script>

<style lang="scss" scoped>
page{
    background-color: #ffffff;
}
.container{
    padding: 32rpx 40rpx;
    .btn{
        margin-top: 196rpx;
        height: 88rpx;
        font-size: 30rpx;
    }
    .input_part{
        margin-top: 28rpx;
        min-height: 164rpx;
        display: flex;
        align-items: center;
        background: #eff2f5;
        border-radius: 16rpx;
        ::v-deep .textarea-placeholder{
            font-size: 52rpx;
            color: #c2c2c2;
        }
        ::v-deep .u-textarea{
            background-color: #eff2f5;
            padding-left: 34rpx;
            color: #222;
        }
        ::v-deep .u-textarea .u-textarea__field{
            font-size: 34rpx;
            color: #222;
        }
    }
    .title{
        font-size: 30rpx;
        font-weight: 600;
    }
}
</style>
