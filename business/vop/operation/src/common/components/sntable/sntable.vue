<template>
    <div>
        <div
            class="table"
            :class="{tableBorder:border}"
        >
            <div
                v-if="!draggable && columns && columns.length > 0"
                class="tableHeader"
                :style="{background:thBgColorType[thBgColor].bgcolor,color:thBgColorType[thBgColor].txtColor
                         ,borderBottom:noBorder &&'none'}"
            >
                <div
                    class="tdCell"
                    :class="{tCellBorder:border}"
                    v-for="column in columns"
                    :key="column.title || column.type"
                    :style="{textAlign:(column.align||'left'), width:(column.width + 'px'), paddingRight:(spaceCell?'20px':'0px')}"
                >{{ column.title || '---' }}</div>
            </div>
            <vuedraggable
                class="tableBody"
                v-if="tbodyDatas && tbodyDatas.length > 0"
                v-model="tbodyDatas"
                @start="startEvent"
                @end="endEvent"
                @change="changeEvent"
                :move="moveEvent"
                v-bind="dragOptions"
            >
                <!-- <div class="tableBody" v-if="tbodyDatas && tbodyDatas.length > 0"> -->
                <div
                    class="tbRow"
                    v-for="(row,rowIndex) in tbodyDatas"
                    :key="row"
                    :class="{tbRowStripe:stripe && rowIndex % 2 == 1}"
                    :style="{borderBottom:noBorder &&'none',background:tbBgColorType[tbBgColor].bgcolor
                             ,color:tbBgColorType[tbBgColor].txtColor}"
                >
                    <div
                        class="tbCell"
                        :class="{tCellBorder:border}"
                        v-for="(column,colunmIndex) in columns"
                        :key="column.title || column.type"
                        :style="{justifyContent:(columns[colunmIndex].align||'left'), width:(column.width + 'px'), paddingRight:(spaceCell?'20px':'0px')}"
                    >
                        <div
                            v-if="columns[colunmIndex].slot =='tree'"
                            :style="{justifyContent:(columns[colunmIndex].align||'left'),paddingLeft:(row.treeSortLevel * treeCellIndent)+'px'}"
                            class="tree"
                        >
                            <div
                                v-if="row.children && row.children.length > 0"
                                :class="row.opend?'opened':'closed'"
                                @click="openSwitch(row,rowIndex)"
                            />
                            <div
                                v-else
                                class="rowTreeEmpty"
                            ></div>
                            <img
                                class="logo"
                                :src="columns[colunmIndex].key.length > 0 && row[columns[colunmIndex].key[0]]"
                                alt
                            />
                            <span>{{ columns[colunmIndex].key.length > 1 && row[columns[colunmIndex].key[1]] }}</span>
                        </div>
                        <slot
                            v-else-if="columns[colunmIndex].slot =='action'"
                            name="action"
                            :row="row"
                            :index="rowIndex"
                        ></slot>
                        <div v-else-if="columns[colunmIndex].type =='index'">
                            {{ rowIndex + 1 }}
                        </div>
                        <div
                            v-else-if="draggable && columns[colunmIndex].type =='drag'"
                            class="handleBox"
                        ></div>
                        <div v-else>
                            {{ row[columns[colunmIndex].key] }}
                        </div>
                    </div>
                </div>
                <!-- </div> -->
            </vuedraggable>
        </div>
    </div>
</template>
<script>
/**
 * 自己实现的树形的列表组件，因为我们的需求上树形列表样式需要定制，不能直接使用iview的table。
 * 我们的实现方式模范iview的调用模式，尽量做到无缝切换。
 */
