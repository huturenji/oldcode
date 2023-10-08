<template>
  <div class="index-wrap">
    <div v-if="loading">
      <LoadingX tip='数据加载中，请稍候...' :spinning="true" :turn="true" />
    </div>
     <EmptyX v-else-if="!loading && invoiceDetails.length == 0" tipsText='暂无内容'/>
     <div v-else class="wrap_box" :class="{invoice_bottom: type!='myInvoice'}">
      <div class="banner">
        <div class="line"></div>
      </div>
      <!-- v-show="index<num" -->
      <ul v-for="(item, index) in invoiceDetails" :key="index" class="invoice" :style="{zIndex: 1000-index}">
        <li>

          <!-- //用来PC下载用的 -->
          <a :id="'downloadhref' + index" style="position: relative; z-index: 1;" download></a>
          <div class="title">
            <span>
              增值税普通发票(电子)
            </span>
          </div>

          <div class="table">
            <div class="cell bbpx">
              <div class="tableLine">
                <div class="name">付款方</div>
                <div class="content">
                  <p>{{item.buyer}}</p>
                  <p>{{item.tax}}</p>
                </div>
              </div>
              <div class="tableLine">
                <div class="name">收款方</div>
                <div class="content">{{item.seller}}</div>
              </div>
            </div>
            <div class="cell">
              <div class="tableLine price">
                <div class="name">发票金额</div>
                <div class="content money">￥{{item.price}}</div>
              </div>
              <div class="tableLine">
                <div class="name">发票内容</div>
                <div class="content">{{item.content}}</div>
              </div>
              <div class="tableLine" v-if="!!item.remark">
                <div class="name">发票备注</div>
                <div class="content">{{item.remark}}</div>
              </div>
            </div>
            <div class="cell">
              <div class="tableLine download">
                <div class="name">下载PDF</div>
                <div class="content">
                  <span class="check cursorp" @click='downloadPDF(item, index)' :class="{checked:checkPDFUrl(item)}"> 下载PDF</span>
                </div>
              </div>
            </div>
          </div>
        </li>
      </ul>  
      <!-- 默认展示三张 新增查看全部按钮 经与UI/UE沟通 超过三张折叠的功能暂时屏蔽掉-->
      <!-- <div v-if="invoiceDetails.length > 3" class="viewall">
        <span @click="showMore">
          {{txt}} 
          <i :class="{close:!isShowMore}"></i>
        </span>
      </div> -->

       <!-- 从我的发票进入才会显示 -->
      <div v-if="type=='myInvoice'" class="detailRow">
        <span class="title cursorp">消费详情 </span>
        <span class="goOrderDetail cursorp" v-if="curInvoice.orderType == 'ORDER_TYPE_HOTEL'" @click="goOrderDetail">{{curInvoice.travelMessage}}<i><icon type="icon_common_rightarrow" size=".24"/></i></span>
        <span class="goOrderDetail cursorp" v-else @click="goOrderDetail">
          <i class="icon_train"><icon :type="curInvoice.orderType == 'ORDER_TYPE_TRAIN'?'icon_train_train':'icon_plane_plane'" size=".28"/></i>
          <span>{{curInvoice.startCity + ' -- ' + curInvoice.endCity}}</span>
          <i class="icon_right"><icon type="icon_common_rightarrow" size=".24"/></i>
        </span>
      </div>
     </div>

       <!-- 如果是酒店报销凭证的话要给提示-->
      
      <div  v-if="type=='hotel' && !checkPDFUrl(invoiceDetails[0])" class="invoice_tips">
        <i class="icon_prompt"><icon type="icon_common_prompt" size=".26"/></i>
        <span>我们将在您离店后1-2个工作日内为您开具发票，届时请注意查收，谢谢</span>
      </div>

      <div v-if="type!='myInvoice'" class="invoice_phone">
        如有疑问，请联系客服 <a @click="callPhone()">{{BIS_CUSTOMER_SERVICE_PHONE}}</a>
      </div>

      <div v-transfer-dom>
          <popup v-model="showPdfPopup" height='100%' width="100%" position="right" class="popEditBox" :popup-style={zIndex:1001}>
              <iframe v-if="showPdf" :src="pdfSrc" class="iframe_dom" :style="iframeStyle" frameborder="0"></iframe>
          </popup>
      </div>
  </div>
