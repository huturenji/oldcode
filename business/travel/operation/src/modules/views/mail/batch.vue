<template>
  <div class="batchMailBox">
    <div class="batchMailTopBox">
      <div class="mailTopTitle">
        <a class="icon-back cursorp" @click="$router.go(-1)"></a>
        <div>批量邮寄</div>
      </div>
      <div class="mailTopDesc">
        <div class="leftContent">小贴士</div>
        <div class="content">
          {{topTips[0]}}
          <Br/>
          {{topTips[1]}}
        </div>
      </div>
    </div>
    <div class="divSpace"></div>
    <div class="credentials">
      <span class="leftTitle">快递公司：</span>
      <template v-if="!!expressArr && expressArr.length!=0">
        <div class="cpy-container">
            <div class="label " v-for="cpy in expressArr" :key="cpy.expressCompanyNo" @click="selectSomeCpy(cpy)">
                <span class="check-icon cursorp" :class="isSelectCpy(cpy) ? 'check' : 'uncheck'" />
                <img class="cpyicon" :src="getLogoUrl(cpy)"/>   
                <!-- <span>{{cpy.expressCompanyName}}</span>          -->
            </div>            
        </div>
      </template>
    </div>
    <div class="addressBox">
      <div class="leftSide">
          <div class="leftbox">
            <div class="icon"></div>
            <span @click.stop="openCommonAddress" class="utag" v-if="showComonAdressUI">常用地址</span>
          </div>        
      </div>
      <div class="rightSide rightSideHalf">
        <addressInputView ref="addrSender" :addressType="1" :addressData="senderAddressData" :showComp="true"></addressInputView>
      </div>
    </div>
    <div class="addressBox" style="border: none;">
      <div class="leftSide">
        <div class="icon2"></div>
      </div>
      <div class="rightSide">
        <div class="tableLine addressBox2">
          <div class="columnNormal column1">
            <label
              class="check-icon cursorp"
              :class="isSelectAll() ? 'check' : 'uncheck'"
              @click.stop="selectAllAddr()"
            ></label>
          </div>
          <div
            class="columnNormal column2"
            v-for="(item) in listTitleArray"
            :key="item.name"
            :title="item.name"
          >{{item.name}}</div>
        </div>
        <div v-if="isLoadingReceiverList" class="loading-container">
          <span>数据加载中...</span>
        </div>
        <div v-else-if="!isLoadingReceiverList && !orderReceiverInfoList || orderReceiverInfoList.length==0" class="empty-message">
          <i class="icon"></i> 暂无数据
        </div>
        <div v-else class="content-result" refer>
          <div
            class="tableLine addressBox2"
            :class="{'transportLine':index%2==0}"
            v-for="(item,index) in orderReceiverInfoList"
            :key="item.orderNo"
          >
            <div class="columnNormal column1">
              <label
                class="check-icon cursorp"
                :class="isSelectItem(item) ? 'check' : 'uncheck'"
                @click.stop="selectOneAddr(item)"
              ></label>
            </div>
            <div
              class="columnNormal column2"
              :title="item.orderNo||''"
              @dblclick.stop="changeCli(item,'orderNo')"
            >
              <input :placeholder="item.orderNo||''" :type="text" v-if="item.orderNoInput">
              <span v-else>{{item.orderNo||""}}</span>
            </div>
            <div
              class="columnNormal column2"
              :title="item.name||''"
              @dblclick.stop="changeCli()"
            >{{item.name||""}}</div>
            <div
              class="columnNormal column2"
              :title="item.phone||''"
              @dblclick.stop="changeCli()"
            >{{item.phone||""}}</div>
            <div
              class="columnNormal column2"
              :title="item.areaArray[0]||''"
              @dblclick.stop="changeCli()"
            >{{item.areaArray[0]||""}}</div>
            <div
              class="columnNormal column2"
              :title="(item.areaArray.length == 2 ? item.areaArray[0] :item.areaArray[1])||''"
              @dblclick.stop="changeCli()"
            >{{(item.areaArray.length == 2 ? item.areaArray[0] :item.areaArray[1])||""}}</div>
            <div
              class="columnNormal column2"
              :title="(item.areaArray.length == 2 ? item.areaArray[1] :item.areaArray[2])||''"
              @dblclick.stop="changeCli()"
            >{{(item.areaArray.length == 2 ? item.areaArray[1] :item.areaArray[2])||""}}</div>
            <div
              class="columnNormal column2"
              :title="item.address||''"
              @dblclick.stop="changeCli()"
            >{{item.address||""}}</div>
          </div>
          <pageUI :page="page" @turnPage="turnPage" v-if="orderReceiverInfoList && orderReceiverInfoList.length>0"></pageUI>
        </div>
      </div>
    </div>
    <div class="boxbtn">
      <a class="clickbtn confirm" href="javascript:void(0);" @click.stop="addPatchExpressInfos">立即邮寄</a>
    </div>
    <div v-transfer-dom class="setAdress" v-show="showSetAdress">
      <setAddressCard
        @closeSetAddress="closesetAdress"
        @getInputAddr="setSenderAddress"
        :address="editAddress"
        :showComp="true"
      ></setAddressCard>
    </div>
    <div v-transfer-dom class="commonAdress" v-show="showComonAdress">
      <comAddressCard
        @closeComonAdress="closeComonAdress"
        @setAddress="openSetAdress"
        @onItemClick="setSenderAddress"
        :addressList="senderAddressList"
      ></comAddressCard>
    </div>
    <div v-transfer-dom v-show="showMailSucessBox">
        <mailSucessBox @closeSucBox="closeSucBox" :mailResponse="mailResponse"></mailSucessBox>
    </div>
    <div v-transfer-dom :show="isLoadingAddExpressInfos">        
    <Loading :show="isLoadingAddExpressInfos" :text="loadingText" class="couponLoading"></Loading>       
    </div>    
  </div>
