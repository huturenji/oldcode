<template>
  <div class="viewInvoicePop">
    <div class="viewBaoxiaoP">
      <div
        class="cursorp"
        :class="{'wuliuInfoImg':(inputData.where==2||inputData.where==3), 'showButton':!(inputData.where==2||inputData.where==3)
        ,'btnNoAble':isbtnNoAble}"
        @click="ifShowDIalog"
      >{{inputData.btnName||btnNameDefault}}</div>
      <div v-if="inputData.where==3" class="line2">
        <span v-if="inputData.orderStatus==1">订单已取消，无法查看报销凭证</span>
        <span v-else-if="isbtnNoAble">旅客离店后1-2个工作日内可查看报销凭证</span>
      </div>
      <div
        class="cursorp"
        :class="(inputData.where==2||inputData.where==3) ? 'dialogShow2':'dialogShow'"
        v-show="showDialog"
        @click="showDialog = false"
      >
        <div v-if="inputData.invoiceAddr && inputData.invoiceAddr.length > 1" class="multiInvoice">
          <div>存在多张报销凭证，请去订单详情查看。</div>
          <div class="downBtn" @click="showDialog = false">我知道了</div>
        </div>
        <div v-else>
          <iframe
            v-if="showDialog"
            :src="inputData.invoiceAddr[0]||''"
            width="100%"
            height="200px"
            scrolling="no"
            frameborder="0"
          >This browser does not support PDFs</iframe>

          <div class="downDiv">
            <div v-if="isDowning" class="downBtn">去下载</div>
            <div v-else class="downBtn" @click.stop="downloadFile(inputData.invoiceAddr[0]||'')">去下载</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    inputData: {
      type: Object,
      required: true,
      default: {
        invoiceAddr: [],        
        btnName: "",
        where: 1,
        orderStatus: 0 //1表示 已取消
      }
    }
  },
  components: {},
  data() {
    return {
      btnNameDefault: "查看报销凭证",
      showDialog: false, //弹框信息是否显示
      invoiceBlobUrl:[],//转换过的URL
      isDowning: false //是否正在导出Excel
    };
  },
  watch:{
    // inputData: {
    //     handler(val) {
    //       const that= this
    //       //如果有默认选中，需要及时处理一下
    //       if (val.invoiceAddr && val.invoiceAddr.length > 0) {
    //           val.invoiceAddr.forEach(element => {
    //             that.getBlobUrl(element)                     
    //           });
    //       }
    //     },
    //     immediate: true,
    //     deep: true
    // },
  },
  created() {
    // 监听body点击事件,判断点击元素如果为className不为showButton,则让弹框隐藏
    let that = this;
    document.body.addEventListener(
      "click",
      function(e) {
        if (e.target.className.indexOf("showButton") < 0) {
          that.showDialog = false;
        }
      },
      true
    );
  },
  beforeDestroy() {
    let that = this;
    document.body.removeEventListener(
      "click",
      function(e) {
        if (e.target.className.indexOf("showButton") < 0) {
          that.showDialog = false;
        }
      },
      true
    );
  },
  computed: {
    isbtnNoAble: function() {
      //列表上的永远false，只有详情里面的才会有置灰
      if (this.inputData.where == 2 || this.inputData.where == 3) {
        return (
          !(
            this.inputData.invoiceAddr && this.inputData.invoiceAddr.length > 0
          ) || this.inputData.orderStatus == 1
        );
      } else {
        return false;
      }
    }
  },
  methods: {
    getBlobUrl(sUrl){
      const that= this
      fetch(sUrl,{mode:'no-cors'}).then(resp => resp.blob()).then(blob => {
        var url = URL.createObjectURL(blob);
        that.invoiceBlobUrl.push(url)
    });

    },
    //下载PDF
    downloadFile(pdfUrl) {
      if (!!pdfUrl) {
        //PDF下载前端单独操作不好实现，需要后端返回数据流，URL默认会打开
        window.open(pdfUrl);
      } else {
        utils.showToast("凭证下载失败");
      }
    },
    ifShowDIalog() {
      if (!this.isbtnNoAble) {
        this.showDialog = !this.showDialog;
      }
    }
  }
};
</script>
<style scoped lang="less">
@import "~styles/common.less";

.viewInvoicePop {
  // border: 1px solid @border;
  // border-radius: @radius-small;
  // padding: 0 24px 0 20px;
  // margin-bottom: 20px;
  // width: 978px;
  font-size: 14px;
  .viewBaoxiaoP {
    position: relative;
    .showButton {
      color: #478aee;
      background-size: 15px;
      margin-bottom: 10px;
      border: 1px solid #478aee;
      text-align: center;
      border-radius: 2px;
      margin: 5px auto 10px;
      width: 100px;
      line-height: 20px;
      font-size: 12px;
      cursor: pointer;
    }
    .line2 {
      color: #7f7f7f;
      font-size: 12px;
    }
    .wuliuInfoImg {
      line-height: 32px;
      height: 32px;
      width: 160px;
      background: #478aee;
      text-align: center;
      border-radius: 5px;
      margin: 0 auto;
      color: white;
      align-self: center;
    }
    .btnNoAble {
      background: #7f7f7f;
      cursor: auto;
    }
    .dialogShow {
      position: absolute;
      top: 30px;
      right: 0;
      width: 480px;
      height: 290px;
      padding: 20px 20px 10px 20px;
      box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.5);
      background: #fff;
      z-index: 1;
      border-radius: 5px;
      text-align: center;

      .downDiv {
        margin: 10px auto;
        display: flex;
        justify-content: center;
        .downBtn {
          background: #478aee;
          text-align: center;
          color: white;
          padding: 5px;
          border-radius: 3px;
        }
      }
      .multiInvoice {
        margin: 10px auto;
        padding: 50px 0px;
        font-size: 16px;
        color: #333333;
        .downBtn {
          background: #478aee;
          text-align: center;
          color: white;
          padding: 5px;
          width: 100px;
          border-radius: 3px;
          margin: 20px auto;
        }
      }
    }
    .dialogShow2 {
      position: absolute;
      bottom: 30px;
      right: 0;
      width: 480px;
      height: 290px;
      padding: 20px 20px 10px 20px;
      box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.5);
      background: #fff;
      z-index: 1;
      border-radius: 5px;
      text-align: center;

      .downDiv {
        margin: 10px auto;
        display: flex;
        justify-content: center;
        .downBtn {
          background: #478aee;
          text-align: center;
          color: white;
          padding: 5px;
          border-radius: 3px;
        }
      }
    }
  }
}
</style>



