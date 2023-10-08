<!--
 * @Date: 2020-03-19 18:12:16
 * @LastEditTime: 2020-04-24 15:34:56
 * @Description: 多选组件
 -->
<template>
    <div class="flod">
        <el-collapse 
            v-model="allSelected"
            v-if="type==1"
            class="fold_list"
        >
            <el-collapse-item
                name="1" 
                class="fold_item"
            >
                <template slot="title">
                    <div class="fold_item_range_title">
                        <em>{{ multipleTitle }}</em>
                        <el-checkbox 
                            :indeterminate="isIndeterminate"
                            class="selectedAll"
                            v-model="checkAll" 
                            @change="selectedAll"
                        >
                            全选
                        </el-checkbox>
                    </div>
                </template>
                <div class="selectGroup">
                    <el-checkbox-group 
                        v-model="slectedSupplier"
                        @change="updateSelected"
                    >
                        <el-checkbox-button
                            v-for="item in groupList"
                            :label="item[idKey]"
                            :key="item[idKey]"
                            class="selectGroup_item"
                        >
                            <div class="selectGroup_item_content">
                                <div class="selectGroup_item_content_left">
                                    <img 
                                        :src="item[imgSrcKey]" 
                                        class="selectGroup_item_content_img"
                                    />
                                    <el-tooltip
                                        :content="item[nameKey]"
                                        placement="top"
                                    >
                                        <span class="selectGroup_item_content_dec">{{ item[nameKey] }}</span>
                                    </el-tooltip>
                                </div>
                                <svg
                                    v-if="slectedSupplier.includes(item[idKey])"
                                    class="selectGroup_item_content_icon"
                                    viewBox="0 0 1024 1024"
                                    width="20" 
                                    height="20"
                                >
                                    <path 
                                        d="M512.2 65.4c-247.1 0-447.5 200.4-447.5 447.5s200.4 447.5 447.5 447.5S959.7 760 959.7 512.9 759.3 65.4 512.2 65.4z m220 348L488.8 656.9c-8.1 8.1-18.8 12.2-29.4 12.2-10.7 0-21.3-4.1-29.4-12.2L292.2 519.2c-6.3-6.3-9.7-14.6-9.7-23.5s3.5-17.2 9.7-23.5c13-13 34.1-13 47 0l120.1 120.1 225.9-225.9c13-13 34-13 47 0 6.3 6.3 9.7 14.6 9.7 23.5 0.1 8.9-3.4 17.2-9.7 23.5z" 
                                        fill="#478aee"
                                    >
                                    </path>
                                </svg>
                                <svg
                                    v-else
                                    class="selectGroup_item_content_icon"
                                    viewBox="0 0 1024 1024"
                                    width="20" 
                                    height="20"
                                >
                                    <path 
                                        d="M524.04224 951.07584c-242.10944 0-439.07584-196.9664-439.07584-439.07072 0-242.10944 196.9664-439.07584 439.07584-439.07584s439.08096 196.9664 439.08096 439.07584C963.11808 754.10944 766.15168 951.07584 524.04224 951.07584zM524.04224 117.13536c-217.728 0-394.86976 177.13664-394.86976 394.86976 0 217.728 177.14176 394.86464 394.86976 394.86464 217.728 0 394.86976-177.13664 394.86976-394.86464C918.912 294.272 741.77024 117.13536 524.04224 117.13536z" 
                                        fill="#ccc"
                                    >
                                    </path>
                                </svg>
                            </div>
                        </el-checkbox-button>
                    </el-checkbox-group>
                </div>
            </el-collapse-item>
        </el-collapse>
        <el-collapse 
            v-model="sinSelected"
            v-else
            class="fold_list"
        >
            <el-collapse-item
                name="2" 
                class="fold_item"
            >
                <template slot="title">
                    <div 
                        class="fold_item_range_title"
                    >
                        <em>{{ singleTitle }}</em>
                        <span class="fold_item_range_title_tip">(仅支持单选)</span>
                    </div>
                </template>
                <div class="selectGroup">
                    <el-radio-group 
                        v-model="selectOne" 
                        @change="changeOne"
                    >
                        <el-radio-button
                            v-for="item in groupList"
                            :label="item[idKey]"
                            :key="item[idKey]"
                            class="selectGroup_item"
                        >
                            <div class="selectGroup_item_content">
                                <div class="selectGroup_item_content_left">
                                    <img 
                                        :src="item[imgSrcKey]" 
                                        class="selectGroup_item_content_img"
                                    />
                                    <el-tooltip
                                        :content="item[nameKey]"
                                        placement="top"
                                    >
                                        <span class="selectGroup_item_content_dec">{{ item[nameKey] }}</span>
                                    </el-tooltip>
                                </div>
                                <svg
                                    v-if="selectOne==item[idKey]"
                                    class="selectGroup_item_content_icon"
                                    viewBox="0 0 1024 1024"
                                    width="20" 
                                    height="20"
                                >
                                    <path 
                                        d="M512.2 65.4c-247.1 0-447.5 200.4-447.5 447.5s200.4 447.5 447.5 447.5S959.7 760 959.7 512.9 759.3 65.4 512.2 65.4z m220 348L488.8 656.9c-8.1 8.1-18.8 12.2-29.4 12.2-10.7 0-21.3-4.1-29.4-12.2L292.2 519.2c-6.3-6.3-9.7-14.6-9.7-23.5s3.5-17.2 9.7-23.5c13-13 34.1-13 47 0l120.1 120.1 225.9-225.9c13-13 34-13 47 0 6.3 6.3 9.7 14.6 9.7 23.5 0.1 8.9-3.4 17.2-9.7 23.5z" 
                                        fill="#478aee"
                                    >
                                    </path>
                                </svg>
                                <svg
                                    v-else
                                    class="selectGroup_item_content_icon"
                                    viewBox="0 0 1024 1024"
                                    width="20" 
                                    height="20"
                                >
                                    <path 
                                        d="M524.04224 951.07584c-242.10944 0-439.07584-196.9664-439.07584-439.07072 0-242.10944 196.9664-439.07584 439.07584-439.07584s439.08096 196.9664 439.08096 439.07584C963.11808 754.10944 766.15168 951.07584 524.04224 951.07584zM524.04224 117.13536c-217.728 0-394.86976 177.13664-394.86976 394.86976 0 217.728 177.14176 394.86464 394.86976 394.86464 217.728 0 394.86976-177.13664 394.86976-394.86464C918.912 294.272 741.77024 117.13536 524.04224 117.13536z" 
                                        fill="#ccc"
                                    >
                                    </path>
                                </svg>
                            </div>
                        </el-radio-button>
                    </el-radio-group>
                </div>
            </el-collapse-item>
        </el-collapse>
    </div>
