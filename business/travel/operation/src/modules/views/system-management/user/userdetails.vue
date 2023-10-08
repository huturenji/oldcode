<template>
    <div class="userdetails">
        <div class="btnbox">
            <el-button 
                type="danger" 
                plain 
                @click="deluser=!!1"
                v-if="checkAuth('delUser')"
            >删除</el-button>
            <el-button 
                type="primary" 
                @click="gotoedit(formData.userId)"
                v-if="checkAuth('editUser')"
            >编辑</el-button>
        </div>
        <div v-if="checkAuth('seeUserInfos')">
            <el-row>
              
                <el-col :span="24">
                    <div class="jinfo">基础信息</div>
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
                    <div class="jinfo">所属角色</div>
                    <div class="userTypeList">
                        <div class="userlist">
                            <div v-for="(item,index) in formData.roles" :key="index" class="payTypeLi">
                                <el-tooltip 
                                    class="item" 
                                    effect="dark" 
                                    :content="item.roleName" 
                                    placement="top">
                                    <div class="typeBox" >{{ item.roleName }}</div>
                                </el-tooltip>
                            </div>
                        </div>
                        <div v-show="formData.roles && formData.roles.length==0" class="notypeBox">
                            <div >{{ "该人员暂无所属角色" }}</div>
                        </div>
                    </div>
                </el-col>
            </el-row>
        </div>
        <el-dialog
            :modal-append-to-body="false"
            :visible.sync="deluser"
            :close-on-click-modal="false" 
            :show-close="false"
            customClass="noAuth deluser"
            width="560px"
            center>
            <div slot="title" class="header-title">
                <span class="confirmTitle">删除确认</span>
                <span class="cancelBtn" @click="deluser=false">×</span>
            </div>
            <div class="inconContent">
                <p>确定删除该人员？</p>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="deluser=false">取 消</el-button>
                <el-button type="primary" :loading="isBtnLoading" @click="defineDel">确 定</el-button>
            </div>
        </el-dialog>
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
            isBtnLoading: false,
            deluser: false,
            userIds: this.$route.query.userId || "",
            formData: {},
            noAuth: false,
        };
    },
    created() {
        if (this.checkAuth("seeUserInfos")
        ) {
            this.queryUserInfo();
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
            tmHandler.getUser({ userId: this.userIds },).then(res => {
                that.$iLoading.hide();
                if (res.resultCode == 0) {
                    this.formData = res.result;
                }
            }).catch((e) => {
                that.$iLoading.hide();
            });
        },
        // 删除当前user
        // 删除成功-> 弹窗关闭->返回列表页
        defineDel() {
            let that = this;
            this.isBtnLoading = true;
            tmHandler.deleteUser({ userId: this.userIds }).then(res => {
                that.isBtnLoading = false;
                if (res.resultCode == 0) {
                     utils.showToast("删除成功");
                    setTimeout(() => {
                        this.$router.back();
                    }, 1000);
                } else if (res.resultCode == 80117003) {
                    //处理这个异常 --当前删除的时候已经被其他管理员删除的时候的异常操作
                    utils.showToast(res.resultMessage);
                    setTimeout(() => {
                        this.$router.push("/sysmgr/user");
                    }, 1000);
                }
            }).catch((e) => {
                that.isBtnLoading = false;
            });
        },
        // 跳转到编辑页面
        gotoedit(userId) {
            this.$router.push({
                name: "userinfoedit",
                query: {
                    userId
                }
            });
        },
        goHomePage() {
            this.noAuth = false;
        }
    }
};
</script>

<style scoped lang="less">
.userdetails {
    border-radius: 8px;
    .btnbox {
        text-align: right;
        padding: 8px 56px 16px;
    }
    .userlist {
        display: flex;
        flex-wrap: wrap;
    }
    .userTypeList {
        box-sizing: border-box;
        padding: 24px 56px 32px;
    }
    .payTypeLi {
        background: rgba(248, 248, 248, 1);
        border-radius: 6px;
        box-sizing: border-box;
        padding: 8px 16px;
        margin-right: 24px;
        margin-bottom: 16px;
        display: flex;
        height: 48px;
    }
    .typeBox {
        font-size: 14px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        align-items: center;
        justify-content: center;
        color: rgba(51, 51, 51, 1);
        word-break: break-all;
        text-align: center;
        max-width: 110px;
        line-height: 32px;
    }
    .notypeBox {
        text-align: center;
        font-size: 14px;
    }
    .jinfo {
        font-size: 14px;
        font-weight: bold;
        padding: 16px 32px 8px;
        border-bottom: 2px solid #eeeeee;
        color: #333333;
    }
}
</style>
<style lang="less">
.userdetails {
    .btnbox {
        .el-button {
            height: 32px;
            padding: 8px 24px;
            height: 32px;
            font-size: 12px;
            border-radius: 6px;
        }
        .el-button--danger {
            background-color: #fb6041;
            border-color: #fb6041;
            color: #fff;
            &:hover {
                opacity: 0.8;
            }
        }
        .el-button--primary {
            background-color: #478aee;
            border-color: #478aee;
            &:hover {
                opacity: 0.8;
            }
        }
    }
    .el-col {
        background-color: #fff;
        margin-bottom: 16px;
        border-radius: 8px;

        &:nth-child(3) {
            padding-top: 60px;
        }
    }
    .el-form-item {
        margin-bottom: 2px;
    }
    .el-form-item__content {
        color: #333333;
    }
    .el-form-item__label {
        color: #999;
    }
    .el-form {
        box-sizing: border-box;
        padding: 12px 56px;
    }
}
.deluser {
    .el-button--primary {
        color: #fff;
        background-color: #478aee;
        border-color: #478aee;
        &:hover {
            color: #fff;
            background-color: #478aee;
            border-color: #478aee;
            opacity: 0.8;
        }
    }
    .el-button--default {
        margin-left: 24px;
        background-color: #c2c2c2;
        border-color: #c2c2c2;
        color: #fff;
        &:hover {
            background-color: #478aee;
            border-color: #478aee;
            color: #fff;
            opacity: 0.8;
        }
    }
}
</style>
