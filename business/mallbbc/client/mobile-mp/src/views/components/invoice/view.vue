<template>
<view class="viewInvoice_container">
    <!-- 预览发票的弹窗 -->
    <view class="view_invoice_popup">
        <iframe :src="pdfUrl" :style="iframeStyle" class="iframe_dom" frameborder="0"></iframe>
    </view>


</view>
</template>
 
<script>

export default {
    components:{

    },
    data() {
        return {
            iframeStyle:{
                width: '100%',
                height: '100%'
            }
        };
    },
    props: {
        pdfUrl:{
            type: String,
            required: true,
            default: ''
        }
    },
    created() {
    },
    methods: {

    }
}
</script>

<style lang='scss'>
.view_invoice_popup{
    position: fixed;
    display: none;
    top: 0;
}
</style>
