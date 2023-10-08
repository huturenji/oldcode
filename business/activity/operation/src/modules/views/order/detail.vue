<template>
    <div :class="{content:approveStatus=='UNAPPROVED'}">
        <el-row>
            <el-col :span="24">
                <div class="order-money">
                    订单金额:￥{{baseInfo.orderAmount}}
                </div>
            </el-col>
            <el-col :span="24" class="">
                <el-table
                :header-cell-style="{ background: '#f7f8fa' }"
                :data="products"
                style="width: 100%">
                    <el-table-column
                        prop="sku"
                        label="SKU"
                        width="180">
                    </el-table-column>
                    <el-table-column
                        prop="skuName"
                        label="商品名称"
                        width="500">
                        <template slot-scope="scope">
                            <div class="goods">
                                <el-popover placement="top-start" width="250" trigger="hover">
                                    <img style="height: 200px" :src="scope.row.mainImage" alt="" />
                                    <img
                                        slot="reference"
                                        class="img"
                                        :src="scope.row.mainImage"
                                        alt=""
                                    />
                                </el-popover>
                                <p class="sku-name">{{scope.row.skuName}}</p>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="storeName"
                        label="店铺名称">
                    </el-table-column>
                    <el-table-column
                        prop="number"
                        label="数量"
                        width="180">
                    </el-table-column>
                    <el-table-column
                        prop="settlePrice"
                        label="店铺结算价">
                        <template slot-scope="scope">
                            <div>
                                ¥{{scope.row.settlePrice}}
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="salePrice"
                        label="平台销售价">
                        <template slot-scope="scope">
                            <div>
                                ¥{{scope.row.salePrice}}
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
            </el-col>
            <el-col :span="24">
                <div class="base-card marginT12">
                    <div class="title">
                        基本信息
                    </div>
                    <div class="info-item">
                        <namedcomp compName="订单流水号" class="marginT10">
                            <span slot="component" class="info-item-content">{{baseInfo.orderNo}}</span>
                        </namedcomp>
                        <namedcomp compName="活动名称" class="marginT10">
                            <span slot="component" class="info-item-content">{{baseInfo.activityName}}</span>
                        </namedcomp>
                        <namedcomp compName="活动编号" class="marginT10">
                            <span slot="component" class="info-item-content">{{baseInfo.activityId}}</span>
                        </namedcomp>
                        <namedcomp compName="手机号" class="marginT10">
                            <span slot="component" class="info-item-content">{{baseInfo.customerPhone}}</span>
                        </namedcomp>
                        <namedcomp compName="企业名称" class="marginT10">
                            <span slot="component" class="info-item-content">{{baseInfo.customerName}}</span>
                        </namedcomp>
                        <namedcomp compName="结算方式" class="marginT10">
                            <span slot="component" class="info-item-content">{{baseInfo.payType=='OFFLINE'?'线下':'线上'}}</span>
                        </namedcomp>
                        <namedcomp compName="订单创建时间" class="marginT10">
                            <span slot="component" class="info-item-content">{{baseInfo.createTime}}</span>
                        </namedcomp>
                    </div>
                </div>
            </el-col>
            <el-col :span="24" v-if='approveStatus=="APPROVED"'>
                <div class="base-card marginT12">
                    <div class="title">
                        审核信息
                    </div>
                    <div class="info-item">
                        <namedcomp compName="付款状态" class="marginT10">
                            <span slot="component">{{checkInfo.payStatus=='PAID'?'已支付':'未支付'}}</span>
                        </namedcomp>
                        <namedcomp compName="审核状态" class="marginT10">
                            <span slot="component">{{checkInfo.approveResult=='PASS'?'已通过':'已拒绝'}}</span>
                        </namedcomp>
                        <namedcomp compName="操作人" class="marginT10">
                            <span slot="component">{{checkInfo.operatorName}}</span>
                        </namedcomp>
                        <namedcomp compName="备注" class="marginT10">
                            <span slot="component">{{checkInfo.approveRemark}}</span>
                        </namedcomp>
                        <namedcomp compName="附件" class="marginT10">
                            <span slot="component" @click="preview(checkInfo)" v-if="checkInfo.attachmentName" class="attach"><i class="el-icon-view"></i>&nbsp;&nbsp;{{checkInfo.attachmentName}}</span>
                        </namedcomp>
                    </div>
                </div>
            </el-col>
            <el-col :span="24"   v-if='approveStatus=="UNAPPROVED"'>
                <div class="base-card marginT12">
                    <div class="title">
                        审核信息
                    </div>
                    <div class="info-item">
                        <namedcomp compName="付款状态" class="marginT10" required>
                            <div slot="component">
                                <el-radio v-model="payStatus" label="PAID">已支付</el-radio>
                                <el-radio v-model="payStatus" label="UNPAID">未支付</el-radio>
                            </div>
                        </namedcomp>
                        <namedcomp compName="备注" class="marginT10">
                            <Input
                                slot="component"
                                v-model.trim="approveRemark"
                                clearable
                                type="textarea"
                                maxlength="200"
                                show-word-limit
                                :autosize="{ minRows: 5, maxRows: 5}"
                                placeholder="请输入备注"
                                style="width: 350px"
                            />
                        </namedcomp>
                        <namedcomp compName="附件" class="marginT10">
                            <el-upload
                                class="upload-demo"
                                slot="component"
                                :before-upload="beforeAvatarUpload"
                                :on-error="uploaderror"
                                :on-remove="removeAttach"
                                :file-list="fileList">
                                <el-button size="small" type="primary" icon="el-icon-upload2">请选择文件</el-button>
                                <span slot="tip" class="upload__tip">请选择JPEG、PNG、PDF 格式的文件</span>
                            </el-upload>
                        </namedcomp>
                        <namedcomp compName="兑换码" class="marginT10">
                            <el-upload
                                class="upload-demo"
                                slot="component"
                                :before-upload="beforeVoucherUpload"
                                :on-remove="removeVoucher"
                                :on-error="uploaderror"
                                :file-list="voucherfile">
                                <el-button size="small" type="primary" icon="el-icon-upload2">请选择文件</el-button>
                                <span slot="tip" class="upload__tip warring">请选择 TXT 格式的文件，选择审核通过时必须上传兑换码文件</span>
                            </el-upload>
                        </namedcomp>
                    </div>
                </div>
            </el-col>
            <inBody v-if='isAuditOrder && approveStatus=="UNAPPROVED"'>
                <div class="btn">
                    <el-button  @click="check('NOT_PASS')">拒绝</el-button>
                    <el-button type="primary" @click="check('PASS')">通过</el-button>
                </div>
            </inBody>
        </el-row>
        <!-- 二次确认弹框 -->
        <el-dialog
            :title="approveResult=='PASS'?'通过':'拒绝'"
            :visible.sync="confirmvisible"
            width="472px"
            center
            :modal-append-to-body="false"
        >
            <div class="confirm-content">确定要{{approveResult=='PASS'?'通过':'拒绝'}}?</div>
            <div slot="footer">
                <el-button   
                    @click="confirmvisible = false">取消</el-button >
                <el-button  
                    type="primary" 
                    @click="checkSuccess()">确定</el-button >
            </div>
        </el-dialog>
        <noAuth :isShowModal="!isShowModal" />
    </div>
