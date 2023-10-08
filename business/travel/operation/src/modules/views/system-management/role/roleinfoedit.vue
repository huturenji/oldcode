<template>
    <div class="roleinfoedit">
        <div v-if="hasAuth && !isLoading">
            <el-row>
                <el-col :span="24">
                    <el-form :inline="true" :model="roleData" class="demo-form-inline">
                        <el-form-item label="角色名称 : " class="is-required">
                            <el-input 
                                maxlength="30" 
                                v-model.trim="roleData.roleName" 
                                placeholder="请输入角色名称" 
                                clearable></el-input>
                        </el-form-item>
                    </el-form>
                </el-col>
                <el-col :span="24">
                    <span class="authtitle">权限</span>
                    <div class="tables">
                        <el-table
                            :highlight-current-row="true"
                            :header-cell-style="{background:'#f2f2f2',color:'#666666'}"
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
                                width="1000"
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
            
                <el-col :span="24">
                    <span class="authtitle">人员</span>
                    <div class="allsername" >
                        <span class="person" v-for="(item,index) in members" :key="index">
                            {{ item }}
                        </span>
                    </div>
                </el-col>
                <el-col :span="24">
                    <el-button type="primary" :loading="btnLoading" @click="editRole">保存</el-button>
                    <el-button @click="cancelAdd">取消</el-button>
                </el-col>
            </el-row>
        </div>
        <el-dialog
            :modal-append-to-body="false"
            :visible.sync="noAuth"
            :close-on-click-modal="false" 
            :show-close="false"
            width="560px"
            customClass="noAuth"
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
                roleName: "财务管理员"
            }, //角色信息
            members: [], //人员信息
            roleId: "", //角色id
            permissionIds: [], //权限id列表   
            hasAuth: false, //判断是否有权限
            noAuth: false, //判断是否有权限
            isLoading: true, //初始化页面时，判断是否为加载状态
            btnLoading: false //判断按钮是否为加载状态
        };
    },
    created() {
        let _this = this;
        _this.roleId = utils.getStorage("roleId");
        if (permissionManager.hasAuth("editRole")
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
        //查询权限列表
        getAllPermission: function(selectedAuthData) {
            let _this = this;
            _this.$iLoading.show();
            tmHandler.listPermission({}).then(function(
                result
            ) {
                _this.$iLoading.hide();
                if (!!result && result.resultCode == 0) {
                    _this.isLoading = false;
                    let tempAuthData = result.result.businessPermissions;
                    if (!!tempAuthData && tempAuthData.length > 0) {
                        _this.authData = tempAuthData.map(function(item) {
                            item["checkData"] = [];
                            return item;
                        });
                        _this.$nextTick(() => {
                            if (
                                !!selectedAuthData &&
                                selectedAuthData.length > 0
                            ) {
                                let nodes = [
                                    ...[
                                        ..._this.$refs[
                                            "typeSelection"
                                        ].$el.querySelectorAll(".el-table__row")
                                    ]
                                ];
                                selectedAuthData.forEach(function(item) {
                                    _this.authData.forEach(function(
                                        authIem,
                                        index
                                    ) {
                                        if (
                                            authIem.busTypeId ==
                                                item.busTypeId &&
                                            !!item.permissions
                                        ) {
                                            item.permissions.forEach(function(
                                                item
                                            ) {
                                                authIem.checkData.push(
                                                    item.permissionId
                                                );
                                            });
                                            //选中的权限个数与行权限个数相等时，对应的业务类型选择框为全选状态
                                            if (
                                                item.permissions.length ==
                                                authIem.permissions.length
                                            ) {
                                                _this.toggleSelection(
                                                    [_this.authData[index]],
                                                    true
                                                );
                                            } else {
                                                _this.toggleSelection(
                                                    [_this.authData[index]],
                                                    false
                                                );
                                                //选中的权限个数小于行权限个数并且大于0时，对应的业务类型选择框为半选状态
                                                if (
                                                    item.permissions.length > 0
                                                ) {
                                                    setTimeout(() => {
                                                        nodes[
                                                            index
                                                        ].cells[0].querySelector(
                                                            ".el-checkbox__input"
                                                        ).className +=
                                                            " is-indeterminate";
                                                    }, 100);
                                                } else {
                                                    //选中的权限个数等于0时，对应的业务类型选择框为未选择状态
                                                    nodes[
                                                        index
                                                    ].cells[0].querySelector(
                                                        ".el-checkbox__input"
                                                    ).className =
                                                        "el-checkbox__input";
                                                }
                                            }
                                        }
                                    });
                                });
                            }
                        });
                    }
                }
            }).catch((e) => {
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
            tmHandler.getRoleDetail(json).then(function(result) {
                _this.$iLoading.hide();
                if (!!result && result.resultCode == 0) {
                    _this.roleData.roleName = result.result.roleName;
                    _this.members = result.result.members;
                    let selectedAuthData = result.result.businessPermissions;
                    _this.getAllPermission(selectedAuthData);
                } else if (result.resultCode == 80117001) {
                    _this.$router.go(-2);
                }
            }).catch((e) => {
                _this.$iLoading.hide();
            });
        },
        //编辑角色信息
        editRole: function() {
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
                roleId: _this.roleId,
                roleName: _this.roleData.roleName,
                permissionIds: _this.permissionIds
            };
            _this.btnLoading = true;
            tmHandler.updateRole(json).then(function(
                result
            ) {
                _this.btnLoading = false;
                if (!!result && result.resultCode == 0) {
                    utils.showToast("编辑成功！");
                    _this.$router.back();
                } else if (result.resultCode == 80117001) {
                    _this.$router.go(-2);
                }
            }).catch((e) => {
                _this.btnLoading = false;
            });
        },
        cancelAdd() {
            let _this = this;
            _this.$router.back();
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
    }
};
</script>

<style scoped lang="less">
.roleinfoedit {
    border-radius: 6px;
    .authtitle {
        display: block;
        padding: 16px 32px;
        border-bottom: 2px solid #eeeeee;
    }
    .allsername {
        padding: 16px;
        display: flex;
        flex-wrap: wrap;             
    }
    .person {
        background: #f8f8f8;
        border-radius: 6px;
        font-size: 14px;
        box-sizing: border-box;
        padding: 15px 0;
        margin: 8px 16px 8px 0;
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
    .tables {
        padding: 24px;
    }
}
</style>
<style lang="less" >
.roleinfoedit {
    .el-table th {
        padding: 6px 0;
    }
    .el-input__inner {
        width: 320px;
        height: 36px;
        line-height: 36px;
        border-radius: 8px;
    }
    .el-checkbox__label {
        color: #333333;
    }
    .is-checked {
        .el-checkbox__inner {
            background-color: #478aee;
        }
        .el-checkbox__label {
            color: #478aee;
        }
    }
    .el-col {
        background-color: #fff;
        border-radius: 8px;
        &:nth-child(1) {
            padding: 32px 56px 32px;
            box-sizing: border-box;
            margin-bottom: 16px;
        }
        &:nth-child(2) {
            margin-bottom: 16px;
        }
        &:nth-child(4) {
            background-color: #f4f4f4;
            padding: 40px;
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
    }
    .el-form-item {
        margin-bottom: 0;
    }
    .el-checkbox__inner {
        width: 16px;
        height: 16px;
    }
    .el-checkbox__inner::after {
        height: 8px;
        left: 6px;
    }
    .el-table .cell {
        overflow: visible;
    }
}
</style>
