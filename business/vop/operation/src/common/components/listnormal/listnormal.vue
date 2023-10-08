<template>
    <div>
        <Table
            :columns="columnsDataInter"
            :data="listDataInter"
            :stripe="stripe"
            @on-selection-change="onSelectChange"
        >
            <template
                slot-scope="{ row, index }"
                slot="expend"
            >
                <div class="expendDiv">
                    <div
                        v-for="item in row.expendData.partOneArr"
                        :key="item"
                    >
                        {{ item }}
                    </div>
                    <div
                        v-if="expendMoreRecord[index]"
                        @click="expendClick(index)"
                        class="more"
                    >
                        更多
                    </div>
                    <div
                        v-else
                        v-for="item in row.expendData.partTwoArr"
                        :key="item"
                    >
                        {{ item }}
                    </div>
                </div>
            </template>
            <template
                slot-scope="{ row, index }"
                slot="action"
            >
                <div class="actionDiv">
                    <span
                        v-for="item in actionNames"
                        :key="item"
                        :class="{ unable: isActionUnable(row) }"
                        @click="actionClick(item, index, row)"
                    >{{ isActionUnable(row) ? "不可编辑" : item }}</span>
                </div>
            </template>
        </Table>
        <div
            class="pageRoot"
            v-if="!noTurnPage"
        >
            <span>共{{ pageData.totalRecord }}条记录</span>
            <page
                :page="pageInData"
                @turnPage="turnPage"
                v-if="listDataInter && listDataInter.length > 0"
            ></page>
        </div>
    </div>
