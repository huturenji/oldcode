<template>
    <div class="vporderinfo">
        <h2>导出京东供应商资金明细</h2>
        <div class="operationbox">
            <div>
                <div>请选择要导出的时间段</div>
                <el-date-picker
                    v-model="dateArr"
                    type="daterange"
                    unlink-panels
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                >
                </el-date-picker>
            </div>
            <el-button
                type="primary"
                @click="exportOrder"
            >
                导出
            </el-button>
        </div>
    </div>
</template>

<script>
import orderhandler from "bislibs/requestHandler/orderhandler";
import utils from "bislibs/utils";
export default {
    data() {
        return {
            dateArr: "" //日期数据
        };
    },

    watch: {
        dateArr: {
            handler(newOne) {
                console.log(newOne);
            },
            immediate: true,
            deep: true
        }
    },
    mounted() {},
    methods: {
        exportOrder() {
            let _this = this;
            if (!(_this.dateArr && _this.dateArr.length == 2)) {
                utils.showToast("请选择要导出的时间段");
                return;
            }
            let param = {
                startTime: this.$moment(_this.dateArr[0]).format("YYYY-MM-DD"),
                endTime: this.$moment(_this.dateArr[1]).format("YYYY-MM-DD")
            };
            _this.$iLoading.show();
            orderhandler
                .exportSubOrderInfo(param)
                .then((res) => {
                    _this.$iLoading.hide();
                    if (res.resultCode === 0) {
                        let downloadPath = res.result.downloadPath;
                        utils.downloadFile(downloadPath, "京东供应商资金明细");
                    }
                })
                .catch(() => {
                    _this.$iLoading.hide();
                });
        }
    }
};
</script>

<style lang="less" scoped>
.vporderinfo {
  padding: 10px;
  background: white;
  .operationbox {
    display: flex;
    justify-content: space-around;
    padding: 10px 0;
  }
}
</style>>
