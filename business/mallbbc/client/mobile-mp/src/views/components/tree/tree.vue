<!--
 * @Descripttion: 一个递归显示title和content的树
 * @Author: mawenshu
 * @Date: 2023-05-09 10:02:28
-->
<template>
    <view class="tree_root">
        <view :class="['tree_wrap' + data.level]" v-for="(data, dataIndex) in treeData" :key="dataIndex">
            <view :class="['tree_title_wrap' + data.level]">
                <view :class="['tree_title' + data.level]">{{ data.title }}</view>
            </view>
            <view :class="['tree_content_wrap' + data.level]">
                <block v-if="Array.isArray(data.content)">
                    <Tree :treeData="data.content" />
                </block>
                <block v-else>
                    <view :class="['tree_content' + data.level]">{{ data.content }}</view>
                </block>
            </view>
        </view>
    </view>
</template>

<script>
import { Tree } from "./tree.vue";
export default {
    components: { Tree },
    props: {
        treeData: {
            default: [
                {
                    level: 1, 
                    title: 'title', // 标题：必须是字符串
                    content: "content", // 内容&子内容：数组则为子内容，字符串则为具体内容
                },
            ]
        },
    }
}
</script>

<style lang="scss" scoped></style>