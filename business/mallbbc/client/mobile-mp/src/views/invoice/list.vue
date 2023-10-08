<template>
    <view class="invoice_list_container">
        <invoiceCard :showCheck="showCheck" :choosedTitleId="choosedTitleId" @choose="choose" />
    </view>
</template>

<script>
import invoiceCard from "@/views/components/invoice/list.vue";
import { setStorageSync } from '@/utils/common.js'
export default {
    components:{
        invoiceCard
    },
    data() {
        return {
            showCheck: false, //是否需要选择发票
            choosedTitleId:'' //选中额发票id
        }
    },
    computed: {
        
    },
        
    mounted(){
        this.showCheck = this.$Route.query.showCheck == 'showCheck';
        this.choosedTitleId = this.$Route.query.choosedTitleId;
    },
    methods: {
        // 选择的发票，并存缓存
        choose(item){
            setStorageSync('choosedInvoice', item); //将选择的发票存入缓存
            this.$Router.back(1);
        }
    }
}            
</script>

<style lang="scss">
    
</style>