</template>

<script>
import icon from 'components/icon/index';
import LoadingX from "components/loading/index";
import EmptyX from "components/empty/EmptyX.vue";
import {
    TransferDom,
    Popup
} from 'vux';

import invoiceHandler from 'modules/invoiceManage/views/common/lib/invoiceHandler.js';
export default {
    mixins: [invoiceHandler.mixin.tChatEventMixin],
    name:'swp-invoice-detail',
    components: {
        LoadingX,
        EmptyX,
        Popup,
        icon
    },
    directives: {
        TransferDom
    },
    data() {
        return Object.assign(invoiceHandler.stateManager.setData([
            {
            
            }], this), {
            BIS_CUSTOMER_SERVICE_PHONE: invoiceHandler.BIS_CUSTOMER_SERVICE_PHONE,//联系客服的电话号码
            invoiceDetails: [], //发票详情集合
            orderNo: '', //订单号
            type: '',//用来区分火车票train/酒店hotel/机票flight/用车car的type类型 
            loading: true,
            curInvoice: {},//从我的发票跳转过来 ，为了显示消费详情
            txt: '查看全部',
            num: 3,//默认显示几条
            isShowMore: true,
            showPdfPopup: false,
            pdfSrc:'', //pdf的预览的url
            showPdf: false, //用iframe内嵌pdf，只适用于安卓
            iframeStyle:{
                width: '100%',
                height: '100%'
            }
        })
    },
    created() {
        let that = this;
        that.initData();
        //注册并监听t信返回事件
        sinosdk.sino.onBack(function(){
            invoiceHandler.stateManager.closeTopPop(() => {
                // 如果是从订单详情过来的，回到订单详情页去，关窗口即可，如果是我的发票进来的，路由回退
                if (that.type === 'myInvoice') { 
                    that.$router.go(-1);
                } else {
                    //退回到订单
                    let loadData = JSON.stringify({refresh:true});
                    invoiceHandler.closePage('', 1, loadData);
                } 
            });
        }, that)
      
    },
    watch:{},
    mounted() {},
    computed:{
        isAndroid(){
            return invoiceHandler.getNavigatorType() == 'android';
        },
        isIOS(){
            return invoiceHandler.getNavigatorType() == 'ios';
        },
        isPC(){
            return invoiceHandler.isPC();
        }
    },
    methods: {
        //注册并监听t信返回事件
        goBackFun(){
            let that = this;
            if (that.type === 'myInvoice') { 
                that.$router.go(-1);
            } else {
                //退回到订单
                let loadData = JSON.stringify({refresh:true});
                invoiceHandler.closePage('', 1, loadData);
            } 
        },
        initData(){
            let that = this;
            that.type = that.$route.query.type;
            that.orderNo = that.$route.query.orderNo;
            //有订单号的时候 通过订单号获取订单详情
            if (!!that.orderNo){
                that.getInvoiceDetailByOrderNo();
            } else {
                invoiceHandler.showToast('订单号错误！')
            }
        },
        callPhone(){
            sinosdk.sino.callTel(this.BIS_CUSTOMER_SERVICE_PHONE);
        },
        downloadPDF(item, index) {
            if (this.checkPDFUrl(item)) {
                this.downloadFile(item, index);
            } else {
                invoiceHandler.showToast('开票中，请稍等');
            }
        },
        //存在url代表已经开出来了
        checkPDFUrl(item){
            return !!item.pdfUrl ? true : false;
        },
        //获取发票详情
        getInvoiceDetailByOrderNo(){
            let that = this;
            that.loading = true;
            invoiceHandler.getInvoiceDetailByOrderNo({orderNo: that.orderNo}).then(function(res){
                // console.log('获取发票详情',res);
                if (res.resultCode == 0){
                    that.invoiceDetails = res.result.invoiceDetails || [];
                    that.curInvoice = Object.assign({}, {
                        endCity: res.result.endCity || '',
                        orderNo: res.result.orderNo || '',
                        orderType: res.result.orderType || '',
                        startCity: res.result.startCity || '',
                        travelMessage: res.result.travelMessage || ''
                    })
                }
                that.loading = false;
            }).catch(function(e){
                console.log(e);
                that.loading = false;
            })
        },

        // 跳转相应的订单详情页
        goOrderDetail () {
            let url = ''
            if (this.curInvoice.orderType === 'ORDER_TYPE_FLIGHT') {
                url = 'order/index.html#/detail/flight'
            } else if (this.curInvoice.orderType === 'ORDER_TYPE_TRAIN') {
                url = 'order/index.html#/detail/train'
            } else if (this.curInvoice.orderType === 'ORDER_TYPE_HOTEL') {
                url = 'order/index.html#/detail/hotel'
            } else if (this.curInvoice.orderType === 'ORDER_TYPE_CAR') {
                url = 'order/index.html#/detail/car'
            }
            url = url + '?orderNo=' + this.curInvoice.orderNo + '&pageFrom=myInvoice'
            invoiceHandler.openPageLib(url)
        },
        showMore(){
            this.isShowMore = !this.isShowMore;
            this.num = this.isShowMore? 3: this.invoiceDetails.length;
        },
        //下载PDF
        downloadFile(item, index) {
            const that = this;
            const url = item.pdfUrl;
            that.showPdf = false;
            const idDomName = 'downloadhref' + index;
            const DOM = document.getElementById(idDomName);
            const urlType = '.pdf';
            //下载url
            if (!!url) {
                if (!!that.isPC) {
                    DOM.setAttribute("href", url);
                    var ev = document.createEvent('MouseEvents');
                    // initMouseEvent的参数比较多，可以参见API文档
                    // https://developer.mozilla.org/en-US/docs/Web/API/event.initMouseEvent
                    ev.initMouseEvent('click', true, true, window, 1, 0, 0, 0, 0, false, false, false, false, 0, null);
                    DOM.dispatchEvent(ev); //pc不支持要click()方法，要自己实例化一个事件对象，然后模拟触发
                    DOM.removeAttribute("href");

                // if (typeof history.pushState == "function") {
                //   var xhr = new XMLHttpRequest();
                //   xhr.open("get", 'url', true);
                //   xhr.responseType = "blob";
                //   xhr.setRequestHeader("Access-Control-Allow-Origin", "*");
                //   xhr.async = true;
                //   xhr.onload = function () {
                //     if (this.status == 200) {
                //       var blob = this.response;
                //       console.log(blob);
                //       var img = document.createElement("img");
                //       img.onload = function (e) {
                //         window.URL.revokeObjectURL(img.src); // 清除释放
                //       };
                //       img.src = window.URL.createObjectURL(blob);
                //     }
                //   }
                //   xhr.send();
                // }
                } else if (!!that.isIOS){ //ios直接用jsbridge FilePreviewWidget
                    let previemJson = {
                        "fileId": '',
                        "previewUrl": url,
                        "downloadUrl": url,
                        "fileSize": parseFloat(35),
                        "fileName": 'invoice' + new Date().format('yyyy/MM/dd HH:mm:ss') + urlType
                    }
                    sinosdk.sino.filePreview(previemJson);
                } else if (!!that.isAndroid){ //安卓直接用iframe打开
                    that.pdfSrc = url;
                    that.$nextTick(()=>{
                        that.showPdf = true;
                    })
                }
            } else {
                invoiceHandler.showToast('凭证下载失败')
            }
        }
    }
}

</script>
<style lang="less">
@import '~themes/default/styles/InvoiceDetailIndex.less';
</style>
