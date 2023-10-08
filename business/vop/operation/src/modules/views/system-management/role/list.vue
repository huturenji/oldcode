<template>
    <div
        class="rolemanges"
        id="rolemanges"
    >
        <div>
            <el-row v-if="hasTheAuth('addRole')">
                <el-col :span="24">
                    <el-button
                        type="primary"
                        @click="addrole"
                    >
                        添加角色
                    </el-button>
                </el-col>
            </el-row>
            <el-table
                :data="roleList"
                stripe
                :highlight-current-row="true"
                :header-cell-style="{background:'#f2f2f2',color:'#666666'}"
                style="width: 100%;border: 1px solid #EBEEF5;border-bottom:0;border-radius: 8px;color:#333333"
            >
                <el-table-column
                    prop="roleName"
                    label="角色名称"
                    :show-overflow-tooltip="true"
                    width="200px"
                >
                </el-table-column>
                <el-table-column
                    prop="roleDesc"
                    label="权限"
                >    
                </el-table-column>
    
                <el-table-column
                    width="75px"
                    label="操作"
                >
                    <template slot-scope="scope">
                        <el-button
                            type="text"
                            @click="gotoUserDetail(scope.row.roleId)"
                        >
                            详情
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <el-dialog
            :modal-append-to-body="false"
            :visible.sync="hasAuth"
            :close-on-click-modal="false" 
            :show-close="false"
            customClass="noAuth"
            width="560px"
            center
        >
            <div
                slot="title"
                class="header-title"
            >
                <span class="confirmTitle">权限确认</span>
                <span
                    class="cancelBtn"
                    @click="noAuthConfirm"
                >×</span>
            </div>
            <div class="inconContent">
                <p>暂无使用权限，如有需要请联系管理员开通</p>
            </div>
            <div
                slot="footer"
                class="dialog-footer"
            >
                <el-button
                    type="primary"
                    @click="noAuthConfirm"
                >
                    我知道了
                </el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import utils from "bislibs/utils";
import systemhandler from "bislibs/requestHandler/systemhandler";

export default {
    data() {
        return {
            roleList: [], //角色列表
            hasAuth: false, //判断是否有权限
            flag: false //避免created和activated都会触发请求
        };
    },
    created() {
        let _this = this;
        if (
            _this.hasTheAuth("seeRoleInfo")
        ) {
            _this.getAllRole();
        } else {
            _this.hasAuth = true;
        }
    },
    activated() {
        let _this = this;
        if (!this.flag) {
            _this.getAllRole();
        }
    },
    deactivated() {
        this.flag = false;
    },    
    mounted() {
        let _this = this;
        _this.calHeight(); //动态计算表格高度
        _this.flag = true;
        window.onresize = function() {
            _this.calHeight();
        };
    },
    methods: {
        hasTheAuth(authId){
            return utils.hasAuth(authId)
        },        
        calHeight() {
            // var clientHeight = document.documentElement.clientHeight;
            // var domHeight = clientHeight - 48 - 61 - 40 - 24 - 32 - 32;
            // var tabelMaxHeight = domHeight - 98 - 12;
            // $("#rolemanges .el-table__body-wrapper").css({
            //     "max-height": tabelMaxHeight + "px",
            //     "overflow-y": "auto"
            // });
            // $("#rolemanges").css("height", domHeight + "px");
        },
        addrole() {
            this.$router.push("/sysmgr/role/addroles");
        },
        //跳转角色详情页面
        gotoUserDetail(roleId) {
            utils.setStorage("roleId", roleId);
            this.$router.push("/sysmgr/role/roledetails");
        },
        //查询角色列表
        getAllRole: function() {
            let _this = this;
            _this.$iLoading.show();
            systemhandler.listRole({ }).then(function(result) {
                _this.$iLoading.hide()
                if (!!result && result.resultCode == 0) {
                    _this.roleList = result.result.roleDetailVos;
                }
            }).catch(() => {
                _this.$iLoading.hide()
            });
        },
        //关闭无权限弹框提示
        noAuthConfirm: function() {
            this.hasAuth = false;
        }
    }
};
</script>
<style  lang="less">
.rolemanges {
    .el-button--text {
        color: #478aee;
    }
    .el-col {
        .el-input {
            width: 490px;
        }
        &:nth-child(1) {
            text-align: right;
            margin: 16px 0;
            padding-right: 56px;
            .el-button {
                height: 32px;
                padding: 8px 24px;
                border-radius: 6px;
                font-size: 12px;
            }
            .el-button--primary {
                background-color: #478aee;
                border-color: #478aee;
                &:hover {
                    opacity: 0.8;
                }
            }
        }
    }
    .el-col-24 {
        display: flex;
        justify-content: flex-end;
    }
    .el-input-group__append {
        color: #fff;
        background-color: #409eff;
        border: 1px solid #409eff;
    }
    .el-table th {
        padding: 6px 0;
    }
    .el-table td {
        padding: 4px 0;
    }
}
</style>
