<template>
<div class="customerAdd_box">
    <div v-if="isShowAddCount">
        <div class="customerAddBox">
            <div class="customerAddBox_content">
                <div class="customerAddBox_item">
                    <div class="left">
                        <span>手机号</span>
                        <span class="customerAddTitle_img">*</span>
                    </div>
                    <el-input v-model="customerInfoIphone" placeholder="请输入手机号" maxlength="13" class="right"/>
                </div>
                <div class="customerAddBox_item">
                    <div class="left">
                        <span>企业名称</span>
                        <span class="customerAddTitle_img">*</span>
                    </div>
                    <el-input v-model="customerInfoName" placeholder="请输入企业名称" maxlength="30" class="right" auto-complete="off"/>
                </div>
                <div class="customerAddBox_item">
                    <div class="left">
                        <span>密码</span>
                        <span class="customerAddTitle_img">*</span>
                    </div>
                    <el-input v-model="customerInfoPassword" show-password placeholder="请输入6~20位密码" maxlength="20" class="right" auto-complete="new-password"/>
                </div>
                <div class="customerAddBox_item">
                    <div class="left">
                        <span>重复密码</span>
                        <span class="customerAddTitle_img">*</span>
                    </div>
                    <el-input v-model="customerInfoPasswordAgain" show-password placeholder="请再次输入密码" maxlength="20" class="right"/>
                </div>
                <div class="customerAddBox_save">
                    <el-button
                        class="saveBtn"
                        type="primary"
                        size="medium"
                        @click="saveInfo"
                    >
                        保存
                    </el-button>
                </div>
            </div>
        </div>
    </div>
    <noAuth :isShowModal="!isShowModal || !isShowAddCount" />
</div>
</template>
<script>
import {utils, eventlistenerhandler} from "opcl";
import {checkMobile,checkPwd} from "bislibs/utils/utils.js"
import customerHandler from "bislibs/requestHandler/customerHandler";
import noAuth from "biscomponents/customer/noAuth.vue";
export default {
    name: "customerAdd",
    components: {
       noAuth
    },
    data: () => {
        return {
            customerInfoIphone:'', //手机号
            customerInfoName:'', //企业名称
            customerInfoPassword:'', //密码
            customerInfoPasswordAgain:'', //二次确认密码
            isShowAddCount:true, // 判断是否有权限新增客户
            isShowModal:true //判断是否有权限查看客户列表

        };
    },
    created() {
       this.hasAddCountAuth(); 
       this.seeCustomerListAuth();
    },
    methods: {
        // 判断是否有权限新增客户
        hasAddCountAuth() {
            this.isShowAddCount = eventlistenerhandler.hasAuth('hasAddCountAuth');
        },
        // 判断是否有权限查看客户列表
        seeCustomerListAuth() {
            this.isShowModal = eventlistenerhandler.hasAuth('seeCustomerListAuth');
        },
        // 保存账户信息
        saveInfo() {
            let _this = this;
            // 手机号校验
            if (!checkMobile(_this.customerInfoIphone.trim())){
                return;
            }
            // 企业名称校验
            if (!_this.customerInfoName.trim().length) {
                utils.showToast("企业名称不能为空，请输入企业名称！");
                return;
            }

            // 密码校验
            if (!checkPwd(_this.customerInfoPassword)){
                return;
            }
            // 重复密码校验
            if (!_this.customerInfoPasswordAgain.trim().length) {
                utils.showToast("重复密码不能为空，请输入重复密码！");
                return;
            }
            if (!checkPwd(_this.customerInfoPasswordAgain,'重复密码')){
                return;
            }
            if (_this.customerInfoPassword!=_this.customerInfoPasswordAgain){
                utils.showToast("前后两次密码输入不一致，请重新输入！");
                return;
            }
            
            let requestData = {
                mobile:_this.customerInfoIphone,
                companyName:_this.customerInfoName,
                password:_this.customerInfoPasswordAgain,
            };
            this.saveAddRule(requestData);
        },
        // 保存新增
        saveAddRule(requestData) {
            this.$iLoading.show();
            customerHandler
                .addCustomerInfo(requestData)
                .then((res) => {
                    if (res.resultCode == 0) {
                        utils.showToast("保存成功");
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
        }
    }
};
</script>
<style lang='less' scoped>
.customerAdd_box{
    height: 100%;
    background: #ffffff;
}
.customerAddBox{
    display: flex;
    justify-content: center;
    padding-top: 100px;
    &_item{
        display: flex;
        align-items: center;
        margin-bottom: 20px;
        
        .right{
            width: 328px;
            height: 32px;
        }
        .left{
            width: 80px;
            .customerAddTitle_img{
                color: #f30300;
            }
        }
    }
    &_save{
        width: 328px;
        margin: 40px 0 0 80px;
        .saveBtn{
            width: 100%;
        }
    }
}
</style>
