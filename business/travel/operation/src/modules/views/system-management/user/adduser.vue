<template>
    <div class="adduser">
        <div v-if="checkAuth('seeUserInfos')">
            <el-row>
                <el-col :span="24">
                    <el-table
                        stripe
                        :header-cell-style="{background:'#f2f2f2',color:'#666666'}"
                        style="width: 100%;border: 1px solid #EBEEF5;border-bottom:0;border-radius: 8px;color:#333333"
                        :data="tableData"
                        empty-text="暂无数据,请新增成员"
                    >
                        <el-table-column prop="userName" label="姓名" width="150"></el-table-column>
                        <el-table-column prop="account" label="账号" width="150"></el-table-column>
                        <el-table-column 
                            prop="roleLists" 
                            label="角色" 
                            label-class-name = "roleadd">
                            <template slot-scope="scope" >
                                <el-checkbox-group v-model="scope.row.checkroleLists">
                                    <el-checkbox
                                        v-for=" role in roleLists"
                                        :label="role.value"
                                        :key="role.value"
                                    >
                                        <el-tooltip 
                                            class="item" 
                                            effect="dark" 
                                            :content="role.text" 
                                            placement="top">
                                            <span >{{ role.text }}</span>
                                        </el-tooltip>
                                    </el-checkbox>
                                </el-checkbox-group>
                            </template>
                        </el-table-column>
                        <el-table-column prop="" label="操作" width="75px">
                            <template slot-scope="scope">
                                <el-button @click="deleteuser(scope.$index,scope.row.userId)" type="text">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-col>
                <el-col :span="24">
                    <div class="add" v-show="tableData.length<10">
                        <el-button type="text" @click="showAddDialogVisible">+新增成员</el-button>
                    </div>
                </el-col>
               

               
            </el-row>
            <div class="btnsbox">
                <el-button type="primary" :loading="isBtnLoading" @click="adduserInfo">保存</el-button>
                <el-button @click="cancelAdd">取消</el-button>
            </div>
            <el-dialog
                title="选择人员"
                :close-on-press-escape="false"
                :close-on-click-modal="false"
                :modal-append-to-body="false"
                :visible.sync="addDialogVisible"
                width="784px"
                custom-class="adduserdialog"
                center
            >
                <div class="seclctuser">
                    <div class="left">
                        <span class="ttile">联系人<b>(一次最多可以选择10个联系人)</b></span>
                        <div class="check padding">
                            <el-input 
                                placeholder="请输入姓名/帐号"
                                @keyup.enter.native="searchList(searkey)" 
                                clearable 
                                style="width:280px"
                                v-model.trim="searkey">
                                <el-button
                                    slot="append" 
                                    icon="el-icon-search" 
                                    @click="searchList(searkey)"
                                ></el-button>
                            </el-input>

                            <div class="alluser" >
                                <el-checkbox-group
                                    :max="existence"
                                    v-infinite-scroll="load"
                                    infinite-scroll-disabled="disabled"
                                    v-model="checkList"
                                    @change="checckPerson"
                                >
                                    <el-checkbox
                                        v-for="(item ) in allUser"
                                        :key="item.userId"
                                        :label="item.userId"
                                        :disabled="item.opsUser"
                                    >
                                        <strong>{{ item.userName }}</strong>
                                        <strong>{{ item.account }}</strong>
                                    </el-checkbox>
                                </el-checkbox-group>
                                <p v-if="loading">加载中...</p>
                                <p v-if="!loading && emptyRes && sotals!==0">没有更多了</p>
                                <p v-if="!loading && sotals==0">暂无数据</p>
                            </div>
                        </div>
                    </div>
                    <div class="right ">
                        <span class="ttile">
                            已选择
                            <b>{{ seletcPerson.length }} </b><b>/ 10人</b>
                        </span>
                        <ul class="check padding">
                            <li v-for="(user,index) in seletcPerson" :key="index">
                                <span class="showomfp">{{ user.userName }}</span>
                                <span class="showomfp">{{ user.account }}</span>
                                <i @click="deluser(user.userId)" class="iconclose"></i>
                            </li>
                        </ul>
                    </div>
                </div>

                <span slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="addList">保存</el-button>
                    <el-button @click="addcencel">取 消</el-button>
                </span>
            </el-dialog>
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
                <span class="cancelBtn" @click="goHomePage">×</span>
            </div>
            <div class="inconContent">
                <p>暂无使用权限，如有需要请联系管理员开通</p>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="goHomePage">我知道了</el-button>
            </div>
        </el-dialog>
        <el-dialog
            :modal-append-to-body="false"
            :visible.sync="errorRole"
            :close-on-click-modal="false" 
            :show-close="false"
            customClass="noAuth"
            width="485px"
            center>
            <div slot="title" class="header-title">
                <span class="cancelBtn" @click="updateRole">×</span>
            </div>
            <div class="inconContent">
                <p>您选择的部分角色信息不存在</p>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="updateRole">确定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import tmHandler from "bislibs/requesthandler/traveloperationhandler.js";
