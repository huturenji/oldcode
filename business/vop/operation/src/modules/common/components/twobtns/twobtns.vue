<template>
    <div class="btsStyle">
        <Button
            v-if="hasAuthLeftBtn"
            :class="currentType.leftStyle"
            @click="leftClick"
        >{{ currentType.leftTxt }}</Button>
        <Button
            v-if="hasAuthRightBtn"
            :class="currentType.rightStyle"
            @click="rightClick"
        >{{ currentType.rightTxt }}</Button>
    </div>
</template>

<script>
import utils from "bislibs/utils";
export default {
    props: {
        type: {
            type: String,
            default: "query"
        }
    },
    data() {
        return {
            typeMap: {
                query: {
                    leftStyle: "typeQueryLeftStyle",
                    leftTxt: "查询",
                    rightStyle: "typeQueryRightStyle",
                    rightTxt: "重置"
                },
                detail: {
                    leftStyle: "typeDetailLeftStyle",
                    leftTxt: "停用",
                    rightStyle: "typeDetailRightStyle",
                    rightTxt: "编辑"
                },
                detail2: {
                    leftStyle: "typeDetailLeftStyle",
                    leftTxt: "启用",
                    rightStyle: "typeDetailRightStyle",
                    rightTxt: "编辑"
                },
                edit: {
                    leftStyle: "typeDetailRightStyle",
                    leftTxt: "保存",
                    rightStyle: "typeQueryRightStyle",
                    rightTxt: "取消"
                },
                report: {
                    leftStyle: "typeDetailLeftStyle",
                    leftTxt: "下架",
                    rightStyle: "typeDetailRightStyle",
                    rightTxt: "拒绝处理"
                },
                reportBatch: {
                    leftStyle: "typeDetailLeftStyle",
                    leftTxt: "批量下架",
                    rightStyle: "typeDetailRightStyle",
                    rightTxt: "拒绝处理"
                }
            },
            currentType: {}
        };
    },
    computed: {
        hasAuthLeftBtn() {
            if (this.$route.path == "/page/supplierDetail") {
                return utils.hasAuth("seteSupplierState"); //
            } else if (this.$route.path == "/page/channelDetail") {
                return utils.hasAuth("setChannelState"); //
            } else if (this.$route.path == "/page/websiteDetail") {
                return utils.hasAuth("setIndustrySiteState"); //
            } else if (this.$route.path == "/page/reportDetail") {
                return utils.hasAuth("removeArticle");
            } 
            return true;
            
        },
        hasAuthRightBtn() {
            if (this.$route.path == "/page/supplierDetail") {
                return utils.hasAuth("updateSupplier"); //
            } else if (this.$route.path == "/page/channelDetail") {
                return utils.hasAuth("updateChannel"); //
            } else if (this.$route.path == "/page/websiteDetail") {
                return utils.hasAuth("updateIndustrySite"); //
            } else if (this.$route.path == "/page/reportDetail") {
                return utils.hasAuth("refuseArticle");
            } 
            return true;
            
        }
    },
    watch: {
        /**
         * 动态刷新type类型
         */
        type() {
            this.currentType = this.typeMap[this.type];
        }
    },
    created() {},
    mounted() {
        this.currentType = this.typeMap[this.type];
    },
    methods: {
        rightClick() {
            this.$emit("onRightClick");
        },
        leftClick() {
            this.$emit("onLeftClick");
        }
    }
};
</script>

<style scoped lang="less">
.btsStyle {
    display: flex;
    justify-content: center;
    width: fit-content;
    .typeQueryLeftStyle {
        background: #000000;
        color: white;
        width: 91px;
        margin: 0 15px;
        font-size: 14px;
        padding: 3px;
        height: fit-content;
    }
    .typeQueryRightStyle {
        width: 91px;
        margin: 0 15px;
        padding: 3px;
        height: fit-content;
        font-size: 14px;
    }
    .typeDetailLeftStyle {
        width: 91px;
        margin: 0 15px;
        font-size: 14px;
        padding: 3px;
        height: fit-content;
        background: #ff6633;
        color: white;
    }
    .typeDetailRightStyle {
        background: #478aee;
        color: white;
        width: 91px;
        padding: 3px;
        height: fit-content;
        margin: 0 15px;
        font-size: 14px;
    }
}
</style>