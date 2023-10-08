<template>
    <div>
        <transition :name="transitionName">
            <router-view
                class="child-view"
                v-if="$route.meta.needAnimation"
            ></router-view>
        </transition>
        <router-view
            class="child-view"
            v-if="!$route.meta.needAnimation"
        ></router-view>
    </div>
</template>

<script>
import eventlistenerhandler from "bislibs/utils";
export default {
    name: "Homepage",
    data() {
        return {
            transitionName: "slide-left"
        };
    },
    components: {},
    watch: {},
    created() {},
    mounted() {
        //全局监听事件
        eventlistenerhandler.addEventListenerGlobal(this);
    },
    methods: {}
};
</script>

<style lang="less">
html {
    height: 100%;
    font-size: 10000/750vw;
}

body {
    margin: 0px;
    padding: 0px;
    height: 100%;
    background-size: cover;
    -webkit-background-size: cover;
    -moz-background-size: cover;
    -o-background-size: cover;
    font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB,
        Microsoft YaHei, SimSun, sans-serif;
    font-size: 14px;
    -webkit-font-smoothing: antialiased;
    touch-action: none;
}

.child-view {
    position: fixed;
    width: 100%;
    height: 100%;
    transition: all 0.3s;
    -moz-transition: all 0.3s;
    -webkit-transition: all 0.3s;
    -o-transition: all 0.3s;
    backface-visibility: hidden;
    perspective: 1000;
    background: #f2f3f5;
    max-width: auto;
}

.slide-right-enter {
    opacity: 0;
    transform: translate(-100%, 0);
}

.slide-right-leave-active {
    opacity: 0;
    /*transform: translate(100%, 0);*/
}

.slide-left-enter {
    opacity: 0;
    transform: translate(100%, 0);
}

.slide-left-leave-active {
    opacity: 0;
    /*transform: translate(-100%, 0);*/
}

.zindexNone {
    z-index: -1 !important;
}
//二次确认公共样式
.el-dialog__wrapper {
    .noAuth {
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
                width: 144px;
                height: 48px;
                border-radius: 8px;
                &:hover {
                    background-color: #478aee;
                    border: 1px solid #478aee;
                    opacity: 0.8;
                }
            }
            .el-button--primary {
                background-color: #478aee;
                border: 1px solid #478aee;
            }
            .el-button--default {
                color: #fff;
                background-color: #c2c2c2;
                border: 1px solid #c2c2c2;
            }
        }
    }
}
//公共的表格组件下拉框样式
.el-table-filter__list-item.is-active {
    background-color: #478aee;
}
.el-table-filter__list-item {
    color: #333333;
    &:hover {
        color: #fff;
        background-color: #478aee;
    }
}
.el-table-filter__list {
    max-height: 300px;
    overflow: auto;
    width: 165px;
}
.el-date-editor .el-range-separator {
    padding: 0 15px 0 4px !important;
    line-height: 28px !important;
}
</style>