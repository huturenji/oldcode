<template>
    <div class="usermange" id="usermangeBox">
        <div v-if="checkAuth('seeUserInfos')">
            <el-row>
                <el-col :span="24">
                    <el-input 
                        clearable 
                        v-model.trim="searchkey" 
                        @keyup.enter.native="searcList" 
                        placeholder="请输入姓名/账号"  
                    >
                        <template slot="append">
                            <el-button @click="searcList" icon="el-icon-search"></el-button>
                        </template>
                    </el-input>
                </el-col>
                <el-col :span="24" v-if="checkAuth('addUser')">
                    <el-button type="primary" @click="adduser">添加人员</el-button>
                </el-col>
            </el-row>
            <el-table
                :data="userList"
                stripe
                :highlight-current-row="true"
                @filter-change="filterChange"
                :header-cell-style="{background:'#f2f2f2',color:'#666666'}"
                style="width: 100%;border: 1px solid #EBEEF5;border-bottom:0;border-radius: 8px;;color:#333333">
                <el-table-column prop="account" label="账号" width="200px"></el-table-column>
                <el-table-column prop="userName" label="姓名" width="150px"></el-table-column>
                <el-table-column prop="phone" label="手机号码" width="150px">
                    <template slot-scope="scope">
                        <span style="padding-left:5px;">{{ scope.row.phone }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="email" label="邮箱" width="300px"></el-table-column>
                <el-table-column
                    label-class-name = "roleChange"
                    prop="allroleName"
                 
                    :label="roletTtle"
                    column-key="state"
                    :filters="deal"
                    :filter-multiple="false"
                >
                    <template slot-scope="scope">
                        <div class="roleId">    
                            <span class="roles" v-for="(rol,index) in scope.row.roles" :key="index">
                                <span v-show="index<scope.row.roles.length-1">{{ rol.roleName +"、" }}</span>
                                <span v-show="index==scope.row.roles.length-1">{{ rol.roleName }}</span>
                            </span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop width="75px" label="操作">
                    <template slot-scope="scope">
                        <el-button 
                            type="text"
                            v-if="checkAuth('seeUserInfos')" 
                            @click="gotouserdetails(scope.row.userId)"
                        >详情</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-col :span="24" class="pagebox">
                <el-pagination
                    background
                    v-show="totals>0"
                    @size-change="pSizeChange"
                    @current-change="changePage"
                    :current-page="currentPage"
                    :page-sizes="pageSizeOpt"
                    :page-size="pageSize"
                    layout="total, prev, pager, next, jumper,sizes"
                    :total="totals"
                ></el-pagination>
            </el-col>
        </div>
        <el-dialog
            :modal-append-to-body="false"
            :visible.sync="noAuth"
            :close-on-click-modal="false" 
            customClass="noAuth"
            :show-close="false"
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
import { pageSizeOpts } from "../utils/utils.js";
import permissionManager from 'bislibs/permissionhandler/eventlistenerhandler.js'
export default {
    data() {
        return {
            noAuth: false,
            userList: [],
            deal: [],
            searchkey: "",
            pageSizeOpt: pageSizeOpts || [],
            totals: 0,
            pageSize: 20,
            currentPage: 1,
            curroleId: null,
            roletTtle: "角色",
            flag: false //避免created和activated都会触发请求
        };
    },
    created() {
        if (this.checkAuth("seeUserInfos")
        ) {
            this.getAllRole();
            this.getUserList();
        } else {
            this.noAuth = true;
        }
    },
    mounted() {
        let _this = this;
        this.flag = true;
        _this.calHeight();
        window.onresize = function() {
            _this.calHeight();
        };
    },

    activated() {
        if (!this.flag) {
            this.getAllRole();
            this.getUserList();
        }
    },
    deactivated() {
        this.flag = false;
    },
    methods: {
        checkAuth(id){
            return permissionManager.hasAuth(id)
        },
        // 用户管理列表
        getUserList() {
            let params = {
                keyword: this.searchkey || null,
                pageIndex: this.currentPage,
                pageSize: this.pageSize,
                roleId: this.curroleId
            };
            let _this = this;
            _this.$iLoading.show();
            tmHandler.searchUser(params).then(res => {
                _this.$iLoading.hide();
                if (res.resultCode == 0) {
                    this.userList = res.result.userList;
                    this.totals = res.result.resultCount;
                }
            }).catch((e) => {
                _this.$iLoading.hide();
            });
        },
        // 所有角色
        getAllRole() {
            let _this = this;
            // _this.$iLoading.show();
            tmHandler.listRole({}).then(res => {
                // _this.$iLoading.hide();
                if (res.resultCode == 0) {
                    this.deal = res.result.roleDetailVos.map(item => {
                        return {
                            text: item.roleName,
                            value: item.roleId
                        };
                    });
                }
            }).catch((e) => {
                console.log(e)
                // _this.$iLoading.hide();
            });
        },
        // 角色筛选
        filterChange(filters) {
            this.currentPage = 1;
            this.curroleId = filters.state[0];
            let arr = this.deal.filter(item => {
                return item.value == filters.state[0];
            });
            this.roletTtle = arr.length > 0 ? arr[0].text : "角色";
            this.getUserList();
        },
        // 当前页码变化
        changePage(page) {
            this.currentPage = page;
            this.getUserList();
        },
        //每页显示条数变化
        pSizeChange: function(pSize) {
            this.currentPage = 1;
            this.pageSize = pSize;
            this.getUserList();
        },
        // 点击搜索
        searcList() {
            this.curroleId = "";
            this.currentPage = 1;
            this.getUserList();
        },
        // 添加人员
        adduser() {
            this.$router.push("/sysmgr/user/adduser");
        },
        // 详情
        gotouserdetails(userId) {
            this.$router.push({
                path: "/sysmgr/user/userdetails",
                query: {
                    userId
                }
            });
        },
        goHomePage() {
            this.noAuth = false;
        },
        calHeight() {
            var clientHeight = document.documentElement.clientHeight;

            var domHeight = clientHeight - 48 - 61 - 40 - 24 - 30 - 48;

            var tabelMaxHeight = domHeight - 40 - 98 - 36 - 20;
            // $("#usermangeBox .el-table__body-wrapper").css({
            //     "max-height": tabelMaxHeight + "px",
            //     "overflow-y": "auto"
            // });
            // $("#usermangeBox").css("height", domHeight + "px");
        }
    }
};
</script>
<style scoped lang="less">
.usermange {
    padding-top: 24px;
    background-color: #fff;
    .pagebox {
        margin-top: 24px;
        text-align: right;
        padding-right: 36px;
    }
    .roleId {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        word-break: break-all;
    }
}
</style>
<style  lang="less">
.roleChange {
    cursor: pointer;
}
.usermange {
    .el-col {
        &:nth-child(2) {
            text-align: right;
            margin: 16px 0 0;
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
        &:nth-child(1) {
            padding-left: 32px;
            .el-input {
                width: 320px;
            }
            .el-button {
                width: 41px;
                padding: 12px 10px;
            }
            .el-input__inner {
                height: 36px;
                line-height: 36px;
            }
        }
    }
    .el-input-group__append {
        color: #fff;
        background-color: #478aee;
        border: 1px solid #478aee;
    }
    .el-table {
        margin-top: 16px;
    }
    .el-table th {
        padding: 1px 0;
    }
    .el-table td {
        padding: 4px 0;
    }
    .el-input__inner {
        border-bottom-left-radius: 8px;
        border-top-left-radius: 8px;
    }
    .el-input-group__append {
        border-bottom-right-radius: 8px;
        border-top-right-radius: 8px;
    }
    .el-input-group__append {
        color: #fff;
        background-color: #478aee;
        border: 1px solid #478aee;
        &:hover {
            opacity: 0.8;
        }
    }
}

.el-table-filter__list-item.is-active {
    background-color: #478aee;
}
.el-table-filter__list-item {
    color: #333333;
    &:hover {
        color: #fff;
        background-color: #478aee;
        opacity: 0.2;
    }
}
.el-select-dropdown__item {
    color: #333333;
}
.el-select-dropdown__item.selected {
    color: #478aee;
}
.el-table-filter__list {
    max-height: 380px;
    overflow: auto;
}
</style>