</template>

<script>
import tmHandler from 'bislibs/requesthandler/traveloperationhandler.js';
const pageUI = () => import("components/page/page.vue");
const addressInputView = () => import("biscomponents/mail/addressinput/addressinput.vue");
const setAddressCard = () => import("biscomponents/mail/setaddress/setaddress.vue");
const comAddressCard = () => import("biscomponents/mail/confirmaddress/confirmaddress.vue");
const mailSucessBox = () => import("biscomponents/mail/sucess/sucess.vue");  
import utils from "bislibs/utils";
import  * as travelfun from "bislibs/traveloperationfun.js";

export default {
  props: ["menuIndex"],
  directives: {
  },
  components: {
    pageUI,
    addressInputView,
    setAddressCard,
    comAddressCard,
    mailSucessBox,
  },
  data() {
    return {      
        page: {//收件人列表翻页数据
        pageSize: 10,
        currPage: 1,
        pageCount: 1,
        totalRecord: 0
        },
        orderReceiverInfoList: [],//收件人信息列表
        expressArr: [],//快递公司列表，从缓存获取。
        isLoadingReceiverList: true, //是否是显示收件人加载框
        topTips: [
        "1、机票报销凭证需在航班起飞后邮寄（一单一寄）；",
        "2、机票行程单、保险发票、退票手续费收据需一并快递邮寄至用户；快递费将开具电子发票，如需查看请前往订单详情；"
        ], //顶部的提示小贴士
        formDataValue: {//要提交的数据
        toMailInfo: [], //要邮寄的内容
        selectCpys: [], //选中的公司         
        senderAddress: {}, //发送者的地址         
        receiverAddress:[], //收货人的地址
        validateMsg: {}
        },
        showComonAdress: false, //控制是否弹出常用地址页面
        showSetAdress: false, //控制是否弹出设置地址页面
        senderAddressData:{},//寄件人的默认数据对象
        listTitleArray: [//收件人信息的列表 表头 标题
        {
            name: "商旅通订单号"
        },
        {
            name: "收件人姓名"
        },
        {
            name: "联系电话"
        },
        {
            name: "省"
        },
        {
            name: "市"
        },
        {
            name: "区（县）"
        },
        {
            name: "详情地址"
        }
        ],
        senderAddressList: [], //寄件人地址列表
        editAddress: {}, //设置地址页面，要编辑的地址
        showComonAdressUI: true, //页面是否展示常用地址UI提示
        showMailSucessBox:false,//控制是否弹出邮寄成功
        mailResponse:"",//邮寄成功的快递信息    
        isLoadingAddExpressInfos: false, //是否显示批量提交加载框      
        loadingText:"正在生成运单号...", //批量提交加载框提示语       
    };
  },
  created() {
    const that = this;
    //快递公司数据列表
    that.expressArr = !!utils.getStorage("expressCompanies")
      ? JSON.parse(utils.getStorage("expressCompanies"))
      : that.expressArr;
    //默认选中第一个快递公司
    if(!!that.expressArr && that.expressArr.length>0){
        that.selectSomeCpy(that.expressArr[0]);
    }    
    //获取寄件人信息列表
    that.getSenderAddress().then((response)=>{
        if(response && !!that.senderAddressList && that.senderAddressList.length > 0){
        //首次进入页面，默认赋值一次。
            that.setSenderAddress(that.senderAddressList[0]);
        }
    });
    //获取收件人信息列表
    that.getReceiverAddrList();
  },
  mounted() {},
  watch: {},
  methods: {
    getLogoUrl(info){
        return travelfun.getExpressLogo(info, 1);				
    },              
    openSucBox(){
        this.showMailSucessBox = true;
    },
    closeSucBox(){
        this.showMailSucessBox = false;
        //重置翻页参数
        this.page.currPage = 1;
        this.getReceiverAddrList();
    },      
    /**
     * 指定页码翻页跳转
     * @param newPageNum 页码
     */
    turnPage(newPageNum) {
      // console.info(newPageNum);
      this.page.currPage = parseInt(newPageNum);
      this.getReceiverAddrList();
    },
    /**
     * 分页获取收件人数据
     */    
    getReceiverAddrList() {
      let _this = this;
      let request = {
        pageSize: _this.page.pageSize,
        pageIndex: _this.page.currPage
      };
      //页面查询的时候，提示正在加载中
      _this.isLoadingReceiverList = true;
      tmHandler.getOrderNoAndReceiverInfos(request)
      .then(
        function(res) {
          _this.isLoadingReceiverList = false;
          if (0 == res.resultCode) {
            let data = res.result;
            _this.page.totalRecord = res.result.totalRecord;
            _this.page.pageCount = res.result.totalPageCount;

            if(!!res.result.orderNoAndReceiverInfos && res.result.orderNoAndReceiverInfos.length > 0){
                let receiverList = res.result.orderNoAndReceiverInfos;
                //区分省市区，用于UI展示
                for(let i=0;i<receiverList.length;i++){
                    receiverList[i].areaArray = travelfun.getAreaToArray(receiverList[i].area);
                }
                _this.orderReceiverInfoList = receiverList;
                //清空选中对象
                _this.formDataValue.receiverAddress.splice(0,_this.formDataValue.receiverAddress.length)  
            }else if(request.pageIndex == 1){
                //数据清空，以防万一
                _this.orderReceiverInfoList && _this.orderReceiverInfoList.splice(0);
                //清空选中对象
                _this.formDataValue.receiverAddress.splice(0,_this.formDataValue.receiverAddress.length)                               
                //显示空数据加载框          
                _this.showEmptyDialog();
            }else{
                console.info("list is empty,pageIndex="+request.pageIndex);
            }
          } else {
            console.info(res);
          }
        },
        function(error) {
            _this.isLoadingReceiverList = false;
            console.info(error);
        }
      );
    },
    showEmptyDialog(){
        const that = this;
        let title,content;
        title = "提示";
        content = "暂无收件人信息?";
        travelfun.showConfirm(content, function () {
            //确定            
        }, 1,"取消","确定",title, function () {
        },true);       
    },
    /**
     * 选中某个快递公司
     */
    selectSomeCpy(expressCpy) {
      if (this.isSelectCpy(expressCpy)) {
        this.formDataValue.selectCpys.splice(this.formDataValue.selectCpys.indexOf(expressCpy),1);
      } else if (this.formDataValue.selectCpys.length < 1) {
        this.formDataValue.selectCpys.push(expressCpy);
      } else {
        this.formDataValue.selectCpys.splice(0, this.formDataValue.selectCpys.length);
        this.formDataValue.selectCpys.push(expressCpy);
      }
    },
    /**
     * 是否已选中某个快递公司
     */
    isSelectCpy(expressCpy) {
      let result = false;
      for (let i = 0; i < this.formDataValue.selectCpys.length; i++) {
        if (this.formDataValue.selectCpys[i].expressCompanyNo == expressCpy.expressCompanyNo) {
          result = true;
          break;
        }
      }
      return result;
    },
    /**
     * 跳转到常用地址
     */
    openCommonAddress() {
      this.showComonAdress = true;
    },
    /**
     * 关闭常用地址
     */
    closeComonAdress() {
      this.showComonAdress = false;
    },
    /**
     * 设置新地址
     */
    openSetAdress(item) {       
        this.closeComonAdress();
        if (!!item) {
            //编辑地址
            this.editAddress = item;
            this.editAddress.areaArray = travelfun.getAreaToArray(item.area);;
        } else {
            this.editAddress = {};
        }
        this.showSetAdress = true;
    },
    /**
     * 设置寄件人地址
     */
    setSenderAddress(item) {
        this.closeComonAdress();
        //清空报错信息
        this.$refs.addrSender.clearCheckError();
        //给prop动态赋值
        this.senderAddressData = item;
        this.senderAddressData.areaArray = travelfun.getAreaToArray(item.area);    
    },
    /**
     * 关闭设置新地址
     */
    closesetAdress() {
      this.showSetAdress = false;
      this.getSenderAddress();
    },
    /**
     * 选中所有的数据
     */
    selectAllAddr() {
        if(this.isSelectAll()){
            this.formDataValue.receiverAddress.splice(0,this.formDataValue.receiverAddress.length)
        }else{
            this.formDataValue.receiverAddress.splice(0,this.formDataValue.receiverAddress.length)
            for(let i=0;i<this.orderReceiverInfoList.length;i++){
                this.selectOneAddr(this.orderReceiverInfoList[i]);
            }
        }
    },
    /**
     * 判断是否全部被选中
     */    
    isSelectAll(){
        return this.formDataValue.receiverAddress.length != 0 && this.formDataValue.receiverAddress.length == this.orderReceiverInfoList.length;
    },
    /**
     * 选中某一条数据
     */
    selectOneAddr(item) {
        if(this.isSelectItem(item)){
            this.formDataValue.receiverAddress.splice(this.formDataValue.receiverAddress.indexOf(item),1);
        }else{
            this.formDataValue.receiverAddress.push(item);
        }
    },
    /**
     * 判断某一条Item是否被选中
     */
    isSelectItem(item){
      let result = false;
      for (let i = 0; i < this.formDataValue.receiverAddress.length; i++) {
        if (this.formDataValue.receiverAddress[i].orderNo ==item.orderNo) {
          result = true;
          break;
        }
      }
      return result;
    },
    /**
     * 是否切换输入功能
     */
    changeCli(item, key) {
      console.info("changeCli");
    //   if ("orderNo" == key) {
    //     item.orderNoInput = true;
    //   }
    //   this.$forceUpdate();
      // console.info("changeCli:changeKey="+item.changeKey)
    },
    /**
     * 查询寄件人地址信息
     */
    getSenderAddress() {
        let _this = this;
        return new Promise(function(reslove) {
            let request = {
              channelId:'1'
            }; 
            tmHandler.getSenderInfos(request)
            .then(
                function(res) {
                    if (0 == res.resultCode && !!res.result.senderInfos) {
                        _this.senderAddressList = res.result.senderInfos || [];
                        reslove(true);
                    } else {
                        console.info(res);
                        _this.senderAddressList = [];
                        reslove(false);
                    }
                },
                function(error) {
                    console.info(error);
                    _this.senderAddressList = [];
                    reslove(false);
                }
            );
        });	
    },
    /**
     * 校验参数
     */
    checkParam(){
        let result = true;
        let sendData = this.$refs.addrSender.getInputVaule();
        if (!sendData) {
            result = false;
        }else{
            this.formDataValue.senderAddress = sendData;
        }      
        if(!(!!this.formDataValue.selectCpys && this.formDataValue.selectCpys.length>0)){
            result = false;
            utils.showToast("请选择快递公司")
            return result;   
        }
       if(this.formDataValue.receiverAddress.length == 0){
            result = false;
            utils.showToast("请选择收件人")
            return result;              
       } 
       for(let i=0;i<this.formDataValue.receiverAddress.length;i++){
          let receiver = this.formDataValue.receiverAddress[i];
          if(!receiver.name || !receiver.phone|| !receiver.area|| !receiver.address){
            result = false;
            utils.showToast("请选择有地址的收件人")
            break;    
          }
       }
       return result;            
    },
    /**
     * 提交快递信息
     */
    addPatchExpressInfos() {
      let _this = this;
      console.log("addPatchExpressInfos");
      if(!_this.checkParam()){
          //参数校验
          return;
      }

      let copyFormData = JSON.parse(JSON.stringify(_this.formDataValue))
      let request = {
        expressCompanyNo: copyFormData.selectCpys[0].expressCompanyNo,
        senderInfo: copyFormData.senderAddress,
        orderNoAndReceiverInfo: copyFormData.receiverAddress,
      };
      delete request.senderInfo["areaArray"]
      delete request.senderInfo["addressId"]
      for(let i=0;i<request.orderNoAndReceiverInfo.length;i++){
        delete request.orderNoAndReceiverInfo[i]["areaArray"]
        delete request.orderNoAndReceiverInfo[i]["channelId"]
        delete request.orderNoAndReceiverInfo[i]["companyId"]
        delete request.orderNoAndReceiverInfo[i]["userId"]
      }

      _this.isLoadingAddExpressInfos = true;
      tmHandler.addPatchExpressInfos(request)
      .then(
        function(res) {
          _this.isLoadingAddExpressInfos = false;
          if (0 == res.resultCode) {
            _this.mailResponse = copyFormData.selectCpys[0].expressCompanyName+",共"
                +copyFormData.receiverAddress.length+"单";
            _this.openSucBox();
          } else {
            console.info(res);
            utils.showToast("提交失败");
          }
        },
        function(error) {
           _this.isLoadingAddExpressInfos = false;  
          console.info(error);
        }
      );
    }
  }
};
</script>
<style scoped lang="less">
@import "batch.less";
</style>
