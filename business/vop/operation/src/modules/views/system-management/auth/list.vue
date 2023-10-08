<template>
    <div class="powermange">
        <el-row v-if="auth">
            <el-table
                stripe
                max-height="700" 
                :highlight-current-row="true"
                :header-cell-style="{background:'#f2f2f2',color:'#666666'}"
                :data="authData"
                style="width: 100%;border: 1px solid #EBEEF5;border-bottom:0;border-radius: 8px;color:#333333"
            >
                <el-table-column
                    prop="type"
                    label="业务类型"
                    width="180"
                >
                </el-table-column>
                <el-table-column
                    prop="authList"
                    label="权限"
                >
                    <template slot-scope="scope">                        
                        <span
                            class="showtaile"
                            v-for=" role in scope.row.authList" 
                            :label="role" 
                            :key="role"
                        >{{ role }}</span>
                           
                    </template>
                </el-table-column>
            </el-table>
        </el-row>
        <el-dialog
            :modal-append-to-body="false"
            :visible.sync="modalFlg"
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
                    @click="confirm"
                >×</span>
            </div>
            <div class="inconContent">
                <p>暂无使用权限，如有需要请联系管理员开通</p>
            </div>
            <span
                slot="footer"
                class="dialog-footer"
            >
                <el-button
                    type="primary"
                    @click="confirm"
                >我知道了</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import systemhandler from "bislibs/requestHandler/systemhandler";
import utils from "bislibs/utils";

export default {
    data() {
        return {
            authData: [],
            auth: false,
            modalFlg: false
        };
    },
    created() {
        var _this = this;
        if (
            utils.hasAuth("seeAuthList")
        ) {
            _this.auth = true;
            _this.getDataList();
        } else {
            _this.modalFlg = true;
        }
    },
    mounted() {},
    methods: {
        // 获取列表数据
        getDataList: function() {
            let _this = this;
            // 获取所有权限信息
            _this.$iLoading.show();
            systemhandler.listPermission({}).then(result => {
                _this.$iLoading.hide();
                if (result.resultCode === 0) {
                    let resultData = result.result;
                    if (
                        !!resultData.businessPermissions &&
                        resultData.businessPermissions.length > 0
                    ) {
                        // 处理响应的数据
                        resultData.businessPermissions.forEach(element => {
                            let dataLi = {};
                            dataLi.type = element.busTypeName;
                            dataLi.authList = [];
                            element.permissions.forEach(item => {
                                dataLi.authList.push(item.permissionName);
                            });
                            // 给tble赋值
                            _this.authData.push(dataLi);
                        });
                    }
                } else {
                    utils.showToast(result.resultMessage);
                }
            }).catch(() => {
                _this.$iLoading.hide();
            });
        },
        confirm: function() {
            this.modalFlg = false;
        }
    }
};
</script>

<style scoped lang="less">
.powermange {
    margin-bottom: 20px;
    .showtaile {
        display: inline-block;
        padding: 3px 5px;
        border-radius: 6px;
        margin-right: 8px;
    }
}
</style>
<style lang="less">
.powermange {
    .el-table th {
        padding: 6px 0;
    }
    .el-table td {
        padding: 10px 0;
    }
}
</style>