</template>
<script>
  import orderHandler from "bislibs/requestHandler/orderHandler";
  import inBody from "biscomponents/inBody.vue";
  import { cloudservices, utils, eventlistenerhandler } from "opcl";
  const mediaFileUpUrl = window.origin + "/media/presign/v1/getUploadUrl";
  const {userInfo:{mgrName,userId}} = orderHandler
  export default {
    components: {
        inBody
    },
    data() {
      return {
        confirmvisible:false,
        payStatus:'',
        approveRemark:'',
        uploadUrl:window.origin + "/media/presign/v1/getUploadUrl",
        uploadDefault:[],
        products:[],
        baseInfo:{},
        checkInfo:{},
        approveStatus:this.$route.query.approveStatus,  // 1 未审核  2 已审核
        fileList:[],
        voucherfile:[],
        approveResult:'PASS',  // PASS是 通过按钮  NOT_PASS 是 拒绝按钮
        // config:{
        //     Authorization: 'Bearer ' + Vue.prototype.$keycloak.token
        // },
        isAuditOrder:true, //判断是否有权限审核订单
        isShowModal:true //判断是否有权限查看订单列表
        
      };
    },
    created() {
       this.auditOrder();
    },
    mounted(){
        this.getOrderDeatil(this.$route.query.orderNo)
    },
    methods: {
    // 判断是否有权限审核订单
      auditOrder() {
          this.isAuditOrder = eventlistenerhandler.hasAuth('auditOrder');
      },
      // 判断是否有权限查看订单列表
      seeOrder() {
          this.isShowModal = eventlistenerhandler.hasAuth('seeOrder');
      },
      getOrderDeatil(orderNo) {
            let _this = this;
            _this.$iLoading.show();
            let params = {
                orderNo
            };
            orderHandler
                .getOrderDeatil(params)
                .then((result) => {
                    _this.$iLoading.hide();
                    if (result.resultCode === 0) {
                        const {orderAmount, products, orderNo ,activityId,activityName ,customerPhone,customerName,payType,createTime ,approveStatus, payStatus,approveResult,operatorName, approveRemark,attachmentName,attachmentUrl} = result.result
                        this.products = products
                        this.approveStatus = approveStatus
                        this.baseInfo = {orderAmount,orderNo ,activityId,activityName, customerPhone,customerName,payType,createTime}
                        this.checkInfo = {payStatus,approveResult,operatorName ,approveRemark,attachmentName,attachmentUrl}
                    }
                })
                .catch((e) => {
                    _this.$iLoading.hide();
                });
      },
      // 审核按钮弹窗
      check(approveResult){
        if(!this.payStatus){
            utils.showToast("请选择付款状态")
            return false
        }
        if(approveResult=='PASS' && this.voucherfile.length==0){
            utils.showToast("请上传兑换码")
            return false
        }
        this.confirmvisible = true;
        this.approveResult = approveResult
      },
      // 二次确认 审核按钮
      checkSuccess(){
        var json = {
            orderNo: this.$route.query.orderNo,
            payStatus:this.payStatus,
            approveRemark:this.approveRemark,
            approveResult:this.approveResult,
            payType:'OFFLINE',
            operatorName:mgrName,
            operatorId:userId
        };
        this.confirmvisible = false
        if(this.fileList.length>0){
            json.attachmentName = this.fileList[0].name
            json.attachmentUrl = this.fileList[0].url
        }
        if(this.voucherfile.length>0){
            json.voucherCodeUrl = this.voucherfile[0].url
        }
        this.$iLoading.show();
        orderHandler
        .checkSuccess(json)
        .then(res => {
            this.$iLoading.hide();
            if (res.resultCode === 0) {
                this.$router.push({
                path: "/order/list",
                query: {
                    
                }
            });
            }
        }).catch(err => {
            this.$iLoading.hide();
        });
     },
      preview(info){
        const { attachmentUrl} = info
        const type = attachmentUrl.indexOf(".pdf") != -1?'pdf':'img'
        this.$router.push({
            path: "/order/preview",
            query: {
                type,
                url:attachmentUrl
            }
        })
     }, 
      uploaderror(err, file, fileList){
        // console.log(err, file, fileList)

      },
      removeAttach(file, fileList){
         if(file){
            this.fileList = []
         }
      },
      removeVoucher(file, fileList){
         if(file){
            this.voucherfile = []
         }
      },
      beforeAvatarUpload(file){
        
         const type = file.type
         if(type=="image/png"||type=="application/pdf"||type=="image/jpeg"){
            this.uploadUrl = mediaFileUpUrl + encodeURIComponent(file.name);
            this.manualUpload(file,'attach')
         }else{
            utils.showToast("请选择正确的文件格式")
         }
          return false
        //   return this.autoUpload();
         
      },
      beforeVoucherUpload(file){
        
         const type = file.type
         if(type=="text/plain"){
            this.uploadUrl = mediaFileUpUrl + encodeURIComponent(file.name);
            this.manualUpload(file,'voucher')
         }else{
            utils.showToast("请选择正确的文件格式")
         }
          return false
        //   return this.autoUpload();
         
      },
    //   autoUpload() {
    //     //动态改变上传参数,通过返回一个promis对象解决
    //     let promise = new Promise((resolve) => {
    //         this.$nextTick(function () {
    //             resolve(true);
    //         });
    //     });
    //     console.log(" return promise=");
    //     return promise; //通过返回一个promis对象解决
    //   },
        manualUpload(file,ftype) {
            const that = this;
            file.businessType = that.type == "img" ? "logo" : "agreement";
            file.uid = new Date().getTime();
            cloudservices
                .upload2Ceph('/activitystudio/presign/v1/getUploadUrl',[file])
                .then((allRes) => {
                   file.url = allRes[0].downLoadUrl
                   if(ftype=='attach'){
                    that.fileList = [file]
                   }else{
                    that.voucherfile = [file]
                   }
                  
                })
                .catch(() => {
                   
                });
        },
    }
  };
