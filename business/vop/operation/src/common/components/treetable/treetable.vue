<template>
    <div>
        <sntable
            :data="dataList"
            :columns="columns"
            :thBgColor="thBgColor"
            :tbBgColor="tbBgColor"
            :noBorder="noBorder"
            :border="border"
            :stripe="stripe"
        >
            <template
                slot-scope="{ row, index }"
                slot="action"
            >
                <div class="actionDiv">
                    <span
                        v-for="item in actionNames"
                        :key="item"
                        @click="actionClick(item,index,row)"
                    >
                        <span
                            v-if="!(item.indexOf('新增')!=-1 && row.level=='3')"
                        >{{ item.indexOf('新增')!=-1 ? item + levelMap[(parseInt(row.level)+1)+""]:item }}</span>
                        <span
                            v-else
                            class="actionEmpty"
                        ></span>
                    </span>
                </div>
            </template>
        </sntable>
        <div
            class="pageRoot"
            v-if="!noPage"
        >
            <span>共{{ pageData.totalRecord }}条记录</span>
            <snPage
                :page="pageInData"
                @turnPage="turnPage"
                v-if="dataList && dataList.length>0"
            ></snPage>
        </div>
    </div>
</template>
<script>
import sntable from "components/sntable/sntable";
import snPage from "components/page/page";
export default {
    props: {
        columns: {
            type: Array,
            default(){
                return []
            } 
        },
        dataList: {
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
        stripe: {
            type: Boolean,
            default: false
        },
        border: {
            type: Boolean,
            default: false
        },
        //关闭组件的所有的边框，包括默认的行分割线
        noBorder: {
            type: Boolean,
            default: false
        },
        //没有分页
        noPage: {
            type: Boolean,
            default: false
        },
        //表头的背景设置
        thBgColor: {
            type: String,
            default: "normal"
        },
        //表格的背景设置
        tbBgColor: {
            type: String,
            default: "normal"
        },
        actionNames: {
            type: Array,
            default(){
                return ["详情"]
            }
        }
    },
    components: { sntable, snPage },
    computed: {
        //prop的数据更新了，使用computed可以监听这种更改，动态刷新组件里面的数据
        pageInData() {
            return {
                currPage: 1,
                pageSize: 20,
                pageCount: this.pageData.totalPages
            };
        }
    },
    data() {
        return {
            actionColumnObj: {
                title: "操作",
                slot: "action",
                // width: 250,
                align: "center"
            },
            levelMap: {
                "1": "一级频道",
                "2": "二级频道",
                "3": "三级频道"
            }
        };
    },
    mounted() {
        // console.log("treetable.dataList=" + JSON.stringify(this.dataList));
        //列表最后一列 一般是 操作栏
        if (this.actionNames && this.actionNames.length > 0) {
            this.columns.push(this.actionColumnObj);
        }
    },
    methods: {
        actionClick(actionName, index, row) {
            // console.log(
            //     "actionClick.actionName=" + actionName + ";index=" + index
            // );
            this.$emit("onActionClick", actionName, row);
        },
        /**
         * 指定页码翻页跳转
         * @param newPageNum 页码
         */
        turnPage(newPageNum) {
            this.pageInData.currPage = parseInt(newPageNum);
            this.$emit("turnPage", JSON.parse(JSON.stringify(this.pageInData)));
        }
    }
};
</script>
<style scoped lang="less">
.actionDiv {
    display: flex;
    justify-content: space-around;
    color: #478aee;
    margin: 3px;
    flex-wrap: nowrap;
    cursor: pointer;
    > span {
        margin-right: 15px;
    }
    span:last-child {
        margin-right: 0px;
    }
    .actionEmpty {
        display: inline-block;
        width: 85px;
        height: 10px;
    }
}
.pageRoot {
    margin: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}
</style>