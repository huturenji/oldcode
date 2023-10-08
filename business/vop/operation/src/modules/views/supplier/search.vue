<template>
    <div class="spMgrContentBox">
        <div v-if="auth.lookListAuth">
            <div
                class="spMgrContent"
                id="spMgrContent"
            >
                <div class="spMgrSearch">
                    <el-input 
                        style="width:320px;margin-bottom:15px;"
                        v-model.trim="searchKey" 
                        clearable
                        @keyup.enter.native="searchSp"
                        :maxlength="20"
                        placeholder="供应商简称"
                    >
                        <template slot="append">
                            <Button 
                                type="primary"
                                icon="el-icon-search"
                                @click="searchSp"
                            >
                            </Button>
                        </template>
                    </el-input>


                </div>
                <!-- <div class="addSp">
                    <Button v-if="auth.createAuth" size="small" type="primary" @click="addSp('add')">
                        <span>+新建</span>
                    </Button>
                </div> -->
                <el-table
                    :row-class-name="tableRowClassName"
                    :stripe="true"
                    :header-cell-style="{background:'#f2f2f2',height:'36px',padding:'0'}"
                    :data="dataList"
                >
                    <el-table-column
                        prop="supplierShortName"
                        label="供应商"
                    >
                        <template slot-scope="scope">
                            <div class="spLi">
                                <img
                                    :src="scope.row.supplierLogo "
                                    @error="defaultLogoSrc()"
                                    style="width:48px;height:48px;margin-right: 10px;"
                                />
                                <span>{{ scope.row.supplierShortName }}</span>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="serTime"
                        label="供应商ID"
                    >
                        <template slot-scope="scope">
                            <div class="spLi">
                                <span>{{ scope.row.supplierId }}</span>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="spStatus"
                        align="center"
                        label="全部状态"
                        sortable
                    >
                        <template slot-scope="scope">
                            <span
                                v-if="scope.row.supplierState"
                                style="color:#23B45D"
                            >已启用</span>
                            <span
                                v-else
                                style="color:#EE6747"
                            >已停用</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="handleTime"
                        align="center"
                        label="启用/停用时间"
                    >
                        <template slot-scope="scope">
                            <span>{{ scope.row.updateTime }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        v-if="auth.lookListAuth"
                        width="100px"
                        prop="spHandle"
                        align="center"
                        label="操作"
                    >
                        <template slot-scope="scope">
                            <span
                                style="color:#478aee;cursor:pointer;"
                                @click="addSp('detail',scope.row.supplierId)"
                            >详情</span>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="pagingBox">
                    <el-pagination
                        background 
                        v-if="dataList.length > 0"
                        @size-change="pSizeChange"
                        @current-change="changePage"
                        :current-page="pageNum"
                        :page-sizes="[5,10,20,50,100]"
                        :page-size="pageSize"
                        layout="total,prev,pager,next,jumper,sizes"
                        :total="totalNum"
                    >
                    </el-pagination>
                </div>
            </div>
        </div>
        
        <el-dialog
            :visible.sync="modal1"
            :close-on-click-modal="false" 
            :show-close="false"
            width="560px"
            :modal-append-to-body="false"
            center
        >
            <div
                slot="title"
                class="header-title"
            >
                <span class="confirmTitle">权限确认</span>
                <span
                    class="cancelBtn"
                    @click="modal1 = false"
                >×</span>
            </div>
            <div class="inconContent">
                <p>暂无使用权限，如有需要请联系管理员开通</p>
            </div>
            <span
                slot="footer"
                class="dialog-footer"
            >
                <Button
                    type="primary"
                    @click="modal1 = false"
                >我知道了</Button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import {
    Input,
    Button,
    Table,
    TableColumn,
    Pagination,
    Dialog
} from "element-ui";
import utils from 'bislibs/utils';
import supplierhandler from 'bislibs/requestHandler/supplierhandler';
export default {
    components: {
        elInput: Input,
        Button,
        elTable: Table,
        elTableColumn: TableColumn,
        elPagination: Pagination,
        elDialog: Dialog
    },
    data() {
        return {
            defImg:
                "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAABICAYAAABV7bNHAAAAAXNSR0IArs4c6QAAAERlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAASKADAAQAAAABAAAASAAAAACQMUbvAAAEbUlEQVR4Ae2baVPjMAyGXSj3Vc7//+/4xH0U2gK7j2fEeIpjJUZe6I40k00bxYrz+JVsl9nR5eXlR3DrJLDW6XFHJOCAFCE4IAekEFDcriAHpBBQ3K4gB6QQUNyuIAekEFDcriAHpBBQ3K4gB6QQUNyuIAekEFDcriAHpBBQ3K4gB6QQUNxjxd/bPRqNwsHBQdje3g5raz8jzPf39/Dy8hIeHh7Cx4fN3yLMAAFnd3e3N9AWNzIw0of7+3uTR5gNNcr5LWbZFzNAP5VWuUGx7IsZoFxH/4drzQG9vb2FxWKxsqzMivQyAWYUCqXAQfYU8o2NjeVbf/X3ZgpiqgXOeDwOm5ubAWCW0++/otoEEDDm83lYX18Pk8kkHB4ehq2trQiJ66tkzVKsJYTZbBZeX18DZwaDgxTmQK0MhpU1AURHqTWo5fb2Nnacl5HrtZ1nlfz4+PhZ11i9E5M0BhIpzTOfnp5qH/GlXRNAPIWCnCvSvNRQY9twd3cXtxG039nZiVuanFJQFiA5LLYbzQAxstQfpnk6yijXGMq4vr6O6iB9qGelWEDj2NvbiwOEcr9jTYp02iEKdemF0ntzn0lRUoc91snJyZdYDMDz83MciLQ9z+R+2ZulviGf64Z1yBO+cS/LAhTA3grl5Ozm5iYCBMjZ2dmXW2iHCkm5GmuuoJpO0QZlUGxR4NHRUWcYWYjKOXcj7YlTY78WEHUH29/fDzWFPYVBe+LUWPMUm06nnzMKUz81oTSaFHTqDgqi0DNjWRhxSFnSbYg1A0RHeNF0FuEzBRXJ536zAQ41hamaUc9N40Nebvle4jFgPKevKpukGPXg6uoqwkE1zCbn5+dx6hWFsOBLjeukFRBlQyvn9L7vfJZ4feHwLHNAjD4vSoqgEuCwfiGtWDyyNqKDAEJhgEFtAGUVLGud2Lm/KWZppOxQM00x0kd27CzUALJsQGNKBg5Tr8w+nIFzfHz8eW25be47sWjLuYWZRWVbASDUQY0pFVde5vT0NEJCcRj1ATiYpECfgkobYvSpV33ixQ4k/5gBAo5sL1CCZkDg5aQWpdOwAOrz0wip23e1LPGGFGkzQKiCFy5N4TloKRjxE4ND1CXXc2cAMzhAysVK20g8GYDU1/V5eNXqiETKDIXTESpeJmVICablkgGH+ziXjDg1KWYGaMiolF5EfBR5YqIQUqLLUA6pXUoz2ksqd8Xpum4GqOsBtddRIy/NcoHfgrqMtLq4uCimF+2JU2NmgEqjXNMx2rBMoOCzHKj9UzLtanfy9MEMULqlILCVsbBkBUyNkR/O+sRmbcT9Wm3SYo2s/ksmKcEs1mLBhjrTn1xZbHLk1j7MVCiGw0LVZoBkJABUs6SX9qUzsxC1RF6cIs6zOPBxiK8UZ4jPbB0kD5Wtg3xveQYGwGoLcJ++mdWgPg9bxXsckDJqDsgBKQQUtyvIASkEFLcryAEpBBS3K8gBKQQUtyvIASkEFLcryAEpBBS3K8gBKQQUtyvIASkEFPcfSUwNXipoDvYAAAAASUVORK5CYII=",
            userParam: {},
            auth: {
                lookListAuth: false,
                createAuth: true
            },
            modal1: false,
            UserID: "",
            spStatus: "", //搜索状态条件
            searchKey: "",
            markItem: {},
            dataList: [],
            dataListMsg: "数据加载中...",
            pageSize: 10,
            pageNum: 1,
            totalNum: 0,
            modelTitle: "确定启用该渠道中业务？",
            modelContentMsg: "启用后，B+平台提供该服务"
        };
    },
    beforeCreate() {},
    created() {
        var _this = this;
        // _this.getUserInfo();
        _this.judgeAuth();
        //取用户之前设置的pageSize信息
        // if (!!localStorage.getItem(_this.userParam.UAId + "-spMgrPageSize")) {
        //     _this.pageSize =
        //         Number(
        //             localStorage.getItem(
        //                 _this.userParam.UAId + "-spMgrPageSize"
        //             )
        //         ) || 10;
        // }
        if (!_this.auth.lookListAuth) {
            _this.modal1 = true;
            return false;
        }
        if (_this.auth.lookListAuth) {
            _this.getSpList();
        }
    },
    mounted: function() {
        var _this = this;
        _this.calHeight();
        window.onresize = function() {
            _this.calHeight();
        };
    },
    methods: {
        /**
         * 计算中间卡片的高度以及tab的最大高度
         */
        calHeight() {
            var clientHeight = document.documentElement.clientHeight;
            var spMgrHeader = $("#ivu-breadcrumb").height();
            //domHeight = 可视高度 - 公共header - 面包屑 - 距离底部24
            var domHeight = clientHeight - 64 - spMgrHeader - 24;
            domHeight = domHeight > 480 ? domHeight : 480;
            //表格内容最大高度 = domHeight - 上下pading-搜索栏、按钮以及paging以及表头高度
            var tabelMaxHeight = domHeight - 302;
            $("#spMgrContent .el-table__body-wrapper").css({
                "max-height": tabelMaxHeight + "px",
                "overflow-y": "auto"
            });
            // $("#spMgrContent").css("height", domHeight + "px");
        },
        /**
         * 获取userCoInf信息
         */
        getUserInfo() {
            var _this = this;
            var userCoInfStr = CommonCrypt.decrypt(
                utils.getCookie("userCoInf"),
                "SWPTCMuserCoInfo"
            );
            var serCoInfJsonStr = decodeURI(decodeURI(userCoInfStr));
            _this.userParam = JSON.parse(serCoInfJsonStr);
        },
        /**
         * 权限判断
         */
        judgeAuth() {
            var _this = this;
            if (utils.hasAuth('seeSupplier')) {
                _this.auth.lookListAuth = true;
            } else {
                _this.modal1 = true;
            }
            if (utils.hasAuth('addSupplier')) {
                _this.auth.createAuth = true;
            }
        },
        addSp: function(title, spID) {
            this.$router.push({
                path: "/supplier/detail",
                query: {
                    spName: title,
                    supplierId: spID
                }
            });
        },
        /**
         * 过滤输入框左右两侧空格
         */
        strTrim: function(val, key) {
            this[key] = val.trim();
        },
        searchSp: function() {
            var _this = this;
            _this.searchKey = _this.searchKey.trim();
            _this.pageNum = 1;
            _this.getSpList();
        },
        /**
         * 获取sp列表
         */
        getSpList: function() {
            var _this = this;
            var json = {
                pageNum: _this.pageNum,
                pageSize: _this.pageSize,
                searchKey: _this.searchKey
            };
            _this.$iLoading.show();
            supplierhandler.listSupplier(json)
                .then(result => {
                    _this.$iLoading.hide();
                    if (result.resultCode === 0) {
                        var resultData = result.result;
                        if (!!resultData.total) {
                            _this.totalNum = resultData.total;
                            // 将status 1、2转化为true、false
                            resultData.supplierDetailResults.forEach(function(
                                item
                            ) {
                                if (item.supplierState == 1) {
                                    item.supplierState = true;
                                } else {
                                    item.supplierState = false;
                                }
                            });
                            _this.dataList = resultData.supplierDetailResults;
                        } else {
                            _this.dataList = [];
                            _this.dataListMsg = "暂无数据";
                        }
                    } else {
                        utils.showToast(result.resultMessage);
                    }
                })
                .catch(function() {
                    _this.$iLoading.hide();
                });
        },
        radioCheck: function(flg, ind) {
            var _this = this;
            _this.dataList.forEach(function(item, index) {
                if (ind == index) {
                    item.checked = true;
                } else {
                    item.checked = false;
                }
            });
            // this.$forceUpdate();
        },
        /**
         * 时间格式化
         */
        getLocalTime: function(nS) {
            var date = new Date(parseInt(nS));
            var seperator1 = "-";
            var seperator2 = ":";
            var month = date.getMonth() + 1;
            var strDate = date.getDate();
            var strHours = date.getHours();
            var strMin = date.getMinutes();
            var strSec = date.getSeconds();
            if (month >= 1 && month <= 9) {
                month = "0" + month;
            }
            if (strDate >= 0 && strDate <= 9) {
                strDate = "0" + strDate;
            }
            if (strHours >= 0 && strHours <= 9) {
                strHours = "0" + strHours;
            }
            if (strMin >= 0 && strMin <= 9) {
                strMin = "0" + strMin;
            }
            if (strSec >= 0 && strSec <= 9) {
                strSec = "0" + strSec;
            }
            var currentdate =
                date.getFullYear() +
                seperator1 +
                month +
                seperator1 +
                strDate +
                " " +
                strHours +
                seperator2 +
                strMin +
                seperator2 +
                strSec;
            return currentdate;
        },
        /**
         * 每页显示条数变化
         */
        pSizeChange: function(pSize) {
            var _this = this;
            _this.pageSize = pSize;
            _this.pageNum = 1;
            _this.dataList = [];
            localStorage.setItem(
                _this.userParam.UAId + "-spMgrPageSize",
                pSize
            );
            _this.getSpList();
        },
        /**
         * 页码变化
         */
        changePage: function(page) {
            var _this = this;
            _this.pageNum = page;
            _this.dataList = [];
            _this.getSpList();
        },
        /**
         * 斑马纹对应的class名
         */
        // eslint-disable-next-line no-unused-vars
        tableRowClassName: function({ row, rowIndex }) {
            if (rowIndex % 2 == 1) {
                return "trBg";
            }
        },
        /**
         * 图片加载失败显示默认图片
         */
        defaultLogoSrc: function() {
            var img = event.srcElement;
            img.src = this.defImg;
            img.onerror = null; //防止闪图
        }
    },
    filters: {
        /**
         * logo图片地址过滤，兼容绝对路径
         */
        srcFilter(url) {
            if (url.substring(0, 4) != "http") {
                url =
                    window.location.protocol +
                    "//" +
                    window.location.hostname +
                    (window.location.port ? ":" + window.location.port : "") +
                    "/mallvop/file/v1/content" +
                    url;
            }
            return url;
        }
    },
    watch: {}
};
</script>
<style lang="less" scoped>
.spMgrContentBox {
    font-size: 14px;
    // height: 100%;
    background-color: #f2f2f2;
    margin-bottom: 24px;
    .spMgrHeader {
        .headerTop {
            box-sizing: border-box;
            height: 61px;
            padding: 24px 0 16px 24px;
            width: 1280px;
            margin: auto;
            span {
                font-size: 16px;
            }
            .homePageCrumb {
                color: #999;
                cursor: pointer;
            }
            .homePageCrumb:hover {
                color: #409eff;
            }
        }
    }
    .spMgrContent {
        box-sizing: border-box;
        // width: 1280px;
        margin: auto;
        padding: 32px 24px 24px;
        background-color: #fff;
        border-radius: 8px;
        .addSp {
            display: flex;
            justify-content: flex-end;
            padding: 16px 0;
            .el-button {
                padding: 0;
                width: 80px;
                height: 32px;
                line-height: 32px;
                border-radius: 8px;
                font-size: 14px;
                margin-right: 32px;
                border-radius: 6px;
            }
        }
    }
    .pagingBox {
        padding-right: 11px;
        padding-top: 24px;
        text-align: right;
    }
    .spLi {
        display: flex;
        align-items: center;
    }
}
</style>
<style lang="less">
.spMgrContentBox {
    .spMgrSearch {
        padding-left: 32px;
        .el-input-group__append {
            border-radius: 0 8px 8px 0;
            text-align: center;
            background-color: #478aee;
            color: #fff;
            border-color: #478aee;
            .el-button {
                padding: 12px 12px;
            }
        }
        .el-input__inner {
            border-radius: 8px 0 0 8px !important;
            height: 36px;
        }
    }
    tbody tr {
        height: 80px;
    }
    table tr {
        td:last-child .cell {
            text-align: right;
        }
        th:nth-last-child(2) .cell {
            text-align: right;
        }
    }
}
</style>