</script>
<style scoped lang="less">
    .marginT10{
        margin-top: 10px;
    }
    .marginT12{
        margin-top: 12px;
    }
    .marginB20{
        margin-bottom: 20px;
    }
    .content{
        padding-bottom: 56px;
    }
    .order-money{
        padding-top: 24px;
        padding-right: 24px;
        height: 60px;
        font-size:16px;
        text-align: right;
        color: #1D2129;
        font-weight: 700;
        background:#fff;
    }
    
    .goods{
         display: flex;
         align-items: center;
    }
    .img {
        height: 71px;
        width: 71px;
    }
    .sku-name{
        margin-left: 8px;
        flex: 1;
        word-break: break-all;
        text-overflow:ellipsis;
        display: -webkit-box; 
        /*!autoprefixer:off;*/
        -webkit-box-orient: vertical; 
        -webkit-line-clamp: 2; 
        overflow: hidden; 
    }

    .base-card{
        background:#fff;
        .title{
            width: 100%;
            height: 48px;
            font-size: 16px;
            font-weight: 700;
            line-height: 48px;
            padding-left: 24px;
            background:#fff;
            border-bottom: 1px solid #F2F3F5;
        }
        .info-item{
            padding-left: 24px;
            /deep/ .compNameA{
                font-size: 14px;
                text-align: left;
                color: #4E5969;
            }
            .info-item-content{
                font-size: 14px;
                color: #1D2129;
            }
            
        }
        padding-bottom: 20px;
    }
    .upload__tip{
        font-size: 14px;
        color: #86909C;
        margin-left: 20px;
    }
    .warring{
        color: #ff7d00;
    }
    .btn{
        width: calc(100% - 200px);
        height: 56px;
        position: fixed;
        bottom: 0;
        left: 200px;
        right: 0;
        z-index: 10;
        background: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .confirm-content{
        font-size: 14px;
        font-family: PingFangSC, PingFangSC-Regular;
        font-weight: 400;
        text-align: center;
        color: #1d2129;
        line-height: 20px;
    }
    .attach{
        cursor: pointer;
        color: #409EFF;
    }
</style>