<template>
    <div class="customerDetailBox">
        <!-- 基本信息 -->
        <div class="baseInfo">
            <div class="title">基本信息</div>
                <div class="content">
                    <div class="item">
                        <div class="left">企业名称：</div>
                        <div>{{getCustomerDetailInfo.companyName}}</div>
                    </div>
                    <div class="item">
                        <div class="left">手机号：</div>
                        <div>{{getCustomerDetailInfo.mobile}}</div>
                    </div>
                    <div class="item">
                        <div class="left">创建时间：</div>
                        <div>{{formatterDetail(getCustomerDetailInfo.createTime)}}</div>
                    </div>
                    <div class="item">
                        <div class="left">状态：</div>
                        <div>{{ getCustomerDetailInfo.state==0?'待审核':getCustomerDetailInfo.state==1?'正常':getCustomerDetailInfo.state==2?'已冻结':''}}</div>
                    </div>
                </div>
        </div>

        <!-- 未审核 审核信息-->
        <div class="checkInfo" v-if="getCustomerDetailInfo.state==0">
            <div class="title">审核信息</div>
                <div class="content checkContent">
                    <div class="noteLable">备注：</div>
                    <el-input
                    class="note"
                    type="textarea"
                    :autosize="{ minRows: 3, maxRows: 5}"
                    placeholder="请输入备注"
                    maxlength="200"
                    show-word-limit
                    v-model="detailNote">
                    </el-input>
                </div>
        </div>

        <!-- 已审核 操作记录-->
        <div class="operationRecord" v-else>
            <div class="title">操作记录</div>
            <div>
                <el-table
                    :data="operationRecord"
                    header-row-class-name="log_header"
                    class="logTable"
                >

                    <el-table-column
                        label="操作时间"
                        min-width="200"
                        prop="opreatorTime"
                        :formatter="formatter"
                    >
                    </el-table-column>
                    <el-table-column
                        prop="opreator"
                        label="操作人"
                        min-width="200"
                    >
                    </el-table-column>
                    <el-table-column
                        prop="opreatorComment"
                        label="内容"
                        min-width="200"
                    >
                    </el-table-column>
                        
                </el-table>
            </div>
            <div class="operationRecord_pagination"
            v-if="pageObject.total">
                <el-pagination
                    background
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page.sync="pageObject.currentPage"
                    :page-sizes="[5,10,20,50,100]"
                    :pager-count="5"
                    :page-count="pageObject.pageCount"
                    :page-size="pageObject.pageSize"
                    layout="total,prev, pager, next,jumper,sizes"
                    :total="pageObject.total"
                ></el-pagination>
            </div>
            <noAuth :isShowModal="!isShowModal" />
        </div>

        <!-- 底部按钮 -->
        <div class="bottomButton" v-if="isEditDetail">
            <!-- 已审核 -->
            <div v-if="getCustomerDetailInfo.state!=0" class="buttonBox">
                <el-button
                    type="primary"
                    size="medium"
                    @click="resetVisible=true"
                >
                    重置密码
                </el-button>
                <el-button v-if="getCustomerDetailInfo.state==1"
                    type="primary"
                    size="medium"
                    @click="lock"
                >
                    冻结
                </el-button>
                <el-button v-if="getCustomerDetailInfo.state==2"
                    type="primary"
                    size="medium"
                    @click="lock"
                >
                    取消冻结
                </el-button>
            </div>
            <!-- 未审核 -->
            <div class="buttonBox" v-else>
                <!-- <el-button
                    type="primary"
                    size="medium"
                    @click="resetPassword"
                >
                    重置密码
                </el-button> -->
                <el-button
                    type="primary"
                    size="medium"
                    @click="reject"
                >
                    拒绝
                </el-button>
                <el-button
                    class="pass"
                    type="primary"
                    size="medium"
                    @click="pass"
                >
                    通过
                </el-button>
            </div>
        </div>

        <el-dialog
            title="重置密码"
            :visible.sync="resetVisible"
            width="472px"
            center
            :before-close="handleClose"
            :modal-append-to-body="false"
        >
             <el-form :model="formData" ref="ruleForm">
                <el-form-item label="新密码" label-width="70px" prop="newPassWord"
                 :rules="rules"
                >
                    <el-input v-model="formData.newPassWord" auto-complete="new-password" show-password maxlength='20'></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer">
                <el-button   
                    @click="closeForm('ruleForm')">取消</el-button>
                <el-button  
                    type="primary" 
                    @click="submitForm('ruleForm')">确定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import customerHandler from "bislibs/requestHandler/customerHandler";