import utils from "bislibs/utils";
import permissionManager from 'bislibs/permissionhandler/eventlistenerhandler'
import {
    removedDuplicate,
    filterCommonData,
    getArrEqual
} from "../utils/utils.js";
export default {
    data() {
        return {
            isBtnLoading: false,
            searkey: "",
            checkList: [],
            seletcPerson: [],
            allUser: [],
            curnum: 1,
            loading: true,
            emptyRes: false,
            sotals: 0,
            addDialogVisible: false,
            tableData: [],
            roleLists: [],
            noAuth: false,
            tempDate: [],
            count: 0,
            existence: 0,
            noChecked: [],
            errorRole: false
        };
    },
    created() {
        if (this.checkAuth("seeUserInfos")) {
            this.showAddDialogVisible();
        } else {
            this.noAuth = true;
        }
    },
    computed: {
        disabled() {
            return this.loading || this.emptyRes;
        }
    },
    mounted() {},
    methods: {
        checkAuth(id){
            return permissionManager.hasAuth(id)
        },
        // 获取所有企业用户
        searchCompanyUsers() {
            let params = {
                pageIndex: this.curnum,
                pageSize: 20,
                keyword: this.searkey || null
            };
            
            tmHandler.searchCompanyUser(params).then(
                res => {
                    if (res.resultCode == 0) {
                        this.sotals = res.result.resultCount;
                        res.result.companyUserList.forEach(element => {
                            this.allUser.push(element); //所有人员集合
                            this.tempDate.push(element); //接口获取所有数据的缓存  -> 用户选择人员的回显
                        });
                        this.emptyRes =
                            res.result.companyUserList.length == 0
                                ? true
                                : false; //判断是否没有数据了
                        res.result.companyUserList;
                        this.tempDate = removedDuplicate(
                            this.tempDate,
                            "userId"
                        );
                        this.checkList = this.tempDate //checkbox的v-model  筛选已添加的人
                            .filter(item => {
                                return item.opsUser; //过滤掉opsUser为false的数据,已添加人员勾选且disabled
                            })
                            .map(item => {
                                return item.userId;
                            });
                        this.existence = this.checkList.length + 10; //已添加人员数量 +10= checkMax
                        if (this.seletcPerson.length) {
                            //已经用户选择人员的回显
                            this.seletcPerson.forEach(item => {
                                this.checkList.push(item.userId);
                            });
                        }
                        this.noChecked = this.tempDate //返回偶有数据中没有添加的人员
                            .filter(item => {
                                return !item.opsUser;
                            })
                            .map(item => {
                                return item.userId;
                            });
                        this.loading = false;
                    }
                }
            );
        },
        searchList() {
            //模糊检索
            this.loading = true;
            this.curnum = 1;
            this.allUser = [];
            this.searchCompanyUsers();
        },
        // 获取所有角色
        getAllRole() {
            tmHandler.listRole().then(res => {
                if (res.resultCode == 0) {
                    this.roleLists = res.result.roleDetailVos.map(item => {
                        return {
                            text: item.roleName,
                            value: item.roleId
                        };
                    });
                }
            });
        },
        // 打开新增成员弹框
        showAddDialogVisible() {
            this.searchList();
            setTimeout(() => {
                this.addDialogVisible = true;
            }, 500);
        },
        // 选择联系人
        checckPerson(val) {
            let arr = [];
            arr = getArrEqual(this.noChecked, val); //checkbox的vm值 == 已选择人员  和未添加的几个取交集   就是新添加的人员
            //所有人员集合去重
            let temp = [];
            temp = filterCommonData(this.tempDate, arr); //新添加人员   和所有人对比   取到name  account信息
            this.seletcPerson = temp.map(item => {
                return {
                    userName: item.userName,
                    account: item.account,
                    userId: item.userId
                };
            });
        },
        //删除已选人员
        deluser(val) {
            // 数组的元素type不同 string / object
            this.checkList.forEach((item, index, arr) => {
                if (item == val) {
                    arr.splice(index, 1);
                }
            });
            // 已选择人员数据更细
            this.seletcPerson.forEach((item, index, arr) => {
                if (item.userId == val) {
                    arr.splice(index, 1);
                }
            });
            // 表格数据更新
            this.tableData.forEach((item, index, arr) => {
                if (item.userId == val) {
                    arr.splice(index, 1);
                }
            });
        },
        //弹框   添加人员到页面
        addList() {
            let that = this;
            if (this.seletcPerson.length > 10) {
                utils.showToast("最多添加10个人");
                return;
            }
            if (this.seletcPerson.length == 0) {
                utils.showToast("请选择人员");
                return;
            }
            this.getAllRole(); //获取最新的角色信息
            if (this.tableData.length > 0) {
                // 循环表格list和已选择人员list 根据userid判断对用的角色信息
                this.tableData.forEach(item1 => {
                    this.seletcPerson.forEach(item2 => {
                        if (item2.userId == item1.userId) {
                            item2.checkroleLists = item1.checkroleLists;
                        }
                    });
                });
            }
            // 处理tableData 过滤掉多余的字段
            this.tableData = this.seletcPerson.map(item => {
                return {
                    userName: item.userName,
                    account: item.account,
                    userId: item.userId,
                    checkroleLists: item.checkroleLists || []
                };
            });
            // 数据重置
            this.allUser.length = 0;
            this.searkey = null;
            this.loading = true;
            this.emptyRes = false;
            this.addDialogVisible = false;
        },
        //保存列表人员
        adduserInfo() {
            let that = this;
            if (this.tableData.length > 0) {
                let params = {};
                params.userBriefVoList = this.tableData.map(item => {
                    return {
                        userId: item.userId,
                        roleIds: item.checkroleLists
                    };
                });
                this.isBtnLoading = true;
                tmHandler.addUser(params).then(res => {
                    this.isBtnLoading = false;
                    if (res.resultCode == 0) {
                        utils.showToast("添加成功");
                        this.cancelAdd();
                    } else if (res.resultCode == 80117001) {
                        //这个判断是对应选择的角色被其他人删除的时候错误
                        this.errorRole = true;
                    }
                }).catch((e) => {
                    this.isBtnLoading = false;
                });
            } else {
                utils.showToast("请选择人员");
            }
        },
        //删除列表人员  表格数据和弹框数据统一
        deleteuser(val, userId) {
            // 删除之后角色信息重置  避免再次添加的时候数据缓存
            this.tableData[val].checkroleLists = [];
            // 删除选中的一行
            this.tableData.splice(val, 1);
            // 更新已选择的人员list
            this.seletcPerson = this.tableData.map(item => {
                return {
                    userName: item.userName,
                    account: item.account,
                    userId: item.userId
                };
            });
            // 根据userid判断是哪一个在进行删除
            this.checkList.forEach((item, index, arr) => {
                if (userId == item) {
                    arr.splice(index, 1);
                }
            });
        },
        // 关闭选择人员弹框
        addcencel() {
            this.addDialogVisible = false;
            this.allUser.length = 0;
            this.searkey = null;
            this.loading = true;
            this.emptyRes = false;
        },
        // 取消按钮,返回上一页
        cancelAdd() {
            this.$router.push("/sysmgr/user");
        },
        load() {
            this.loading = true;
            setTimeout(() => {
                this.curnum += 1;
                this.searchCompanyUsers();
            }, 300);
        },
        //   更新角色信息
        updateRole() {
            this.getAllRole();
            setTimeout(() => {
                // 返回所有角色的value字段
                let arr = this.roleLists.map(item => {
                    return item.value;
                });
                // 当角色value字段法伤变化的时候  跟新 this.tableData里面的角色数据
                this.tableData.forEach(item => {
                    item.checkroleLists.forEach((ros, rosin) => {
                        if (!arr.includes(ros)) {
                            item.checkroleLists.splice(rosin, 1);
                        }
                    });
                });
                this.errorRole = false;
            }, 300);
        },
        goHomePage() {
            this.noAuth = false;
        }
    }
};
</script>

