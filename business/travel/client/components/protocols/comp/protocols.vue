<template>
  <div class="protocols-container">
    <div v-if="protocolsList.length > 0"  class="agreement">点击提交订单表示您已阅读并同意<i @click="viewProtocol(item, index)" v-for="(item, index) in protocolsList" :key="index" >《{{item.protocolName}}》</i></div>
    <div v-transfer-dom>
        <popup v-if='selectedProtocol' v-model="showPdfView" class="view-pop" height="100%" width="100%" :popup-style='{zIndex: 5001}' position="right" cust-style>
            <pdf v-if="!selectedProtocol.protocolContent && !!selectedProtocol.protocolUrl" :pdfViewerUrl='pdfViewerHtmlUrl' :pdfSrc="selectedProtocol.protocolUrl" v-on="$listeners" />
            <div v-else v-html='selectedProtocol.protocolContent'></div>
        </popup>
    </div>
  </div>
</template>
<script>
import { TransferDom, Popup } from 'vux';
import protocolsHandler from '../js/protocolsHandler.js';
import pdf from 'components/pdf/pdf.vue';
export default {
    directives: {
        TransferDom
    },
    components: {
        Popup,
        pdf
    },
    data: function () {
        let that = this;
        let managerData = protocolsHandler.stateManager.setData([
            //人员编辑界面
            {
                name: 'showPdfView',
                parent:'$refs.protocolComp',
                hide:{
                    title: '编辑订单',
                    callback(){}
                },
                show:{
                    callback(){
                        document.title = that.titleName || '商旅服务协议';
                    }
                }
            }
     
        ]);
        return Object.assign(managerData,{
            protocolsList: [], //配置的协议的list
            selectedProtocol:null,
            titleName:'' //需要显示的titleName
        });
    },
       
      
    created: function () {
        this.getAppProtocols(); //获取运营渠道管理配置的下单页需要用的用户协议
    },
    mounted() {
    },
    computed: {
        pdfViewerHtmlUrl(){ //pdfViewer的html页面
            let url = protocolsHandler.AUTH_CONFIG.pdfViewerUrl;
            return url;
        }
    },
    methods: {
        //获取运营渠道管理配置的下单页需要用的用户协议
        getAppProtocols(){
            let that = this;
            let param = {
                channelId: protocolsHandler.channelId
            }
            protocolsHandler.getAppProtocols(param).then(res => {
                //  console.log('res', res)             
                if (res.resultCode == 0){
                    if (res.result.protocolConfigList && res.result.protocolConfigList.length > 0){
                        that.protocolsList = res.result.protocolConfigList;
                    }                
                }
            }).catch(e=>{
                console.log(e)
            })
        },

        //点击预览pdf的显示
        viewProtocol(item){
            this.selectedProtocol = item;
            this.titleName = item.protocolName;
            this.showPdfView = true;
        }

         
    }
}
</script>
<style lang="less">
.vux-popup-dialog.view-pop{
  background: #fff;

    b, strong{
        font-weight: bold;
    }

    i, em{
        font-style: italic;
    }
}
</style>
<style scoped lang="less">
@import '~styles/core/common.less';
@import '~styles/mixins/mixinsStyle.less';
.agreement{
  width: 100%;
  font-size: .26rem;
  color: #999999;
  i{
    font-style: normal;
    color: @theme-color;
    cursor: pointer;
  }
}
</style>

