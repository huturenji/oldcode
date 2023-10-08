<template>
    <div v-if="show" class="pdf-view"> 
        <iframe v-if="!!pdfSrc" :src="wholeSrc" class="iframe_dom" :style="iframeStyle" frameborder="0"></iframe>
        <div v-else>传递的预览的pdfSrc为空</div>
    </div>
</template>

<script>
import extendUtils from 'common/lib/utils'
export default {
    name:'pdf-view-comp-old',
    components:{},
    computed:{
        iframeStyle(){
            return this.styleObj;
        },

        wholeSrc(){
            let viewerHtmlUrl = this.getPdfViewer();
            let symble = viewerHtmlUrl.indexOf('?')>-1 ? '&' : '?';
            let pdfUrl = viewerHtmlUrl + symble + 'file=' + encodeURIComponent(this.pdfSrc) + "&sswbv_multipage=false";
            return pdfUrl;
        }
    },
    props:{
        pdfSrc:{ //预览的地址src
            type: String,
            required: true,
            default:'',
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
                    height: '100%',
                }
            }
        }
    },
    data(){
        return {

        }
    },

    watch:{
       
    },
    mounted(){
        extendUtils.removeStorage('pdfjs.history');//清除pdfjs的缓存，否则下次进来会记住上一次的滚动条高度
    },
    methods:{
        /**
         * 获取预览pdf的服务器地址（即viewer.html）
         */
        getPdfViewer(){
            return './thirdparty/pdfView/web/viewer.html?t='+new Date().getTime();
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
