<template>
    <view class="address-parse-area">
        <view class='block'>
            <textarea placeholder="粘贴地址信息，可自动识别并填写" v-model='value' placeholder-class="placeholder"></textarea>
            <view class='btn-group'>
                <view class='btn link-btn icon-btn' @click='clear' :class='isEmpty&&"hidden"'>清空</view>
                <view class='btn ghost-btn' @click='analyse' :class='isEmpty&&"hidden"'>识别</view>
            </view>
        </view>
    </view>
</template>

<script>
import addressHandler from '@/components/address/handler';
export default {
    // name:'address-parse-area',
    data(){
        return {
            value: ''
        }
    },
    computed: {
        isEmpty(){
            return this.value==null || typeof this.value == "undefined" || this.value==''
        }
    },
    methods:{
        clear(){
            this.value = ''
        },
        analyse(){
            addressHandler.addressParsing({
                supplierId: "1",
                addressInfo: this.value
            }).then(res=>{
                if (res.state == 200){
                    res.data.districtCode = res.data.countyCode
                    this.$emit('analyse', (res||{}).data)
                    this.clear()
                } else {
                    this.clear()
                    this.$api.msg('智能识别失败');
                }
            })
            // const res = {
            //     result:{
            //         nation: "中国",
            //         province: "湖北",
            //         city: "武汉市",
            //         county: "江夏区",
            //         town: "佛祖岭街道",
            //         name: "",
            //         phone: "",
            //         exactAddress: "",
            //         nationCode: 4744,
            //         provinceCode: 17,
            //         cityCode: 1381,
            //         districtCode: 50713,
            //         townCode: 62970
            //     }
            // }

            // this.$emit('analyse', (res||{}).result)
            // this.clear()

        }
    }

}
</script>

<style lang="scss">

.address-parse-area{
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    .block{
        background: rgb(246, 249, 253);
        padding: 24rpx 20rpx 30rpx;
    }

    textarea{
        width: 100%;
        height: 150rpx;
        font-size: 30rpx;
        color: #333;
        font-weight: 600;

    }

    .btn-group{
        display: flex;
        justify-content: flex-end;   
        line-height: 56rpx;
        font-size: 28rpx;
        padding: 0 10rpx;

        .btn{
            margin-left: 30rpx;
            color:var(--tagColor);
            &.hidden{
                visibility: hidden;
            }
        }

        .ghost-btn{
            border: 1px solid var(--tagColor);
            border-radius: 28rpx;
            width: 160rpx;
            text-align: center;
        }

        .link-btn{
            color:var(--tagColor);
            background: transparent;
        }
    }
}
</style>
