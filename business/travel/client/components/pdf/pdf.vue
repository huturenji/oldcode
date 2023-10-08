<template>
    <div v-if="show" class="pdf-view"> 
        <iframe v-if="!!pdfSrc" :src="wholeSrc" class="iframe_dom" :style="iframeStyle" frameborder="0" @load="initAppBackFun"></iframe>
        <div v-else>找不到文件</div>
    </div>
</template>

<script>

export default {
    name:'pdf-view-comp-old',
    components:{},
    computed:{
        iframeStyle(){
            return this.styleObj;
        },

        wholeSrc(){
            let pdfViewerUrl = this.pdfViewerUrl;
            let symble = pdfViewerUrl.indexOf('?')>-1 ? '&' : '?';
            let pdfUrl = pdfViewerUrl + symble + 'file=' + encodeURIComponent(this.pdfSrc) + "&sswbv_multipage=false&t=" + new Date().getTime();
            return pdfUrl;
        }
    },
    props:{
        pdfSrc:{ //预览的地址src
            type: String,
            required: true,
            default:''
        },
        show:{ //是否显示pdf组件iframe
            type:Boolean,
            default:true
        },
        styleObj:{ //自定义iframe的样式
            type: Object,
            default(){
                return {
                    width: '100%',
                    height: '100%'
                }
            }
        },
        pdfViewerUrl: {
            type: String
        }
    },
    mounted(){
        
    },
    methods:{
        //兼容ios上涉及iframe回退的问题
        initAppBackFun(){
            this.$emit('initAppBackFun');
        }
    }
}
</script>

<style scoped lang="less">
.pdf-view{
    width: 100%;
    height: 100%;
    overflow: hidden;
    .iframe_dom{
        width: 100%;
        height: 100%;
    }
}
</style>
