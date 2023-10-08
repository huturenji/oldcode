<!--
 * @Author: your name
 * @Date: 2020-04-01 09:14:31
 * @LastEditTime: 2020-04-03 21:06:50
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \商品管理\src\components\editDefault\editDefault.vue
 -->
<template>
    <div class="editDefault">
        <el-collapse 
            v-model="activeNames"
            class="editDefault_list"
        >
            <el-collapse-item 
                class="editDefault_item"
                name="1"
            >
                <template slot="title">
                    <div class="editDefault_item_title">
                        <em>{{ singleTitle }}</em>
                    </div>
                </template>
                <div 
                    class="editDefault_item_sp" 
                    v-for="item in list" 
                    :key="item[idKey]"
                >
                    <el-image
                        class="editDefault_item_logo"
                        :src="item[imgSrcKey]"
                        fit="cover"
                    >
                    </el-image>
                    <span class="editDefault_item_sp_dec">{{ item[nameKey] }}</span>
                </div>
            </el-collapse-item>
        </el-collapse>
    </div>
</template>

<script>
export default {
    props: {
        groupList: {
            type: Array,
            default: () => {
                return [];
            }
        },
        singleTitle: {
            type: String,
            default: ""
        },
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
        parActiveNames: {
            type: Array,
            default: () => {
                return [];
            }
        } // 单选是否展开
    },
    data: function() {
        return {
            activeNames: this.$props.parActiveNames, // 折叠面板展开项
            list: []
        };
    },
    watch: {
        groupList() {
            this.list = this.$props.groupList;
            return this.$props.groupList;
        }
    }
};
</script>

<style lang="less">
@import "./editDefault.less";
</style>