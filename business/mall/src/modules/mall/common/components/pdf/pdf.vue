<template>
    <div class="pdf-view" id="pdfView"> 
        
    </div>
</template>

<script>
import Pdfh5 from "pdfh5";
import extendUtils from 'common/lib/utils'
export default {
    name:'pdf-view-comp-new',
    components:{},
    computed:{
       
    },
    props:{
        pdfSrc:{ //预览的地址src
            type: String,
            required: true,
        },
    },
    data(){
        return {
            pdfh5: null,
        }
    },

    watch:{
    },
    mounted(){
        //兼容动画的缓冲时间
        setTimeout(()=>{
            this.initPdf(this.pdfSrc);
        },200)
    },
    methods:{
        initPdf(pdfSrc){
            let that = this;
            //实例化
            this.pdfh5 = new Pdfh5('#pdfView', {
                pdfurl: pdfSrc,
                renderType: 'canvas',
                scrollEnable: true,
                tapZoomFactor: 2,
            });

            // this.pdfh5.on("complete", function (status, msg, time) {
            //     console.log("状态：" + status + "，信息：" + msg + "，耗时：" + time + "毫秒，总页数：" + this.totalNum)
            // })
        }
    }

}
</script>

<style lang="less">
@import '~themes/default/styles/pdf/pdfh5.css';
.pdf-view{
    width: 100%;
    height: 100%;
    overflow-x: hidden;
    overflow-y: auto;
    -webkit-overflow-scrolling : touch;
}
</style>
