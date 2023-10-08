<template>
    <div
        class="btnBox"
    >
        <block
            v-for="(item,index) in btnTookits"
            :key="index"
        >
            <el-button
                @click="executOperation(index)"
                class="btnItem"
            >
                {{ item.name }}
            </el-button>
        </block>
    </div>
</template>

<script>

export default {
    data() {
        return {
            btnTookits: [
                { name: "爬取选品", operation: this.goToCrawlData},
                { name: "采集任务管理", operation: this.goToAcquireData},
                { name: "数据统计", operation: this.goToStaticsData}
            ]
        };
    },
    created() {},
    methods: {
        executOperation(index) {
            this.btnTookits[index].operation();
        },
        goToCrawlData() {
            this.$router.push({
                path: "/tools/selectionTool/crawlData"
            });
        },
        goToAcquireData() {
            this.$router.push({
                path: "/tools/selectionTool/acquireData"
            });
        },
        goToStaticsData() {
            this.$router.push({
                path: "/tools/selectionTool/staticsData"
            });
        }       
        
    }
};
</script>

<style scoped lang='less'>
.btnBox{
    width: 100%;
    height: 100%;
    padding: .1rem;
    display: flex;
    justify-content: flex-start;
    align-content: flex-start;
    flex-wrap: wrap;
    .btnItem{
        width: 1.5rem;
        height: 0.6rem;
        margin: 20px;
        font-size: .2rem;
    }

}
</style>