import {utils, eventlistenerhandler } from "opcl";
import {dateFormater,validatePass} from "bislibs/utils/utils.js"
import noAuth from "biscomponents/customer/noAuth.vue"; 
export default {
    name: "customerDetail",
    components: {
       noAuth
    },
    data: () => {
        return {
           userId: null, // 账号Id, 
           getCustomerDetailInfo:{},//账号详情
           detailNote:'',//备注
           operationRecord:[],//操作记录列表
           pageSize:5,
           pageObject:{},//分页对象
           isEditDetail:true ,//判断是否有权限编辑详情
           isShowModal:true, //判断是否有权限查看客户列表
           resetVisible:false,  // 重置密码弹窗
           formData:{newPassWord:''},
           rules:[{ required: true, message: '密码不能为空', trigger: 'blur' },{ validator: validatePass, trigger: 'blur' }]
        };
    },
    created() {
        this.userId = this.$route.query.userId;
        this.seeCustomerListAuth();
        this.hasEditCountAuth();
        this.getCustomerDetail();
    },
    methods: {
        // 判断是否有权限编辑详情
        hasEditCountAuth() {
            this.isEditDetail = eventlistenerhandler.hasAuth('hasEditCountAuth');
        },
        // 判断是否有权限查看客户列表
        seeCustomerListAuth() {
            this.isShowModal = eventlistenerhandler.hasAuth('seeCustomerListAuth');
        },
        // 格式化时间
        formatter(row) {
            return dateFormater("YYYY/MM/DD HH:mm:ss", row.opreatorTime,false);
        },
        formatterDetail(time) {
            return dateFormater("YYYY/MM/DD HH:mm:ss", time,false);
        },
        // 获取账号详情
        getCustomerDetail(pageIndex) {
            let _this = this;

            let requestData = {
                userId: this.userId,
                pageSize:this.pageSize,
                pageNum:pageIndex || 1
            };
            _this.$iLoading.show();
            customerHandler
                .getCustomerDetail(requestData)
                .then((res) => {
                    if (res.resultCode == 0) {
                        _this.getCustomerDetailInfo = res.result.userVo || {};
                        _this.operationRecord = res.result.opreatorPagerVo.opreatorVoList || []; //操作记录
                        _this.setPageObjectByData({
                            totalItems: res.result.opreatorPagerVo.total,
                            totalPages: res.result.opreatorPagerVo.pageCount,
                            pageSize: this.pageSize,
                            pageIndex
                        });
                        
                    }
                })
                .catch((err) => {
                    console.log(err);
                }).finally(()=>{
                    _this.$iLoading.hide();
                });
        },

        // 设置分页数据
        setPageObjectByData({ totalPages, totalItems, pageSize, pageIndex }) {
            this.$set(this.pageObject, "pageCount", totalPages);
            this.$set(this.pageObject, "total", totalItems);
            this.$set(this.pageObject, "currentPage", pageIndex || 1);
            this.$set(this.pageObject, "pageSize", pageSize);
        },
        // 当前页码变化请求数据
        handleCurrentChange(currentPage) {
            this.getCustomerDetail(currentPage);
        },
        // 每页数量改变时
        handleSizeChange(pageSize) {
            this.pageSize = pageSize;
            this.getCustomerDetail(1);
        },
        // 重置密码
        resetPassword(){
            this.$prompt('新密码', '重置密码', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                inputErrorMessage: '密码格式不正确',
                inputType:'password',
                cancelButtonClass:'close',
                confirmButtonClass:'confirm',
                customClass:'confirmPassword',
                inputPlaceholder:"请输入新密码",
                center: true,
                inputValidator:(value)=>{
                    if (!value){
                        return "密码不能为空，请输入密码！";
                    } else if (value.length < 6 && value.length >0) {
                        return '密码最少6位～';
                    } else if (value.length > 20) {
                        return '密码最多20位～';
                    } else if (/[\u4E00-\u9FA5]/g.test(value)) {
                        return '密码不可以有中文～';
                    } else if (!(/^\S*$/.test(value))) {
                        return '密码中不可以有空格～';
                    }
                },
                }).then(({value}) => {
                    this.resetPasswordFun(value)
                // this.$message({
                //     type: 'success',
                //     message: '重置密码成功'
                // });
                }).catch(() => {
                // this.$message({
                //     type: 'info',
                //     message: '取消重置密码'
                // });       
            });
            let ele = document.getElementsByClassName('el-input__inner')[2];
            ele.maxLength='20';
        },
        submitForm(formName){
            this.$refs[formName].validate((value) => {
                if (value) {
                    const { newPassWord } = this.formData
                    this.resetPasswordFun(newPassWord)
                } else {
                    return false;
                }
            });
        },
        closeForm(formName){
            this.resetForm(formName)
            this.resetVisible = false
        },
        handleClose(done){
            this.resetForm('ruleForm')
            done()
        },
        resetForm(formName) {
            this.$refs[formName].resetFields();
        },
        // 重置密码事件
        resetPasswordFun(password){
            this.$iLoading.show();
            let requestData = {
                mobile:this.getCustomerDetailInfo.mobile,
                password:password
            };
            customerHandler
                .resetCustomerPassword(requestData)
                .then((res) => {
                    if (res.resultCode == 0) {
                        utils.showToast("重置密码成功");
                        this.$router.push("/custommange/customerList");
                    } else {
                        utils.showToast(res.resultMessage);
                    }
                })
                .catch((err) => {
                    console.log(err);
                }).finally(()=>{
                    this.$iLoading.hide();
                });
        },

        // 冻结/取消冻结事件
        lockInfo(state){
            this.$iLoading.show();
            let requestData = {
                userId:this.userId,
                state:state
            };
            customerHandler
                .editCustomerInfo(requestData)
                .then((res) => {
                    if (res.resultCode == 0) {
                        state ==1?utils.showToast("取消冻结成功"):utils.showToast("冻结成功");
                        this.$router.push("/custommange/customerList");
                    } else {
                        utils.showToast(res.resultMessage);
                    }
                })
                .catch((err) => {
                    console.log(err);
                }).finally(()=>{
                    this.$iLoading.hide();
                });
        },
        // 审核客户（拒绝/通过）事件
        audit(state){
            this.$iLoading.show();
            let requestData = {
                userId:this.userId,
                auditState:state,
                auditComment:this.detailNote
            };
            customerHandler
                .auditCustomerInfo(requestData)
                .then((res) => {
                    if (res.resultCode == 0) {
                        state ==1?utils.showToast("通过成功"):utils.showToast("拒绝成功");
                        this.$router.push("/custommange/customerList");
                    } else {
                        utils.showToast(res.resultMessage);
                    }
                })
                .catch((err) => {
                    console.log(err);
                }).finally(()=>{
                    this.$iLoading.hide();
                });
        },
       
        // 二次确认弹框(通过，拒绝，取消冻结，冻结)
        againConfirm(state,noteStrBig,noteStrSmall,confirmButtonClass="confirm"){
            this.$confirm(noteStrSmall,noteStrBig, {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                cancelButtonClass:'close',
                customClass:'confirmBox',
                confirmButtonClass:confirmButtonClass,
                center: true
                }).then(() => {
                    if (this.getCustomerDetailInfo.state==0){
                        this.audit(state)
                    } else {
                        this.lockInfo(state);
                    }
                    
                }).catch(() => {
            });
        },
        // 点击拒绝按钮
        reject(){
            this.againConfirm(2,'拒绝','确定要审核拒绝？')
        },
        // 点击通过按钮
        pass(){
            this.againConfirm(1,'通过','确定要审核通过？')
        },
        // 点击冻结与取消冻结按钮
        lock(){
            let state;
            if (this.getCustomerDetailInfo.state==1){ //正常
                state = 2; //冻结
            } else if (this.getCustomerDetailInfo.state==2){ //已冻结
                state = 1; //启用
            }
            let noteStrSmall = this.getCustomerDetailInfo.state==1?'确定要冻结？':this.getCustomerDetailInfo.state==2?'确定要取消冻结？':'';
            let noteStrBig = this.getCustomerDetailInfo.state==1?'冻结':this.getCustomerDetailInfo.state==2?'取消冻结':'';
            let confirmButtonClass = this.getCustomerDetailInfo.state==1?'confirm1':this.getCustomerDetailInfo.state==2?'confirm':'';
            this.againConfirm(state,noteStrBig,noteStrSmall,confirmButtonClass)
        },
    }
};
</script>
<style lang='less'>
.customerDetailBox{
    height: 100%;
    padding-bottom: 56px;
    .el-table tr th:first-child .cell {
        padding-left: 24px;
    }
    .el-table tr td:first-child .cell {
        padding-left: 24px;
    }
    .baseInfo{
        margin-bottom: 12px;
        background: #ffffff;
    }
    .checkInfo{
        min-height: calc(100% - 244px);
        background: #ffffff;
    }
    .logTable{
        border: 1px solid #EBEEF5;
    }
    .log_header{
        th{
            background: rgb(247,248,250);
        }
    }

    .title{
        height: 48px;
        padding-left: 24px;
        font-size: 16px;
        font-weight: 600;
        line-height: 48px;
        color: #1d2129;
        border-bottom: 1px solid #f2f3f5;
    }
    .content{
        margin-top: 20px;
        padding-left: 24px;
        &.checkContent{
            display: flex;
            .noteLable{
                width: 48px;
                padding-top: 6px;
                color: #4E5969;
            }
            .note{
                width: 328px;
            }
            textarea{
                height: 116px !important;
                border: 1px solid #d3d3d3;
            }
        }
    }
    .item{
        padding-bottom: 20px;
        display: flex;
        color: #1D2129;
    }
    .left{
        width: 86px;
        color: #4E5969;
    }
    .bottomButton{
        width: calc(100% - 200px);
        height: 56px;
        position: fixed;
        bottom: 0;
        left: 200px;
        right: 0;
        z-index: 10;
        display: flex;
        justify-content: center;
        align-items: center;
        box-shadow: 0px 2px 12px 0px rgba(0,0,0,0.12);
        background: #fff;
        .buttonBox{
            button{
                color: #1d2129;
                background: #ffffff;
                border: 1px solid #c9cdd4;
            }
            .pass{
                background: #409eff;
                border: 1px solid #409eff;
                color: #ffffff;
            }
        }
    }
}
.close,.confirm,.confirm1{
    width: 70px;
    height: 40px;
}
.confirm1{
    background: #F53F3F;
    border-color: #F53F3F;
    &:hover{
       background: #F53F3F;
       border-color: #F53F3F;
    }
    &:focus{
       background: #F53F3F;
       border-color: #F53F3F;
    }
    &:active{
       background: #F53F3F;
       border-color: #F53F3F;
    }
}
.operationRecord{
    min-height: calc(100% - 244px);
    padding-bottom: 56px;
    background: #ffffff;
    .title{
        height: 36px;
        line-height: 36px;
        padding-left: 24px;
        margin-bottom: 36px;
    }
    &_pagination{
        display: flex;
        justify-content: flex-end;
        margin: 22px 15px 0 0;
    }
}
.confirmPassword{
    .el-message-box__header{
        border-bottom: 1px solid #f2f3f5;
    }
    .el-message-box__content{
        display: flex;
        justify-content: center;
        align-items: center;
        .el-message-box__container{
            width: 70px;
        }
        .el-message-box__input{
            flex: 1;
        }
        .el-message-box__message{
            display: flex;
            p{
                margin-right: 2px;
            }
        }
        .el-message-box__message::after{
            display: block;
            content: ' *';
            color: #f30300;
        }
    }
}
.confirmBox{
    .el-message-box__header{
        border-bottom: 1px solid #f2f3f5;
    }
}

</style>