</template>
<script>
const page = () => import("components/page/page.vue");
export default {
    props: {
        columnsData: {
            type: Array,
            default(){
                return []
            }
        },
        listData: {
            type: Array,
            default(){
                return []
            }
        },
        pageData: {
            //分页的每页数据量
            type: Object,
            default(){
                return {
                    totalRecord: 1,
                    totalPages: 1
                }
            }
        },
        //是否显示间隔斑马纹
        stripe: {
            type: Boolean,
            default: false
        },
        //是否启用选择框
        enableSelect: {
            type: Boolean,
            default: false
        },
        //是否启用序号列
        indexColumn: {
            type: Boolean,
            default: false
        },
        //是否不显示翻页
        noTurnPage: {
            type: Boolean,
            default: false
        },
        //操作栏
        actionNames: {
            type: Array,
            default(){
                return ["详情"]
            }
        }
    },
    components: {
        page
    },
    data() {
        return {
            pageInData: {
                currPage: this.pageData.currPage,
                pageSize: 20,
                pageCount: this.pageData.totalPages
            },
            selectColumnObj: {
                type: "selection",
                width: 60,
                align: "center"
            },
            actionColumnObj: {
                title: "操作",
                slot: "action",
                width: 250,
                align: "center"
            },
            indexColumnObj: {
                title: "序号",
                type: "index",
                width: 90,
                align: "center"
            },
            expendMoreRecord: [],
            columnsDataInter: []
        };
    },
    computed: {
        listDataInter() {
            return this.initListData();
        }
    },
    watch: {
        pageData: {
            handler() {
                this.pageInData.pageCount = this.pageData.totalPages;
                this.pageInData.currPage = this.pageData.currPage;
            },
            deep: true
        }
    },
    mounted() {
        this.initcolumnData();
    },
    methods: {
        initcolumnData() {
            this.columnsDataInter = this.columnsData;
            //设置居中显示
            this.columnsDataInter &&
                this.columnsDataInter.forEach((element) => {
                    element.align = "center";
                    if (element.solt != "expend") {
                        element.tooltip = true;
                    }
                });
            //有需要排序的列数据，自定义实现
            let sortColumn = this.columnsDataInter.find((item) => {
                return !!item.sortable;
            });
            if (sortColumn) {
                this.setSortRender(sortColumn);
                sortColumn.snsortable = sortColumn.sortable;
                delete sortColumn["sortable"];
            }
            //列表启用选择框功能
            if (this.enableSelect) {
                //默认情况下列表是关闭选择框的
                this.columnsDataInter.splice(0, 0, this.selectColumnObj);
            }
            //列表启用索引列
            if (this.indexColumn) {
                //默认情况下列表是关闭选择框的
                this.columnsDataInter.splice(0, 0, this.indexColumnObj);
            }
            //列表最后一列 一般是 操作栏
            if (this.actionNames && this.actionNames.length > 0) {
                this.columnsDataInter.push(this.actionColumnObj);
            }
        },
        initListData() {
            let listDataInter = this.listData;
            listDataInter.forEach((element) => {
                if (
                    element.expendData &&
                    element.expendData.partTwoArr &&
                    element.expendData.partTwoArr.length > 0
                ) {
                    this.expendMoreRecord.push(true);
                } else {
                    this.expendMoreRecord.push(false);
                }
            });
            return listDataInter;
        },
        onSelectChange(selection) {
            // console.log("3selection=" + JSON.stringify(selection));
            this.$emit("onSelect", JSON.parse(JSON.stringify(selection)));
        },
        onSortChange(column) {
            // console.log("onSortChange=" + JSON.stringify(column));
            this.$emit("onSort", column);
        },
        actionClick(actionName, index, row) {
            // console.log(
            //     "actionClick.actionName=" + actionName + ";index=" + index
            // );
            // console.log("actionClick.row=" + row);
            if (this.isActionUnable(row)) {
                return;
            }
            this.$emit("onActionClick", actionName, row);
        },
        /**
         * 指定页码翻页跳转
         * @param newPageNum 页码
         */
        turnPage(newPageNum) {
            this.pageInData.currPage = parseInt(newPageNum);
            this.$emit("turnPage", JSON.parse(JSON.stringify(this.pageInData)));
        },
        expendClick(index) {
            this.expendMoreRecord[index] = false;
            //这里必须给expendMoreRecord赋值一次，否则不会触发DOM的刷新。
            //因为这是数组，只改变值的话VUE会认为expendMoreRecord没有变化。
            this.expendMoreRecord = JSON.parse(
                JSON.stringify(this.expendMoreRecord)
            );
            // console.log(
            //     "expendClick.showPartTwo=" + this.expendMoreRecord[index]
            // );
        },
        isActionUnable(row) {
            return row.categoryId == "1" || row.categoryId == "2";
        },
        setSortRender(sortColumn) {
            const that = this;
            sortColumn.renderHeader = (h, params) => {
                return h(
                    "div",
                    {
                        style: {
                            cursor: "pointer",
                            display: "flex"
                        },
                        on: {
                            click: () => {
                                // console.log(params);
                                if (params.column.sortType == "asc") {
                                    params.column.sortType = "desc";
                                } else {
                                    params.column.sortType = "asc";
                                }

                                if (sortColumn.snsortable == "custom") {
                                    that.onSortChange({
                                        order: params.column.sortType
                                    });
                                } else {
                                    that.listDataInter.sort((a, b) => {
                                        return (
                                            sortColumn.sortMethod(
                                                a,
                                                b,
                                                params.column.sortType
                                            ) || 1
                                        );
                                    });
                                }
                            }
                        }
                    },
                    [
                        h(
                            "span",
                            {
                                style: {
                                    // cursor: "pointer",
                                }
                            },
                            sortColumn.title
                        ),
                        params.column.sortType == "asc"
                            ? h("div", [
                                h("Icon", {
                                    props: {
                                        type: "md-arrow-dropup"
                                    },
                                    style: {
                                        color: "#478aee",
                                        height: "6px",
                                        display: "block"
                                    }
                                }),
                                h("Icon", {
                                    props: {
                                        type: "md-arrow-dropdown"
                                    },
                                    style: {
                                        color: "#c5c8ce",
                                        height: "6px",
                                        display: "block"
                                    }
                                })
                            ])
                            : h("div", [
                                h("Icon", {
                                    props: {
                                        type: "md-arrow-dropup"
                                    },
                                    style: {
                                        color: "#c5c8ce",
                                        height: "6px",
                                        display: "block"
                                    }
                                }),
                                h("Icon", {
                                    props: {
                                        type: "md-arrow-dropdown"
                                    },
                                    style: {
                                        color: "#478aee",
                                        height: "6px",
                                        display: "block"
                                    }
                                })
                            ])
                    ]
                );
            };
        }
    }
};
</script>
<style scoped lang="less">
.actionDiv {
    display: flex;
    justify-content: center;
    color: #478aee;
    margin: 3px;
    flex-wrap: nowrap;
    span {
        cursor: pointer;
        margin-right: 5px;
    }
    .unable {
        color: #515a6e;
        cursor: auto;
    }
}
.expendDiv {
    .more {
        color: #478aee;
        cursor: pointer;
    }
}
.pageRoot {
    margin: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}
</style>