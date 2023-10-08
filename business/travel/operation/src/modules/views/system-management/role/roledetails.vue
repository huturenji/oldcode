<template>
    <div class="roledetails">
        <div v-if="hasAuth&&!isLoading">
            <div class="btnbos">
              
                <el-button 
                    type="danger" 
                    plain 
                    @click="delrole=!!1" 
                    v-if="checkAuth('delRole')">删除</el-button>
                <el-button type="primary" @click="gotoEdit" v-if="checkAuth('editRole')">编辑</el-button>
            </div>
            <div>    
            </div>
            <el-row>
            
                <el-col :span="24">
                    <el-form :inline="true" :model="roleData" class="demo-form-inline">
                        <el-form-item label="角色名称 :">
                            <span>{{ roleData.roleName }}</span>
                        </el-form-item>
                    </el-form>
                </el-col>
                <el-col :span="24">
                    <span class="authtitle">权限</span>
                    <div class="tables">
                        <el-table
                            stripe
                            :highlight-current-row="true"
                            :header-cell-style="{background:'#f2f2f2',color:'#666666'}"
                            :data="authData"
                            style="width: 100%;border: 1px solid #EBEEF5;border-bottom:0;border-radius: 8px;color:#333333">
                    
                            <el-table-column
                                prop="busTypeName"
                                label="业务类型"
                                width="180">
                            </el-table-column>
                            <el-table-column
                                prop="permissions"
                                label="权限"                                
                            >
                                <template slot-scope="scope">                        
                                    <span
                                        class="showtaile"
                                        v-for="(auth,index) in scope.row.permissions" 
                                        :label="auth.permissionId" 
                                        :key="index">{{ auth.permissionName }}
                                    </span>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                </el-col>
                <el-col :span="24">
                    <span class="authtitle">人员</span>
                    <div v-if="members.length>0" class="allsername">
                        <span class="person" v-for="(item,index) in members" :key="index">
                            {{ item }}
                        </span>
                    </div>
                    <div v-else class="noMember">
                        该角色下暂无人员
                    </div>
                </el-col>
            </el-row>
        </div>
        <el-dialog
            :modal-append-to-body="false"
            :visible.sync="delrole"
            :close-on-click-modal="false" 
            :show-close="false"
            customClass="noAuth"
            width="560px"
            center>
            <div slot="title" class="header-title">
                <span class="confirmTitle">删除确认</span>
                <span class="cancelBtn" @click="delrole=false">×</span>
            </div>
            <div class="inconContent">
                <p>确定删除该角色？</p>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="delrole=false">取 消</el-button>
                <el-button type="primary" @click="deleteRole">确 定</el-button>
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
                <span class="cancelBtn" @click="noAuthConfirm">×</span>
            </div>
            <div class="inconContent">
                <p>暂无使用权限，如有需要请联系管理员开通</p>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="noAuthConfirm">我知道了</el-button>
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
            roleData: {
                roleName: ""
            }, //角色信息
            authData: [], //权限数据列表
            members: [], //人员信息
            delrole: false, //判断是否删除角色
            hasAuth: false, //判断是否有权限
            noAuth: false, //判断是否有权限
            roleId: "", //角色id
            isLoading: true //判断按钮是否为加载状态
        };
    },
    created() {
        let _this = this;
        _this.roleId = utils.getStorage("roleId");
        if (this.checkAuth("seeRoleInfo")
        ) {
            _this.hasAuth = true;
            _this.noAuth = false
            _this.getRoleDetail();
        } else {
            _this.hasAuth = false;
            _this.noAuth = true
        }
    },
    mounted() {},
    methods: {
        checkAuth(id){
            return permissionManager.hasAuth(id)
        },
        //删除角色
        deleteRole: function() {
            let _this = this;
            var json = {
                roleId: _this.roleId
            };
             _this.$iLoading.show();
            tmHandler.deleteRole(json).then(
                function(result) {
                     _this.$iLoading.hide();
                    if (!!result && result.resultCode == 0) {
                        utils.showToast("删除成功!");
                        _this.$router.back();
                    } else if (result.resultCode == 80117001) {
                        setTimeout(function() {
                            _this.$router.back();
                        }, 2000);
                    }
                }
            ).catch((e) => {
                _this.$iLoading.hide();
            });
        },
        //查询角色详情
        getRoleDetail: function() {
            let _this = this;
            var json = {
                roleId: _this.roleId
            };
            _this.$iLoading.show();
            tmHandler.getRoleDetail(json).then(function(
                result
            ) {
                _this.$iLoading.hide();
                if (!!result && result.resultCode == 0) {
                    _this.isLoading = false;
                    _this.roleData.roleName = result.result.roleName;
                    _this.authData = result.result.businessPermissions;
                    _this.members = result.result.members;
                } else if (result.resultCode == 80117001) {
                    setTimeout(function() {
                        _this.$router.back();
                    }, 2000);
                }
            }).catch((e) => {
                _this.$iLoading.hide();
            });
        },
        //跳转到编辑页面
        gotoEdit() {
            this.$router.push("/sysmgr/role/roleinfoedit");
        },
        //关闭无权限弹框提示
        noAuthConfirm: function() {
            this.noAuth = false;
        }
    }
};
</script>

