<template>
    <div class="useredit">
        <el-row v-if="checkAuth('seeUserInfos')">
            <el-col :span="24">
                <div class="jcinfo">基础信息</div>
                <el-form ref="form" :model="formData" label-width="80px">
                    <el-form-item label="姓名 :">
                        <span >{{ formData.userName }}</span>
                    </el-form-item>
                    <el-form-item label="账号 :">
                        <span>{{ formData.account }}</span>
                    </el-form-item>
                    <el-form-item label="性别 :">
                        <span>{{ formData.sex }}</span>
                    </el-form-item>
                    <el-form-item label="所属部门 :">
                        <span>{{ formData.department }}</span>
                    </el-form-item>
                    <el-form-item label="手机号码 :">
                        <span>{{ formData.phone }}</span>
                    </el-form-item>
                    <el-form-item label="邮箱 :">
                        <span>{{ formData.email }}</span>
                    </el-form-item>
                </el-form>
            </el-col>
            <el-col :span="24">
                <div class="jcinfo">所属角色</div>
                <div class="userTypeList">
                    <div class="userlist">
                        <div
                            v-for="(item,index) in userList"
                            :key="index"
                            :class="item.State?'payTypeLicheck':'payTypeLi'"
                            @click.prevent="checkrole(item,index)"
                        >
                            <div class="typeBox">
                            
                                <el-tooltip 
                                    class="item" 
                                    effect="dark" 
                                    :content="item.roleName" 
                                    placement="top">
                                    <span >{{ item.roleName }}</span>
                                </el-tooltip>
                                <el-checkbox v-model="item.State"></el-checkbox>
                            </div>
                        </div>
                    </div>
                </div>
            </el-col>
            <el-col :span="24">
                <el-button type="primary" :loading="isBtnLoading" @click="updataUser">保存</el-button>
                <el-button @click="cancel">取消</el-button>
            </el-col>
        </el-row>
        <el-dialog
            :modal-append-to-body="false"
            :visible.sync="noAuth"
            :close-on-click-modal="false" 
            :show-close="false"
            customClass="noAuth"
            width="560px"
            center>
            <div slot="title" class="header-title">
                <span class="confirmTitle">权限确认</span>
                <span class="cancelBtn" @click="goHomePage">×</span>
            </div>
            <div class="inconContent">
                <p>暂无使用权限，如有需要请联系管理员开通</p>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="goHomePage">我知道了</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import tmHandler from "bislibs/requesthandler/traveloperationhandler.js";
import utils from "bislibs/utils";
import permissionManager from 'bislibs/permissionhandler/eventlistenerhandler'

export default {
    data() {
        return {
            userList: [],
            isBtnLoading: false,
            userIds: this.$route.query.userId || "",
            formData: {},
            noAuth: false,
        };
    },
    created() {
        if (this.checkAuth("seeUserInfos")
        ) {
            this.queryUserInfo();
            this.getAllRole();
        } else {
            this.noAuth = true;
        }
    },
    mounted() {},
    methods: {
        checkAuth(id){
            return permissionManager.hasAuth(id)
        },
        // 查询user信息
        queryUserInfo() {
            let that = this;
            that.$iLoading.show();
            tmHandler.getUser({ userId: this.userIds }).then(res => {
                 that.$iLoading.hide();
                if (res.resultCode == 0) {
                    that.formData = res.result;
                }
            }).catch((e) => {
                that.$iLoading.hide();
            });
        },
        // 所有角色
        getAllRole() {
            let that = this;
            that.$iLoading.show();
            tmHandler.listRole({}).then(res => {
                that.$iLoading.hide();
                if (res.resultCode == 0) {
                    this.userList = res.result.roleDetailVos;
                    setTimeout(() => {
                        this.userList.forEach(element => {
                            this.$set(element, "State", false); //初始不勾选
                            this.formData.roles.forEach(item => {
                                if (item.roleId == element.roleId) {
                                    this.$set(element, "State", true); //数据回显
                                }
                            });
                        });
                    }, 200);
                }
            }).catch((e) => {
                that.$iLoading.hide();
            });
        },
        updataUser() {
            let that = this;
            // 保存编辑
            let arr = [];
            // 筛选出选中的数据
            this.userList.forEach(item => {
                if (item.State) {
                    arr.push(item.roleId);
                }
            });
            let params = {
                userId: this.userIds,
                roleIds: arr
            };

            this.isBtnLoading = true;
            tmHandler.updateUser(params).then(res => {
                that.isBtnLoading = false;
                if (res.resultCode == 0) {
                    utils.showToast("编辑成功")
                    setTimeout(() => {
                        if(params.userId == tmHandler.userInfo.userId){
                            //如果更改了自己的权限。需要重新登录。
                            Vue.prototype.$iLoading.hide();
                            Vue.prototype.$Modal.error({
                                title: '提示',
                                content: '<p>您更改了自己的权限，请重新登录</p>',
                                onOk: () => {
                                    tmHandler.logOut();
                                },
                            });
                        }else{
                            this.cancel();
                        }
                    }, 1000);
                } else if (res.resultCode == 80117003) {
                    //处理编辑的时候这个人员已经其他人删除的操作
                    utils.showToast(res.resultMessage);
                    setTimeout(() => {
                        this.$router.push("/sysmgr/user");
                    }, 1000);
                }
            }).catch((e) => {
                that.isBtnLoading = false;
            });
        },
        // 返回
        cancel() {
            this.$router.back();
        },
        // 处理角色选中/取消状态
        checkrole(item, index) {
            this.userList[index].State = !item.State;
        },
        goHomePage() {
            this.noAuth = false;
        }
    }
};
</script>

