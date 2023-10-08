<template>
    <div class="addroles">
        <div v-if="hasAuth">
            <div class="rolenamebox"> 
               
                <el-form :inline="true" :model="roleData" class="demo-form-inline">
                    <el-form-item label="角色名称 : " class="is-required">
                        <el-input 
                            :maxlength="30" 
                            clearable 
                            v-model.trim="roleData.roleName" 
                            placeholder="请输入角色名称"
                        >
                              
                        </el-input>
                    </el-form-item>
                </el-form>
              
            </div>
            <el-row>
               
                <el-col :span="24">
                    <span class="authtitle">权限</span>
                    <div class="tables">
                        <el-table
                            stripe
                            :highlight-current-row="true"
                            :header-cell-style="{background:'#f2f2f2',color:'#666666',}"
                            ref="typeSelection"
                            :data="authData"
                            @select="handleSelectionChange"
                            @select-all="handleSelectionChange"
                            style="width: 100%;border: 1px solid #EBEEF5;border-bottom:0;border-radius: 8px;color:#333333">
                            <el-table-column
                                type="selection"
                                width="50">
                            </el-table-column>
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
                                    <el-checkbox-group v-model="scope.row.checkData">
                                        <el-checkbox 
                                            v-for=" (auth,index) in scope.row.permissions" 
                                            :label="auth.permissionId" 
                                            :key="index" 
                                            @change="selectedChange(scope.row)">{{ auth.permissionName }}</el-checkbox>
                                    </el-checkbox-group>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                    
                </el-col>
                
            </el-row>
            <div class="btnsbox">
                <el-button type="primary" :loading="btnLoading" @click="addRole">保存</el-button>
                <el-button @click="cancelAdd">取消</el-button>
            </div>
        </div>
      
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
            authData: [], //权限数据列表
            roleData: {
                roleName: ""
            }, //角色信息
            permissionIds: [], //权限id列表
            hasAuth: false, //判断是否有权限
            noAuth:false,//判断是否有权限
            btnLoading: false //判断按钮是否为加载状态
        };
    },
    created() {
        if (permissionManager.hasAuth("addRole")
        ) {
            this.hasAuth = true;
            this.noAuth = false
            this.getAllPermission();
        } else {
            this.hasAuth = false;
            this.noAuth = true
        }
    },
    mounted() {},
    methods: {
        //取消添加
        cancelAdd() {
            this.$router.back();
        },
        //查询权限列表
        getAllPermission: function() {
            let _this = this;
            _this.$iLoading.show();
            tmHandler.listPermission({}).then(function(
                result
            ) {
                _this.$iLoading.hide();
                if (!!result && result.resultCode == 0) {
                    let tempAuthData = result.result.businessPermissions;
                    if (!!tempAuthData && tempAuthData.length > 0) {
                        _this.authData = tempAuthData.map(function(item) {
                            item["checkData"] = [];
                            return item;
                        });
                    }
                }
            }).catch((e) => {
                _this.$iLoading.hide();
            });
        },
        //查询角色列表
        addRole: function() {
            let _this = this;
            if (!_this.roleData.roleName.trim().length) {
                utils.showToast("角色名称不能为空，请输入角色名称！");
                return;
            }
            if (_this.roleData.roleName.includes(";")) {
                utils.showToast("角色名称不能包含英文分号");
                return;
            }
            if (!!_this.authData && _this.authData.length > 0) {
                _this.permissionIds = [];
                _this.authData.forEach(function(businessPermission) {
                    if (
                        !!businessPermission.checkData &&
                        businessPermission.checkData.length > 0
                    ) {
                        let tempPermissionIds = _this.permissionIds.concat(
                            businessPermission.checkData
                        );
                        _this.permissionIds = tempPermissionIds;
                    }
                });
            }
            if (_this.permissionIds.length == 0) {
                utils.showToast("权限不能为空，请选择权限！");
                return;
            }
            var json = {
                roleName: _this.roleData.roleName,
                permissionIds: _this.permissionIds
            };
            _this.btnLoading = true;
            tmHandler.addRole( json).then(function(result) {
                _this.btnLoading = false;
                if (!!result && result.resultCode == 0) {
                    utils.showToast("添加成功！");
                    _this.$router.back();
                }
            }).catch((e) => {
                _this.btnLoading = false;
            });
        },
        //选择的权限发生变化
        selectedChange: function(row) {
            let _this = this;
            let nodes = [
                ...[
                    ..._this.$refs["typeSelection"].$el.querySelectorAll(
                        ".el-table__row"
                    )
                ]
            ];
            if (!!_this.authData) {
                _this.authData.forEach(function(authItem, index) {
                    //选中的权限个数与行权限个数相等时，对应的业务类型选择框为全选状态
                    if (
                        authItem.busTypeId == row.busTypeId &&
                        !!authItem.checkData &&
                        authItem.checkData.length == row.permissions.length
                    ) {
                        _this.toggleSelection([_this.authData[index]], true);
                    }
                    if (
                        authItem.busTypeId == row.busTypeId &&
                        !!authItem.checkData &&
                        authItem.checkData.length < row.permissions.length
                    ) {
                        _this.toggleSelection([_this.authData[index]], false);
                        //选中的权限个数小于行权限个数并且大于0时，对应的业务类型选择框为半选状态
                        if (authItem.checkData.length > 0) {
                            setTimeout(() => {
                                nodes[index].cells[0].querySelector(
                                    ".el-checkbox__input"
                                ).className += " is-indeterminate";
                            }, 100);
                        } else {
                            //选中的权限个数等于0时，对应的业务类型选择框为未选择状态
                            nodes[index].cells[0].querySelector(
                                ".el-checkbox__input"
                            ).className = "el-checkbox__input";
                        }
                    }
                });
            }
        },
        //切换业务类型行选择状态
        toggleSelection(rows, selected) {
            if (rows) {
                rows.forEach(row => {
                    this.$refs.typeSelection.toggleRowSelection(row, selected);
                });
            }
        },
        //业务类型选择变化时处理对应的权限选择状态
        handleSelectionChange(val) {
            let _this = this;
            let selectedBusTypeIdList = [];
            let multipleSelection = val;
            if (!!_this.authData) {
                if (!!multipleSelection && multipleSelection.length > 0) {
                    selectedBusTypeIdList = multipleSelection.map(function(
                        item
                    ) {
                        return item.busTypeId;
                    });
                    _this.authData.forEach(function(authItem) {
                        multipleSelection.forEach(function(selectedItem) {
                            if (
                                authItem.busTypeId == selectedItem.busTypeId &&
                                !!authItem.permissions
                            ) {
                                let checkData = [];
                                authItem.permissions.forEach(function(item) {
                                    checkData.push(item.permissionId);
                                });
                                authItem["checkData"] = checkData;
                            }
                            if (
                                !selectedBusTypeIdList.includes(
                                    authItem.busTypeId
                                ) &&
                                authItem.permissions.length ==
                                    authItem.checkData.length
                            ) {
                                authItem["checkData"] = [];
                            }
                        });
                    });
                } else {
                    _this.authData.forEach(function(authItem) {
                        //部分选中状态的业务类型，应该不能去掉，需要修改
                         if (!!authItem.checkData &&
                            authItem.checkData.length == authItem.permissions.length
                        ) {                        
                            authItem["checkData"] = [];
                        }
                    });
                }
            }
        },
        //关闭无权限弹框提示
        noAuthConfirm: function() {
            this.noAuth = false;
        }
    },
    watch: {}
};
</script>

