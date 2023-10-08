<template>
    <div class="service-info">
        <label class="title">{{ title }}</label>
        <ul>
            <li 
                v-for="( data,index) in dataList" 
                :key="index"
            >
                <label>{{ data.title }}:</label> 
                <span
                    class="value"
                    v-if="!Array.isArray(data.value)"
                >{{ data.value }}</span>
                <div
                    v-else
                    class="array-value"
                >
                    <span>{{ data.value.length }}张</span>
                    <preview :data="data.value"></preview>
                </div>
            </li>
        </ul>
        <label v-if="dataList.length<1">暂无数据...</label>
    </div>
</template>
<script>
import Preview from "./Preview";
export default {
    components: {
        Preview
    },
    props: {
        title: {
            type: String,
            default: ""
        },
        dataList: {
            type: Array,
            default: () => []
        }
    }
};
</script>
<style lang="less" scoped>
 
.service-info {
    flex: 1;
    .title {
        padding: 0 32px;
    }
    ul {
        margin: 24px 56px;
        li {
            display: flex;
            margin-top: 20px;
            label {
                display: inline-block;
                color:  #999;
                width: 102px;
                text-align: right;
            }
            .value,
            .array-value {
                flex: 1;
                padding-left: 10px;
                text-align: justify;
            }
            .img-wrapper {
                img {
                    width: 72px;
                    height: 72px;
                    margin: 8px 16px 0 0;
                }
            }
        }
    }
}
</style>