<style scoped lang="less">
.adduser {
    border-radius: 6px;

    .add {
        text-align: center;
        border: 1px dashed #ccc;
        border-radius: 6px;
        margin-top: 16px;
    }

    .seclctuser {
        display: flex;
        .left,
        .right {
            flex: 1;

            border: 1px solid #ccc;
            border-radius: 6px;
            .ttile {
                display: block;
                line-height: 40px;
                padding-left: 24px;
                font-weight: 600;
                box-sizing: border-box;
                font-size: 14px;
                background: rgba(248, 248, 248, 1);
                border-radius: 4px 4px 0px 0px;
                color: #666666;
                b {
                    font-size: 12px;
                    font-weight: 400;
                    color: #666666;
                }
            }
        }
        .right {
            margin-left: 16px;
            .ttile {
                b {
                    font-weight: 600;
                }
                b:nth-child(1) {
                    color: #478aee;
                }
            }
        }
        .check {
            height: 340px;

            border-top: 0;
            margin: 0;
            li {
                list-style: none;
                margin: 12px 10px 12px 30px;
                .showomfp {
                    color: #333333;
                    display: inline-block;
                    background-color: #fff;
                    padding-left: 0;
                    line-height: 20px;
                    height: 20px;
                    &:nth-child(1) {
                        width: 80px;
                    }
                    &:nth-child(2) {
                        width: 150px;
                    }
                }
            }
        }

        .alluser {
            height: 270px;
            overflow: auto;
            p {
                text-align: center;
                font-size: 14px;
                color: #333333;
            }
            strong {
                width: 80px;
                font-weight: normal;
                display: inline-block;
            }
        }
    }
    .iconclose {
        cursor: pointer;
        vertical-align: middle;
        border-radius: 50%;
        width: 16px;
        height: 16px;
        display: inline-block;

        background: no-repeat center
            url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAACQUlEQVRYR82XT2gTURDGvy+7STexDZQiSBH0IB4Evfnn2LSKtgfBgycviRTEgBevYikVr16KEURoL548CIJa8E/rLdCTCILiQUGKIFJMNNkmuzvyErKkdZPutivPXDPzzW9n3pt5Q4T8yezFlPNlPUe65+HhiICjpIwqdxGuEbKGBN6LGE/MA8PLnH3UCCPN7YykOLXPrdszEFwSSHY7e/U/wQqIh0bammPp2bd+Pj0B5NrkgFNt3CDkukD2hAm81YbgbwHvmEOp25x/vhGkEQigvtqp1R8DOLWTwAE+ZTOTvhCUjb8AZHrimOt6T0WwP6bgLRkSXw0xprj48l237iaAdr3rq3EH7wRsQaTTx7sz4QO0a26vxJj2Xgksm0PWWOdM+ADN/MQc4N2MM+29tRK3kouvZto3Rt1jlfqa/Wmnpz0qtLodRsY6pErRAnAK4yURuRpVaDf2JO+ZC6+LVB3O/fzje9gms5ugm08/K8bBkb1sFk6fhbhLcQlH0qFxjs7l3F3xUIzkGJMxEyjRyeeWBRiLSTOSDIEVNvPjHwA53NMzOwyezAHVn5HEkUxB3paBynofP36kU8hVRTAYaJVMwby/BNmwAc+NBkCCVgbO9BnADfYl8as/gGHAfPACYtfU0I8GkDDAAQvOlUmgETgI1XyohivB0ROA04wGMJiFrL4JUQLdh1D7NdTeiLS3Yu3D6L8YxwpC64OklQXdTzK/FLoepZ02p/VZ7kPoXEx8CJ2rWffU0bacbh19/2o9/wMbXEjfE4Zn0QAAAABJRU5ErkJggg==);
        background-size: 100%;
    }
}
</style>
<style lang="less" >
.adduser {
    .el-table--striped .el-table__body tr.el-table__row--striped td {
        background-color: #f8f8f8;
    }
    .el-checkbox__label {
        color: #333333;
    }
    .el-checkbox__inner {
        width: 16px;
        height: 16px;
    }
    .el-checkbox__inner::after {
        height: 8px;
        left: 6px;
    }
    .el-button--text {
        color: #fb6041;
        &:hover {
            text-decoration: underline;
        }
    }
    .el-table td {
        border-bottom: 0;
    }
    .el-row {
        padding: 32px 24px;
        border-radius: 8px;
        background-color: #fff;
    }
    .el-col {
        &:nth-child(1) {
            .el-checkbox {
                .el-checkbox__label {
                    width: 80px;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    vertical-align: text-bottom;
                    padding-left: 8px;
                }
            }
            .el-table th {
                padding: 6px 0;
            }
        }
    }
    .btnsbox {
        margin: 40px 0;
        text-align: center;
        .el-button {
            width: 144px;
            height: 48px;
            margin-right: 14px;
            border-radius: 8px;
            &:hover {
                background-color: #478aee;
                border-color: #478aee;
                opacity: 0.8;
            }
            &:first-child {
                background-color: #478aee;
                border-color: #478aee;
            }
        }
        .el-button--default {
            background-color: #c2c2c2;
            border-color: #c2c2c2;
            color: #fff;
        }
    }
    .el-input__inner {
        height: 36px;
        line-height: 36px;
    }
    .seclctuser {
        .el-checkbox-group {
            padding-left: 24px;
        }

        .check,
        .right {
            overflow: hidden;
            .el-checkbox {
                display: block;
                margin: 10px 0;
            }
        }
        .el-icon-close {
            color: red;
            cursor: pointer;
            float: right;
        }
        .el-input {
            margin: 16px 24px 16px 24px;
        }
        .el-checkbox__inner {
            width: 16px;
            height: 16px;
            margin: 6px;
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
        .is-disabled {
            .el-checkbox__inner {
                background-color: #f2f6fc;
            }
            .el-checkbox__label {
                color: #c0c4cc;
            }
        }
        .el-checkbox__inner::after {
            top: 2px;
            left: 6px;
            height: 6px;
        }
        .left {
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
            }
            .el-button {
                width: 41px;
                padding: 12px 10px;
            }
        }
    }
    .el-table .cell {
        overflow: visible;
    }
    .add {
        .el-button--text {
            color: #478aee;
            height: 38px;
            &:hover {
                opacity: 0.8;
                text-decoration: none;
            }
        }
    }
}
.adduserdialog {
    margin-top: 0 !important;
    margin: 0 auto !important; /*水平居中*/
    position: absolute !important;
    left: 50%;
    top: 50%;
    border-radius: 8px !important;
    transform: translate(-50%, -50%);
    .el-dialog__header {
        padding: 20px 20px 10px;
        height: 25px;
    }
    .el-dialog__body {
        text-align: initial;
        padding: 32px 56px 0 !important;
    }
    .el-dialog__title {
        font-weight: bold;
        font-size: 16px;
        color: #333333;
    }
    .el-dialog__footer {
        padding: 40px 0;
        .el-button--primary {
            background-color: #478aee;
            border-color: #478aee;
            margin-right: 14px;
        }
        .el-button--default {
            background-color: #c2c2c2;
            border-color: #c2c2c2;
        }
        .el-button {
            color: #fff;
            width: 144px;
            font-size: 14px;
            height: 48px;
            border-radius: 8px;
            transition: none;
            &:hover {
                background-color: #478aee;
                border-color: #478aee;
                opacity: 0.8;
            }
        }
    }
}
</style>
