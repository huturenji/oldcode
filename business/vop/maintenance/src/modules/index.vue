<template>
    <div>
        <div class="header">
            <div class="mainbg">
                <titlebar
                    :websitename="sitename"
                    :userinfo="userinfo"
                    @acceptevent="actionopen"
                />
            </div>
        </div>
        <div class="channerMgrBox">
            <breadcrumb></breadcrumb>
            <div class="loading-area">
                <keep-alive>
                    <router-view
                        v-if="$route.meta.keepAlive"
                        class="child-view"
                    ></router-view>
                </keep-alive>
                <router-view
                    v-if="!$route.meta.keepAlive"
                    class="child-view"
                ></router-view>
            </div>
        </div>
    </div>
</template>

<script>
import titlebar from "components/navigationbar/navigationbar";
import breadcrumb from "biscomponents/breadcrumb/breadcrumb.vue";

export default {
    name: "Index",
    components: {
        titlebar,
        breadcrumb
    },
    data() {
        return {
            sitename: "B+商城VOP运维配置",
            userinfo: null
        };
    },
    mounted() {
        this.getHeaderInfo();
    },
    methods: {
        actionopen(theEvent) {
            if (theEvent.name == "quit") {
                Vue.prototype.$keycloak && Vue.prototype.$keycloak.logoutFn();
            }
        },
        getHeaderInfo() {
            this.userinfo = {
                username:
                    (Vue.prototype.$keycloak &&
                        Vue.prototype.$keycloak.tokenParsed.given_name) ||
                    "尊敬的管理员",
                userID:
                    (Vue.prototype.$keycloak &&
                        Vue.prototype.$keycloak.tokenParsed.sub) ||
                    ""
            }
        }
    }
};
</script>
<style lang="less">
// @import "~styles/common.less";
.header {
    background: #478aee;
    .mainbg {
        width: 1280px;
        margin: 0 auto;
    }
}
.channerMgrBox {
    width: 1280px;
    margin: 0 auto;
    .el-table {
        border-radius: 8px;
        .el-button--text :hover {
            text-decoration: underline;
        }
    }
    .el-pagination.is-background .el-pager li:not(.disabled).active {
        background-color: #478aee !important;
    }
    // .el-pagination.is-background .el-pager li:not(.disabled):hover {
    //     color: #478aee !important;
    // }
}
.el-textarea .el-input__count {
    background: rgba(255, 255, 255, 0.1);
}
.el-loading-spinner {
    position: fixed !important;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    margin-top: 0 !important;
}
/* 定义滚动条 */
::-webkit-scrollbar {
    width: 7px;
    height: 7px;
    border-radius: 10px;
}
::-webkit-scrollbar-track {
    background-color: #fff;
}
::-webkit-scrollbar-thumb {
    width: 7px;
    height: 7px;
    border-radius: 10px;
    background-color: #ccc;
}
::-webkit-scrollbar-thumb:hover {
    background-color: #999;
}
table tr td:first-child .cell {
    padding-left: 32px;
}
table tr th:first-child .cell {
    padding-left: 32px;
}
table tr td:last-child .cell {
    padding-right: 32px;
}
table tr th:last-child .cell {
    padding-right: 32px;
}
.el-dialog {
    margin: 0 !important;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}
.el-dialog__wrapper {
    .el-dialog {
        border-radius: 8px;
        .el-dialog__header {
            overflow: hidden;
            padding: 0;
            border-bottom: 1px solid #efefef;
            .header-title {
                position: relative;
                .confirmTitle {
                    font-size: 16px;
                    color: #333;
                    font-weight: bold;
                    line-height: 56px;
                }
                .cancelBtn {
                    position: absolute;
                    right: 15px;
                    top: 6px;
                    font-size: 24px;
                    color: #999;
                    cursor: pointer;
                }
                .cancelBtn:hover {
                    color: #409eff;
                }
            }
        }
        .el-dialog__body {
            padding: 32px 25px;
            color: #333;
            .inconContent {
                p {
                    font-size: 16px;
                    text-align: center;
                }
            }
        }
        .el-dialog__footer {
            padding: 0 20px 48px;
            .el-button {
                font-size: 16px;
                width: 144px;
                height: 48px;
                border-radius: 8px;
            }
        }
    }
}
.el-textarea__inner {
    font-family: auto;
}
</style>