<style scoped lang="less">
.addroles {
    border-radius: 6px;
    .authtitle {
        display: block;
        padding: 16px 32px 8px;
        margin-bottom: 10px;
        border-bottom: 1px solid #eeeeee;
        font-weight: bold;
        color: #333;
    }
    .rolenamebox {
        border-radius: 8px;
        padding: 32px 56px;
        background-color: #fff;
        margin-bottom: 16px;
    }
}
</style>
<style lang="less" >
.addroles {
    .btnsbox {
        margin: 16px auto 50px;
        text-align: center;
        .el-button {
            width: 144px;
            height: 48px;
            border-radius: 8px;
            &:hover {
                background-color: #478aee;
                border-color: #478aee;
                opacity: 0.8;
            }
        }
        .el-button--primary {
            background-color: #478aee;
            border-color: #478aee;
            margin-right: 14px;
        }
        .el-button--default {
            background-color: #c2c2c2;
            border-color: #c2c2c2;
            color: #fff;
        }
    }
    .el-checkbox__inner {
        width: 16px;
        height: 16px;
    }
    .el-checkbox__inner::after {
        height: 8px;
        left: 6px;
    }
    .el-checkbox__input.is-indeterminate .el-checkbox__inner {
        background-color: #478aee;
        border-color: #478aee;
    }
    .el-table th {
        padding: 6px 0;
    }
    .el-col {
        background-color: #fff;
        border-radius: 8px;
        //
        &:nth-child(1) {
            .tables {
                padding: 24px;
                .el-checkbox__label {
                    color: #333;
                }
            }
        }
        &:nth-child(2) {
            padding-bottom: 20px;
        }
        &:nth-child(3) {
            .el-button {
                width: 100px;
            }
        }
    }
    .el-table .cell {
        overflow: visible;
    }
    .el-form-item {
        margin-bottom: 0;
    }
    .el-table td {
        border-bottom: 0;
    }
    .el-checkbox__input.is-checked .el-checkbox__inner {
        background-color: #478aee;
        border-color: #478aee;
    }
    .el-checkbox__input.is-checked + .el-checkbox__label {
        color: #478aee;
    }
}
.rolenamebox {
    .el-input__inner {
        width: 320px;
        height: 36px;
        line-height: 36px;
        border-radius: 8px;
    }
}
.noAuth {
    margin-top: 0 !important;
    margin: 0 auto; /*水平居中*/
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
}
</style>
