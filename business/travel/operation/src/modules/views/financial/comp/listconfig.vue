<template>
    <div class="StatisticsListConfig">
        <div class="configHeader">
            <div class="showMore cursorp" @click="showMore">
                <span v-if="showMoreConfition">
                    项目配置
                    <img src="~assets//icon_tab_up.png" />
                </span>
                <span v-else>
                    项目配置
                    <img src="~assets//icon_tab_down.png" />
                </span>
            </div>
            <div class="operation">
                <div>
                    <span>共</span>
                    <span class="countStyle">{{listCount}}</span>
                    <span>条记录</span>
                </div>
                <div v-if="exporting" class="exportBtn">正在导出Excel</div>
                <div v-else class="exportBtn cursorp" @click="exportExcel">导出至excel</div>
            </div>
        </div>
        <div v-show="showMoreConfition" class="checkContent">
            <div>
                <span class="checkall">请选择您需要查看的项目类型</span>
                <label
                    :class="{'customboxCheck':isSelectAll,'customboxNoCheck':!isSelectAll}"
                    @click.stop="selectAll"
                >
                    <div class="imgDiv" />
                    全选
                </label>
            </div>
            <div class="checkFlows">
                <label
                    :class="{'customboxCheck':isSelectCheckItem(checkItem),'customboxNoCheck':!isSelectCheckItem(checkItem)}"
                    @click.stop="selectCheckItem(checkItem)"
                    v-for="checkItem in Conditions"
                    :key="checkItem"
                >
                    <div class="imgDiv" />
                    {{checkItem}}
                </label>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: ["Conditions", "CachedConditions", "listCount", "exporting"],
    directives: {
        // TransferDom
    },
    components: {
        // Popup,
        // XDialog,
        // Popover
    },
    data() {
        return {
            showMoreConfition: false, //伸缩效果
            isSelectAll: false, //是否全选
            selectedList: [] //被选中的项目数组
        };
    },
    created() {},
    mounted() {
        this.initPageData();
    },

    watch: {
        CachedConditions: {
            handler(val, oldVal) {
                let that = this; //
                if (val != oldVal && val && val.length > 0) {
                    that.selectCachedList();
                } else {
                    //默认选中所有的选项
                    that.selectAll();
                }
            },
            deep: true,
            immediate: true
        }
    },
    methods: {
        /**
         * 页面初始化动作
         */
        initPageData() {
            //默认展开
            this.showMore();
        },
        /**
         * 展开或者收缩 复杂条件
         */
        showMore() {
            let that = this;
            that.showMoreConfition = !that.showMoreConfition;
        },
        /**
         * 导出Excel
         */
        exportExcel() {
            const that = this;
            that.$emit("onExportClick");
        },
        /**
         * 选中缓存的条件
         */
        selectCachedList() {
            //先清空，然后全部添加进去。
            this.selectedList.splice(0, this.selectedList.length);
            //默认选中缓存条件
            this.CachedConditions.forEach(element => {
                this.selectedList.push(element);
            });
            if (this.selectedList.length == this.Conditions.length) {
                 this.isSelectAll = true;
            }
            this.commitSelectList();
        },
        /**
         * 全选或取消全选
         */
        selectAll() {
            this.isSelectAll = !this.isSelectAll;

            //先清空，然后全部添加进去。
            this.selectedList.splice(0, this.selectedList.length);
            if (this.isSelectAll) {
                this.Conditions.forEach(element => {
                    this.selectedList.push(element);
                });
            }

            this.commitSelectList();
        },
        /**
         * 选中某一个条件
         */
        selectCheckItem(item) {
            let index = this.selectedList.indexOf(item);
            if (index == -1) {
                this.selectedList.push(item);
                if (this.selectedList.length == this.Conditions.length) {
                    this.isSelectAll = true;
                }
            } else {
                this.selectedList.splice(index, 1);
                this.isSelectAll = false;
            }
            this.commitSelectList();
        },
        /**
         * 某一个条件是否被选中
         */
        isSelectCheckItem(item) {
            return this.selectedList.indexOf(item) != -1;
        },
        /**
         * 将选择列表传出去
         */
        commitSelectList() {
            this.$emit("onSelected", this.selectedList);
        }
    }
};
</script>
<style scoped lang="less">
.StatisticsListConfig {
    padding: 0px 32px;
    width: 100%;
    background: white;
    .configHeader {
        display: flex;
        justify-content: space-between;
        margin-bottom: 5px;
        padding: 0 5px;
        .showMore {
            // margin-top: 16px;
            // height: 30px;
            // line-height: 30px;
            span {
                color: #333333;
            }
            img {
                margin-left: 5px;
                width: 10px;
                vertical-align: middle;
            }
        }
        .operation {
            display: flex;
            align-items: baseline;
            color: #333333;
            .countStyle {
                color: #478aee;
            }
            .exportBtn {
                width: fit-content;
                background: #478aee;
                color: white;
                border: solid #478aee 1px;
                border-radius: 2px;
                font-size: 12px;
                padding: 2px 10px;
                margin-left: 10px;
            }
        }
    }
    .checkContent {
        margin-bottom: 10px;
        border: #e2e2e2 solid 1px;
        padding: 5px 10px;
        border-radius: 4px;
        .checkall {
            margin-right: 10px;
        }
        .customboxCheck {
            margin: 10px 33px 0 0;
            color: #478aee;
            display: flex;
            align-items: center;
            .imgDiv {
                margin-right: 5px;
                height: 16px;
                width: 16px;
                background: url(~assets//icon_check.png);
            }
        }
        .customboxNoCheck {
            margin: 10px 33px 0 0;
            color: #333333;
            display: flex;
            align-items: center;
            .imgDiv {
                margin-right: 5px;
                height: 16px;
                width: 16px;
                background: url(~assets//icon_uncheck.png);
            }
        }
        .checkFlows {
            display: flex;
            flex-wrap: wrap;
        }
    }
}
</style>