<style scoped lang="less">
.roledetails {
    border-radius: 8px;

    .btnbos {
        text-align: right;
        padding: 8px 56px 16px;
    }
    .authtitle {
        display: block;
        padding: 16px 32px 8px;
        color: #333333;
        font-size: 14px;
        border-bottom: 1px solid #eeeeee;
        font-weight: bold;
    }
    .allsername {
        padding: 16px 56px 24px;
        display: flex;
        flex-wrap: wrap;       
    }
    .tables {
        padding: 24px;
    }
    .showtaile {
        background: #f8f8f8;
        border-radius: 6px;
        box-sizing: border-box;
        margin: 0 8px 0 0;
        display: -webkit-box;
        display: -webkit-flex;
        display: -ms-flexbox;
        display: inline-block;
        text-align: center;
        padding: 5px;
        color: #333333;
        &:last-child {
            margin-right: 0;
        }
    }
    .person {
        background: #f8f8f8;
        border-radius: 6px;
        font-size: 14px;
        box-sizing: border-box;
        padding: 15px 0;
        margin: 0 16px 8px 0;
        display: -webkit-box;
        display: -webkit-flex;
        display: -ms-flexbox;
        display: inline-block;
        text-align: center;
        width: 118px;
        height: 48px;
        color: #333333;
        &:last-child {
            margin-right: 0;
        }
    }
}
</style>
<style lang="less">
.roledetails {
    .el-table--striped .el-table__body tr.el-table__row--striped td {
        background-color: #f8f8f8;
    }
    .el-table th {
        padding: 6px 0;
    }
    .el-table td {
        padding: 7px 0;
    }
    .el-col {
        background-color: #fff;
        box-sizing: border-box;
        border-radius: 8px;
        margin-bottom: 16px;
        &:nth-child(1) {
            padding: 32px 56px 10px;
            box-sizing: border-box;
        }
        &:nth-child(3) {
            margin-bottom: 24px;
        }
    }
    .btnbos {
        .el-button {
            height: 32px;
            padding: 8px 24px;
            border-radius: 6px;
            font-size: 12px;
            &:hover {
                opacity: 0.8;
            }
        }
        .el-button--danger {
            background-color: #fb6041;
            border-color: #fb6041;
            color: #fff;
        }
        .el-button--primary {
            background-color: #478aee;
            border-color: #478aee;
        }
    }

    .el-form-item__content {
        color: #333333;
    }
}
.noMember {
    padding: 24px;
    text-align: center;
    font-size: 14px;
}
</style>
