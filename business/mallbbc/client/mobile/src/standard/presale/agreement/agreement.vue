//用户隐私协议页面
<template>
<view class="container_pri">
    <!-- #ifdef APP-PLUS  -->
<rich-text :nodes="html"></rich-text>
<!-- #endif -->

    <!-- #ifndef APP-PLUS  -->
<rich-text :nodes="h5_wx_html"></rich-text>
<!-- #endif -->
</view>
</template>

<script>


export default {
    data() {
        return {
            type: '',
            // banance: 余额   points: 云豆
            key: '',
            imgUrl: getApp().globalData.imgUrl,
            isLoading: true,
            title: '',
            num: "",
            list: "",
            pn: 1,//当前页
            hasmore: true,
            html:'',
            h5_wx_html:''
        };
    },

    components: {},
    props: {},
    onShow: function () {
        
    },
    mounted(){
        this.getPrivacyPolicy()
    },
    onLoad(){
        //   this.getPrivacyPolicy()
    },
    methods:{
        getPrivacyPolicy(){
            let param = {}
            param.data = {}
            param.data.agreementCode='presell_deposit_agreement'
            param.url = 'v3/system/front/agreement/detail'
            this.$request(param).then(res=>{
                this.h5_wx_html=res.data.content
            })
        }
    }
};
</script>
<style>
    page{
        width: 750rpx;
        margin: 0 auto;
    }
.container_pri{
    width: 90%;
    height: 100vh;
    margin: 0 auto;
}
p{
    margin-top: 20px;
}
</style>