import vuedraggable from "vuedraggable";
import utilshandler from "libs/utils";
export default {
    props: {
        //列表的表头数据
        columns: {
            type: Array,
            default(){
                return []
            } 
        },
        //列表的数据
        data: {
            type: Array,
            default(){
                return []
            } 
        },
        //是否开启斑马线效果
        stripe: {
            type: Boolean,
            default: false
        },
        //是否开启表格边框效果
        border: {
            type: Boolean,
            default: false
        },
        //控制间距
        spaceCell: {
            type: Boolean,
            default: false
        },
        //关闭组件的所有的边框，包括默认的行分割线
        noBorder: {
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
        //组件是否能够拖拽
        draggable: {
            type: Boolean,
            default: false
        },
        //每一条数据唯一标识符，用于拖拽功能给row分类
        rowKey: {
            type: String,
            default: ""
        }
    },
    components: { vuedraggable },
    data() {
        return {
            thBgColorType: {
                normal: {
                    bgcolor: "#f8f8f9",
                    txtColor: "#515a6e"
                },
                dark: {
                    bgcolor: "#a1a1a1",
                    txtColor: "#000000"
                },
                white: {
                    bgcolor: "#ffffff",
                    txtColor: "#000000"
                },
                light: {
                    bgcolor: "#fafafa",
                    txtColor: "#000000"
                }
            },
            tbBgColorType: {
                normal: {
                    bgcolor: "#ffffff",
                    txtColor: "#515a6e"
                },
                light: {
                    bgcolor: "#fafafa",
                    txtColor: "#515a6e"
                },
                gray: {
                    bgcolor: "#ffffff",
                    txtColor: "#0000004f"
                }
            },
            treeCellIndent: 25, //树形单元格的不同层级缩进的尺寸
            dragOptions: {
                group: { name: "sntable", pull: false, put: false },
                animation: 200,
                handle: ".handleBox",
                draggable: ".tbRow",
                ghostClass: "ghost",
                disabled: true //设置这个属性是否可以拖动
            },
            curMoveResult: false, //记录某次拖动的结果，在move方法使用
            curSourceElecmt: null,
            curTargetElecmt: null,
            tbodyDatas: []
        };
    },
    watch: {
        //我们列表的数据对象，接受prop的传值，因为树形操作打开和关闭，需要修改展示的数组，但我们不能修改prop的数据
        data: {
            handler(val) {
                this.tbodyDatas = JSON.parse(JSON.stringify(val));
                this.addLevel(this.tbodyDatas, 0);
            },
            immediate: true
        }
    },
    mounted() {
        this.dragOptions.disabled = !this.draggable; //判断是否需要启用拖动效果
    },
    methods: {
        /**
         * 给数据列表的每个元素添加一个treeSortLevel字段，标示他所属的层级。为了实现多级的展开和关闭效果
         */
        addLevel(array, treeSortLevel, parentElement) {
            array.forEach((element) => {
                element.treeSortLevel = treeSortLevel;
                //如果是拖动模式，对于非顶级的节点，我们需要给每个元素指定一个字段，表示父节点id。用于拖拽的逻辑判断。
                if (this.draggable && parentElement && this.rowKey) {
                    element.parentRowId = parentElement[this.rowKey];
                }
                if (element.children && element.children.length > 0) {
                    this.addLevel(element.children, treeSortLevel + 1, element);
                }
            });
        },
        /**
         * 打开和关闭树形列表的某个非叶子节点
         */
        openSwitch(item, index) {
            // 
            if (item.opend) {
                this.tbodyDatas.splice(
                    index + 1,
                    this.findClosedArray(
                        index + 1,
                        this.tbodyDatas,
                        this.tbodyDatas[index].treeSortLevel
                    )
                );
            } else {
                this.tbodyDatas.splice(
                    index + 1,
                    0,
                    ...JSON.parse(JSON.stringify(item.children))
                );
            }
            this.$set(item, "opend", !item.opend);
            //数据层次太多，render函数没有自动更新，需手动强制刷新。
            this.$forceUpdate();
        },
        /**
         * 计算要关闭的某个节点，需要涉及到元素有多少
         */
        findClosedArray(start, array, treeSortLevel) {
            if (!array || treeSortLevel < 0 || start < 0) {
                return 0;
            }
            let end = start;
            for (let i = start; i < array.length; i++) {
                if (array[i].treeSortLevel <= treeSortLevel) {
                    end = i;
                    break;
                } else if (i == array.length - 1) {
                    end = array.length;
                    break;
                }
            }
            return array.slice(start, end).length;
        },
        /**
         * 判断是否某次拖动操作符合逻辑：仅支持分级别排序调整，不可跨级别调整
         * 1、参与拖动的的元素必须是关闭的状态
         * 2、参与拖动的元素必须是同一个级别的，这里又分2种
         * 2.1 元素都是顶级节点，
         * 2.2 元素都不是顶级节点，必须是同一个父节点的子节点
         *
         */
        ifDragOperationCanDo(sourceElecmt, targetElement) {
            let result =
                (sourceElecmt.treeSortLevel == 0 &&
                    targetElement.treeSortLevel == 0 &&
                    !sourceElecmt.opend &&
                    !targetElement.opend) ||
                (!sourceElecmt.opend &&
                    !targetElement.opend &&
                    sourceElecmt.treeSortLevel == targetElement.treeSortLevel &&
                    sourceElecmt.parentRowId &&
                    sourceElecmt.parentRowId == targetElement.parentRowId);

            return result;
        },
        /**
         * 元素拖动的回调函数 return true推动继续 false阻断拖动
         */
        moveEvent(event) {
            // console.log("move");
            // console.log(event);
            // console.log(originalEvent); // 可以得到鼠标位置信息
            let sourceElecmt = event.draggedContext.element;
            let targetElement = event.relatedContext.element;

            if (this.ifDragOperationCanDo(sourceElecmt, targetElement)) {
                this.curSourceElecmt = sourceElecmt;
                this.curTargetElecmt = targetElement;
                this.curMoveResult = true;
                return true;
            } 
            this.curSourceElecmt = null;
            this.curTargetElecmt = null;
            this.curMoveResult = false;
            return false;
            
        },
        changeEvent() {
            // console.log('change')
            // console.log(event)
        },
        startEvent() {
            // console.log("start");
            // console.log(event)
            // this.curChoose = event.item.innerText;
            // console.log("startEvent=" + JSON.stringify(this.list2));
            // return true
        },
        /**
         * 元素拖动结果的回调函数
         */
        endEvent() {
            // 
            // console.log("end=" + event);
            // console.log(event.item) // 当前拖动元素
            // console.log(event.to) // 拖动目标列表
            // console.log(event.from) // 拖动源列表
            // console.log(event.oldIndex) // 拖动前位置
            // console.log(event.newIndex) // 拖动后位置
            if (!this.curMoveResult) {
                utilshandler.showToast("不可跨级别调整或关闭频道的打开状态");
            } else {
                //顶级元素自动更换位置。非顶级元素因为是虚拟的，源数据还在某个children里，需要手动刷新位置
                let sourceElecmt = this.curSourceElecmt;
                let targetElement = this.curTargetElecmt;
                if (
                    sourceElecmt &&
                    targetElement &&
                    sourceElecmt.treeSortLevel > 0
                ) {
                    let element = this.findElementInTree(
                        this.tbodyDatas,
                        sourceElecmt.parentRowId
                    );
                    let sourceIndex =
                        element &&
                        element.children.findIndex((item) => {
                            return (
                                item[this.rowKey] == sourceElecmt[this.rowKey]
                            );
                        });
                    let targetIndex =
                        element &&
                        element.children.findIndex((item) => {
                            return (
                                item[this.rowKey] == targetElement[this.rowKey]
                            );
                        });
                    element &&
                        this.switchIndexInarr(
                            element.children,
                            sourceIndex,
                            targetIndex
                        );
                }

                this.$emit(
                    "onDragEnd",
                    JSON.parse(JSON.stringify(this.tbodyDatas))
                );
            }
            // console.log("endEvent=" + JSON.stringify(this.list2));
        },
        findElementInTree(arr, rowId) {
            let element;
            for (let i = 0; i < arr.length; i++) {
                if (arr[i][this.rowKey] == rowId) {
                    element = arr[i];
                    break;
                } else if (arr[i].children && arr[i].children.length > 0) {
                    element = this.findElementInTree(arr[i].children, rowId);
                }
            }
            // 
            return element;
        },
        switchIndexInarr(arr, index1, index2) {
            arr[index1] = arr.splice(index2, 1, arr[index1])[0];
        }
    }
};
</script>
<style scoped lang="less">
.table {
    width: 100%;
    background: #ffffff;
    .tableHeader {
        width: 100%;
        display: flex;
        justify-content: space-between;
        border-bottom: 1px solid #dcdee2;
        .tdCell {
            margin-left: 5px;
            padding: 8px 0px;
            width: 100%;
            //强制换行
            // word-wrap: break-word;
            // word-break: break-all;
            //不换行，强制显示省略号
            word-break: keep-all;
            white-space: nowrap;
            text-overflow: ellipsis;
            // overflow: hidden;
        }
    }
    .tableBody {
        width: 100%;
        .tbRow {
            background: #ffffff;
            display: flex;
            justify-content: space-between;
            border-bottom: 1px solid #dcdee2;
            .tbCell {
                display: flex;
                align-items: center;
                margin-left: 5px;
                padding: 8px 0px;
                width: 100%;
                word-wrap: break-word;
                word-break: break-all;
                white-space: normal;
                //不换行，强制显示省略号
                // word-break: keep-all;
                // white-space: nowrap;
                // text-overflow: ellipsis;
                .tree {
                    display: flex;
                    align-items: center;
                    padding: 10px 0px;
                }
                .opened {
                    height: 20px;
                    width: 20px;
                    background: url(~assets/icon_list_down_select.png);
                }
                .closed {
                    height: 20px;
                    width: 20px;
                    background: url(~assets/icon_list_down_default.png);
                }
                .rowTreeEmpty {
                    height: 20px;
                    width: 20px;
                    background: transparent;
                }
                .logo {
                    height: 40px;
                    width: 40px;
                    margin-right: 5px;
                    background: #f8f8f9;
                }
            }
            .handleBox {
                height: 30px;
                width: 24px;
                background: url(~assets/dragHandle.png);
                background-size: contain;
                cursor: pointer;
            }
        }
        .tbRowStripe {
            background: #f8f8f9;
        }
        .ghost {
            border: 1px solid #1890ff;
            border-radius: 5px;
            color: #1890ff;
        }
    }
    .tCellBorder {
        border-right: 1px solid #dcdee2;
    }
}
.tableBorder {
    border: 1px solid #dcdee2;
}
</style>