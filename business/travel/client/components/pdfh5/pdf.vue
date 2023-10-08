<template>
    <div class="pdf-view"> 
        <div v-if="!!pdfSrc" ref='pdfView' class="iframe_dom"></div>
        <div v-else>找不到文件</div>
    </div>
</template>

<script>

import Pdfh5 from "pdfh5";
import "pdfh5/css/pdfh5.css";
export default {
    name:'pdfh5-view-comp',
    components:{},
    computed:{

    },
    data(){
        return {
            pdfH5: null
        }
    },
    watch:{
        pdfSrc:{
            handler(){},
            deep: true,
            immediate: true
        }
    },
    props:{
        pdfSrc:{ //预览的地址src
            type: String,
            required: true,
            default:''
        }
    },
    mounted(){
        !!this.pdfSrc && this.initPdf()
    },
    methods:{
        initPdf(){
            this.$nextTick(()=>{
                this.pdfH5 = new Pdfh5(this.$refs.pdfView, {
                    pdfurl: this.pdfSrc,
                    maxZoom: 2,
                    backTop: false
                });
            })
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
    /deep/ .pdfjs .pdfViewer .pageContainer{
        box-shadow: none;
    }
}
</style>
