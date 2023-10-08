<template>
    <view class="address-parse-area">
        <view class='block'>
            <u--textarea v-model="value" border="none" placeholder="粘贴地址信息，可自动识别并填写" ></u--textarea>
            <view class='btn-group'>
                <view class='btn link-btn icon-btn' @click='clear' :class='isEmpty&&"hidden"'>清空</view>
                <view class='btn ghost-btn' @click.stop='analyse' :class='isEmpty&&"hidden"'>识别</view>
            </view>
        </view>
    </view>
</template>

<script>
import addressHandler from '@/views/components/address/handler';
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
                    uni.showToast({
                        title:'智能识别失败',
                        icon:'none'
                    });
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

<style lang="scss" scoped>
.address-parse-area{
    z-index: 0;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    position: relative;

    .textarea{
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
            color:#e82b29;
            &.hidden{
                visibility: hidden;
            }
        }

        .ghost-btn{
            border: 1px solid #e82b29;
            border-radius: 28rpx;
            width: 160rpx;
            text-align: center;
        }

        .link-btn{
            color:#e82b29;
            background: transparent;
        }
    }
}
</style>
