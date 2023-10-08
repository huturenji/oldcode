<template>
    <div class="statics_data_box">
        <div>
            <div
                class="charts"
            >
                <snchartline
                    :chartData="lineOption"
                    :legend="true"
                    :title="echartsTitle"
                    style="height: 400px"
                />
            </div>
            <div
                class="charts_desc"
            >
                <div class="module left">
                    <div>今日低价商品新增数量</div>
                    <div
                        class="refresh"
                        @click="exportJobStatistics(true)"
                    >
                        <i class="el-icon-refresh-left"></i>
                    </div>
                    <div
                        class="num"
                        v-if="echartsInfo"
                    >{{ echartsInfo.lowestPriceNumber || 0 }}</div>
                </div>
                <div class="module left">
                    <div>业务使用中低价商品数量</div>
                    <div
                        class="refresh"
                        @click="exportJobStatistics(true)"
                    >
                        <i class="el-icon-refresh-left"></i>
                    </div>
                    <div
                        class="num"
                        v-if="echartsInfo"
                    >{{ echartsInfo.priceUseNumber || 0 }}</div>
                </div>
                <div class="module right">
                    <div>今日评论数商品更新数量</div>
                    <div
                        class="refresh"
                        @click="exportJobStatistics(true)"
                    >
                        <i class="el-icon-refresh-left"></i>
                    </div>
                    <div
                        class="num"
                        v-if="echartsInfo"
                    >
                        {{ echartsInfo.commentNumber || 0 }}
                    </div>
                </div>
                <div class="module right">
                    <div>评论数商品累积数据</div>
                    <div
                        class="refresh"
                        @click="exportJobStatistics(true)"
                    >
                        <i class="el-icon-refresh-left"></i>
                    </div>
                    <div
                        class="num"
                        v-if="echartsInfo"
                    >
                        {{ echartsInfo.commentCountNumber || 0 }}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import producthandler from "bislibs/requestHandler/producthandler";
import snchartline from "components/snchartline/snchartline";
export default {
    data() {
        return {
            lineOption: {
                xAxisData: [],
                seriesData: [
                    {
                        data: [],
                        type: "line",
                        name:'当日更新数量',
                        smooth: true
                    },
                    {
                        data: [],
                        type: "line",
                        name:'期望值',
                        smooth: true
                    }
                ]
            },
            echartsTitle:[{
                text:"低价商品数量按日统计折线图",
                left:"center"
            }],
            echartsInfo:null //查询回来的图表信息
        };
    },
    
    components: {snchartline},
    props: {},
    
    mounted(){
        this.exportJobStatistics()
    },
        
    
    methods: {
        // 查询图表信息 refresh:false 查的是30分钟缓存
        exportJobStatistics(isRefresh=false) {
            let param = {
                refresh:isRefresh
            }
            this.$iLoading.show();
            producthandler.exportJobStatistics(param).then((res) => {
                this.$iLoading.hide();
                if (!!res && res.resultCode == 0){
                    this.echartsInfo = res.result
                    this.lineOption.xAxisData = this.echartsInfo.dailyDataList.map((item) => {
                        return item.dateTime
                    }).reverse()
                    this.lineOption.seriesData[0].data = this.echartsInfo.dailyDataList.map((item) => {
                        return item.lowestPriceNumber
                    }).reverse()
                    this.lineOption.seriesData[1].data = this.echartsInfo.dailyDataList.map((item) => {
                        return item.expectationNumber
                    }).reverse()
                    
                }
            }).catch(() => {
                this.$iLoading.hide();
            });
        }
    }
}
</script>

<style scoped lang="less">

.statics_data_box {
    padding: 20px;
    .charts {
        margin-top: 30px;
    }
    .charts_desc {
        margin-top: 50px;
        display: flex;
        justify-content: space-between;
        .module {
            position: relative;
            width: 45%;
            height: 200px;
            padding: 20px;
            box-shadow: 0px 0px 10px 0px rgba(153, 153, 153,.5);
            .refresh {
                position: absolute;
                right: 20px;
                top: 20px;
            }
            .num {
                margin-top: 40px;
                font-size: 32px;
                font-weight: bold;
                text-align: center;
            }
        }
    }
}
    
</style>