<style scoped lang="less">
.useredit {
    border-radius: 8px;
    .userlist {
        display: flex;
        flex-wrap: wrap;
        cursor: pointer;
    }
    .userTypeList {
        box-sizing: border-box;
        padding: 24px 56px 32px;
    }
    .payTypeLi {
        box-sizing: border-box;
        padding: 16px 10px;
        border: 1px solid rgba(235, 235, 235, 1);
        margin: 0px 40px 8px 0;
        display: flex;
        width: 184px;
        height: 72px;
        border-radius: 6px;
    }
    .payTypeLicheck {
        box-sizing: border-box;
        padding: 16px 10px;
        border: 1px solid #478aee;
        margin: 0px 40px 8px 0;
        display: flex;
        width: 184px;
        height: 72px;
        border-radius: 6px;
    }
    .typeBox {
        margin-left: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #333333;
        span {
            width: 113px;
            font-size: 14px;
            overflow: hidden;
            word-break: break-all;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
        }
    }
    .jcinfo {
        font-size: 14px;
        font-weight: bold;
        padding: 16px 32px 8px;
        border-bottom: 1px solid #eeeeee;
        color: #333333;
    }
}
</style>
<style lang="less">
.useredit {
    .el-form-item__content {
        color: #333333;
    }
    .el-form-item__label {
        color: #999;
    }
    .el-col {
        background-color: #fff;
        border-radius: 8px;
        &:nth-child(1) {
            margin-bottom: 16px;
            .el-form {
                box-sizing: border-box;
                padding: 12px 56px;
            }
        }
        &:nth-child(3) {
            background-color: rgba(242, 242, 242, 1);
            text-align: center;
            margin: 40px 0;
            .el-button {
                border-radius: 8px;
            }
            .el-button:first-child {
                background-color: #478aee;
                border-color: #478aee;
                &:hover {
                    background-color: #478aee;
                    border-color: #478aee;
                    opacity: 0.8;
                }
            }
            .el-button--default {
                background-color: #c2c2c2;
                border-color: #c2c2c2;
                color: #fff;
                margin-left: 24px;
                &:hover {
                    opacity: 0.8;
                    background-color: #478aee;
                    border-color: #478aee;
                }
            }
            .el-button {
                width: 144px;
                height: 48px;
            }
        }
    }
    .el-form-item {
        margin-bottom: 2px;
    }
    .el-button {
        width: 100px;
    }
    .el-checkbox__input.is-checked .el-checkbox__inner {
        background-color: #478aee;
        border-color: #478aee;
    }
    .el-checkbox__inner::after {
        top: 2px;
        left: 5px;
    }
    .el-checkbox__inner {
        border-radius: 50%;
        width: 16px;
        height: 16px;
    }
}
</style>