</template>
 
<script>
export default {
    props: {
        idKey: {
            type: String,
            default: ""
        },
        imgSrcKey: {
            type: String,
            default: ""
        },
        nameKey: {
            type: String,
            default: ""
        },
        // 判断是单选还是多选。1为多选，2为单选
        type: {
            type: Number,
            default: 1
        },
        multipleSelected: {
            type: Array,
            default: () => {
                return [];
            }
        }, // 多选是否展开
        multipleTitle: {
            type: String,
            default: ""
        }, // 多选标题
        singleSelected: {
            type: Array,
            default: () => {
                return [];
            }
        }, // 单选是否展开
        singleTitle: {
            type: String,
            default: ""
        }, // 单选标题
        // 数据源
        groupList: {
            type: Array,
            default: () => {
                return [];
            }
        }
    },
    data() {
        return {
            slectedSupplier: [], //选中列表
            selectOne: -100,
            allSelected: this.multipleSelected,
            isIndeterminate: false, // 是否展示半选状态
            checkAll: false, // 是否全选
            sinSelected: this.singleSelected
        };
    },
    watch: {
        groupList() {
            if (this.$props.type === 1) {
                this.$props.groupList.length &&
                    this.$props.groupList.map(item => {
                        if (item.isActive) {
                            this.slectedSupplier.push(item[this.$props.idKey]);
                        }
                        return item
                    });
                this.checkAll =
                    this.slectedSupplier.length == this.$props.groupList.length;
                this.isIndeterminate = this.checkAll
                    ? false
                    : this.slectedSupplier.length
                        ? true
                        : false;
            } else {
                this.$props.groupList.length &&
                    this.$props.groupList.map(item => {
                        if (item.isActive) {
                            this.selectOne = item[this.$props.idKey];
                        }
                        return item
                    });
            }
            return this.$props.groupList;
        },
        multipleSelected() {
            this.allSelected = JSON.parse(
                JSON.stringify(this.$props.multipleSelected)
            );
            return this.$props.multipleSelected;
        },
        singleSelected() {
            this.sinSelected = JSON.parse(
                JSON.stringify(this.$props.singleSelected)
            );
            return this.$props.singleSelected;
        }
    },
    computed: {},
    methods: {
        // 当选择改变时候向上传递最新的值
        updateSelected(newData) {
            let tempArr = [];
            this.groupList.map(item => {
                newData.map(ele => {
                    if (item[this.$props.idKey] == ele) {
                        tempArr.push(item);
                    }
                    return ele
                });
                return item
            });
            // 全选半选状态更改
            this.checkAll =
                newData.length == this.groupList.length ? true : false;
            this.isIndeterminate =
                newData.length > 0 && newData.length < this.groupList.length;

            this.$emit("updataSelected", tempArr);
        },
        changeOne(newData) {
            this.groupList.map(item => {
                if (item[this.$props.idKey] == newData) {
                    this.$emit("updataOneSelected", item);
                }
                return item
            });
        },
        selectedAll(data) {
            this.slectedSupplier = data
                ? this.groupList.map(item => item[this.idKey])
                : [];
            // eslint-disable-next-line no-unused-expressions
            this.isIndeterminate;
            if (!!this.slectedSupplier.length) {
                this.isIndeterminate = false;
            }
            let tempArr =[] ;
            this.slectedSupplier.length&&this.groupList.map(item=>{
                this.slectedSupplier.map(ele=>{
                    if (ele == item[this.idKey]) {
                        tempArr.push(item);
                    }
                    return ele
                })
                return item
            })
            this.$emit("updataSelected", tempArr);
        }
    }
};
</script>
 
 <style lang="less">
@import "./selectGroup.less";
</style>