<template>
    <div class="tabsBar">
        <div
            v-if="type=='card'"
            class="tabsCard"
        >
            <div
                v-for="(item,index) in labels"
                :key="item"
                class="tab"
                :class="{'selected':selectedIndex==index ,'disabled':disableList.indexOf(item) != -1}"
                @click.stop="switchTab(item,index)"
            >
                <div class="tabText">
                    {{ item }}
                </div>
            </div>
        </div>
        <div
            v-else-if="type=='line'"
            class="tabsLine"
        >
            <div
                v-for="(item,index) in labels"
                :key="item"
                class="tab"
                :class="{'selected':selectedIndex==index ,'disabled':disableList.indexOf(item) != -1}"
                @click="switchTab(item,index)"
            >
                <div class="name">
                    {{ item }}
                </div>
                <div
                    class="selectTip"
                    :class="[selectedIndex==index && 'selected']"
                ></div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        value: {
            //v-model被选中的
            type: String,
            default: ""
        },
        labels: {
            type: Array,
            default(){
                return []
            },
            required: true
        },
        disableLabels: {
            type: Array,
            default(){
                return []
            } 
        },
        type: {
            type: String,
            default: "line"
        }
    },
    directives: {},
    components: {},
    data() {
        return {
            typeMap: {
                line: {},
                card: {}
            },
            selectedIndex: 0, //选中的标签项，默认第一个0
            disableList: []
        };
    },
    created() {},
    mounted() {
        this.selectedIndex = this.getTabIndex4Label(this.value);
    },
    watch: {
        disableLabels(val) {
            this.disableList = JSON.parse(JSON.stringify(val));
            // console.log("disableList=" + JSON.stringify(this.disableList));
        },
        value(val) {
            this.selectedIndex = this.getTabIndex4Label(val);
        }
    },
    methods: {
        getTabIndex4Label(label) {
            let index = this.labels.indexOf(label);
            return index >= 0 ? index : 0;
        },
        /**
         * 切换标签
         * @param statusIndex
         */
        switchTab(label, statusIndex) {
            if (
                this.selectedIndex == statusIndex ||
                this.disableList.indexOf(label) != -1
            ) {
                //  console.log('switchTab...');
                return;
            }
            this.selectedIndex = statusIndex;
            //切换页签的时候，也调用一次接口返回选中的下标statusIndex
            this.$emit("input", label); //v-model
        }
    }
};
</script>
<style scoped lang="less">
@line-height: 32px;
@font-color: #191919;
@placeholder-color: #b2b2b2;
.tabsBar {
    width: 100%;
    display: flex;
    align-items: center;
    overflow: auto;
    font-size: 18px;
    .tabsCard {
        display: flex;
        border-bottom: 1px solid #dcdee2;
        .tab {
            margin-right: 4px;
            padding: 8px 16px;
            width: fit-content;
            width: -moz-fit-content;
            width: -webkit-fit-content;
            text-align: center;
            color: #515a6e;
            background-color: #f8f8f9;
            border-top: 1px solid #dcdee2;
            border-left: 1px solid #dcdee2;
            border-right: 1px solid #dcdee2;
            border-top-left-radius: 5px;
            border-top-right-radius: 5px;
            cursor: pointer;
            .tabText {
                word-break: keep-all;
                white-space: nowrap;
            }
            &.selected {
                color: #478aee;
                background-color: #ffffff;
            }
            &.disabled {
                color: #cccccc;
                cursor: default;
                pointer-events: none;
            }
            &:hover {
                color: #478aee;
            }
        }
    }
    .tabsLine {
        display: flex;
        border-bottom: 1px solid #dcdee2;
        .tab {
            margin-right: 4px;
            width: fit-content;
            text-align: center;
            color: #515a6e;
            cursor: pointer;
            .name {
                word-break: keep-all;
                white-space: nowrap;
                padding: 0px 16px;
            }
            .selectTip {
                height: 2px;
                display: none;
                background: #478aee;
                // margin-top: 4px;
                &.selected {
                    display: flex;
                }
            }
            &:hover {
                color: #478aee;
            }
            &.selected {
                color: #478aee;
            }
            &.disabled {
                color: #cccccc;
                cursor: default;
                pointer-events: none;
            }
        }
    }
}
</style>

