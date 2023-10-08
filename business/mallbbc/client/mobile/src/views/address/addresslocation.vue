<template>
    <view class="section">
        <addressMap @onHitResult='getAddressFromMap'></addressMap>
    </view>
</template>

<script>
import addressMap from '@/components/address/map/index';
import addressHandler from '@/components/address/handler';
export default {
    components: {
        addressMap
    },
    data() {
        return {
                
        };
    },
    methods:{
        getAddressFromMap(mapAddress){
            let fullAddress = mapAddress.district + mapAddress.address + mapAddress.name;
            addressHandler.addressParsing({
                supplierId: "1",  
                addressInfo: fullAddress
            }).then(res=>{
                if (res.state == 200){
                    res.data.districtCode = res.data.countyCode
                    // res.data.districtCode = Number(11111111111)
                    var pages = getCurrentPages(); //当前页面栈
                    if (pages.length > 1) {
                        var beforePage = pages[pages.length - 2]; //获取上一个页面实例对象  
                        beforePage.$vm.onAddressAnalyse((res||{}).data); //触发上个面中的方法 
                    }
                    setTimeout(()=>{
                        this.$Router.back(1)
                    },200)
                } else {
                    this.$api.msg(res.msg);
                }
            })
        }
    }
}
</script>

<style lang="scss">
    page{
        height: 100%;
        background-color: #fff;
    }
    .section{
        width: 100%;
        height: 100%;
    }
</style>
