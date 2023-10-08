<template>
    <div>
        <DetailTitle titleName="规则参数"></DetailTitle>
        <div class="param-box" v-html="formatedomStr(goodsDetailsObj.param)"></div>
    </div>
</template>
<script>
const DetailTitle = ()=>import('./DetailTitle.vue');
import { SnModal } from 'sinosun-ui';
export default {
    name: 'GoodsIntroduction',
    props:{
        //传递的商品详情
        goodsDetailsObj:{
            type: Object,
            required: true,
            default(){
                return {}
            }
        }
    },
    components:{
        DetailTitle,
        SnModal
    },
    data(){
        return {
            widthNum: 750, //京东返回的大字段是写死的750px;
        }
    },
    created(){},
    mounted(){
        this.initStyle();
    },
    methods:{
        /**
         * 京东返回的大字段是写死的750px，此画布需要用css3的zoom 缩放一下
         */
        initStyle(){
            let oWidth = window.screen.width;
            if(oWidth <= 750){
                let scale = (oWidth / this.widthNum)-0.03;
                let dom = document.getElementsByClassName('intro-box')[0];
                if(dom){
                    dom.style.zoom = scale;
                }
            }

        },
        /**
         * 点击规格参数tips展示提示信息
         */
        formatedomStr(domStr){
            if(''==domStr || !!!domStr){
                return '';
            }
            window.showGoodsDetailTips = function(e){
                let tips = e.querySelector('.tips .content p').innerHTML || '';
                if(''==tips || !!!tips){
                    return '';
                }
                SnModal({
                    message: tips,
                    showCancelButton: false,
                }).then(res => {

                }).catch(rej => {
                    console.log('rej === ', rej);
                });
            }
            return domStr.replace(/class="Ptable-tips"/g,'class="Ptable-tips ptableTips" onclick="showGoodsDetailTips(this)"')
        }
    }
}
</script>
<style scoped lang="less">
.param-box{
    width: 100%;
    /deep/ & > div{
        &:last-of-type{
            margin-bottom: 3rem;
        }
    }
    /deep/ & > img{
        &:last-of-type{
            margin-bottom: 3rem;
        }
    }
	/deep/ .Ptable{
		width: 100%;
		margin-bottom: 10px;
		border-collapse: collapse;
		font-size: 12px;
		border-spacing: 0;
		line-height: 18px;
		td:first-child {
		    width: 90px;
		}
		td:last-child {
		    word-break: break-all;
		}
		th ,td{
		    padding: 8px;
		    border: 1px solid #dadada;
		    text-align: left;
        }
    }
    /deep/ .ptableTips{
        display: inline-block;
        width: 18px;
        height: 18px;
        background: url('~themes/default/img/icon/icon_common_prompt.svg') center no-repeat;
        background-size: 18px 18px;
        vertical-align: middle;
        .tips{
            display:none;
        }
    }

}
</style>