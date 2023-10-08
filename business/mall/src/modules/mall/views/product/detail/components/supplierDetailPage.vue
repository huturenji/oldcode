<template>
    <div v-if="!!sku" class="supplier_detail_page">
        <template>
            <div class="title-box">
                <AddressTitle title="瞧瞧京东价" :showBottomBorder='false' :showCloseIcon="false"></AddressTitle>
            </div>
        </template>
        <template>
            <div class="jd_page_iframe">
                <div class="iframe_wrap">
                    <iframe sandbox="allow-scripts" scrolling="no"  :src="jdUrl()"></iframe>
                </div>
            </div>
        </template>
    </div>
</template>
<script>
import Icon from 'common/components/base/Icon';
import AddressTitle from 'common/components/base/AddressTitle.vue';
export default {
    name: 'supplierDetailPage',
    components:{
        AddressTitle,
        Icon
    },
    props:{
        //供应商页面的商品详情页
        sku:{
            type: String | Number,
            required: true,
        }
    },
    computed:{
    },
    methods:{
        jdUrl(){
            return `https://item.m.jd.com/product/${this.sku}.html`
        }

    }
}
</script>
<style scoped lang="less">
@import '~themes/default/styles/common/variable.less';
@import '~mallStyles/mixins/mixinsStyle.less';
.supplier_detail_page{
    width: 320px;
    position: relative;
    border-radius: .2rem;

    .title-box{
        height: .88rem;
        width: 100%;
        border-radius:.2rem .2rem  0 0;
        /deep/.AddressTitle-container{
            border-radius:.2rem .2rem  0 0;
            background: #f6f9fd;
            font-size: .3rem;
            color: @secondary-text-color;
            height: .88rem;
            span{
                font-weight: normal;

            }
        }
    }
    .jd_page_iframe{
        width: 320px;
        height: 350px;
        overflow: hidden;
       
        border-radius:0 0 .2rem .2rem ;
        background: #fff;
        padding-bottom: .2rem;
        .iframe_wrap{
            width: 100%;
            height: 100%;
            overflow: hidden;
            position: relative;
            iframe{
                overflow: hidden;
                display: block;
                position: absolute;
                top: -100px;
                left: 0px;
                bottom: -80px;
                width: 320px;
                height: 510px;
                border-radius:0 0 .2rem .2rem ;
    
            }
        }
    }
}
</style>