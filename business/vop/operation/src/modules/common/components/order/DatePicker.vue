<template>
    <div class="date-picker">
        <el-col :span="2">
            {{ title }}
        </el-col>
        <el-col :span="5">
            <el-date-picker
                style="width:238px"
                v-model="modelDate"
                type="daterange"
                :clearable="false"
                range-separator="至"
                @change="changeDate"
                :picker-options="options"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
            >
            </el-date-picker>
        </el-col>
        <el-col :span="6">
            <el-button
                :class="{'active-btn':curKey === btn.key}"
                plain 
                @click.native="chooseDate(btn.key)" 
                v-for="btn in btnList" 
                :key="btn.key"
            >{{ btn.title }}</el-button>
        </el-col> 
    </div>
</template>
<script>
export default {
    props: {
        type: {
            type: String,
            default: ""
        },
        title: {
            type: String,
            default: ""
        },
        default: {
            type: Number,
            default: 6
        },
        placeholder: {
            type: String,
            default: ""
        }
    },
    data() {
        return {
            btnList: [
                { title: "今天", key: 0 },
                { title: "昨天", key: 1 },
                { title: "近7天", key: 6 },
                { title: "近30天", key: 29 }
            ],
            options: {
                disabledDate(date) {
                    return date && date.valueOf() > Date.now();
                }
            },
            curKey: this.default,
            modelDate:[],//时间选择器的时间数据
            date: []//搜索用的时间数据
        };
    },
    created() {
        this.date = this.getDateRange(new Date(), this.default, true);
        this.modelDate = this.getDateRange(new Date(), this.default, true);
    },
    methods: {
        /**
         * 切换日期
         */
        chooseDate(key) {
            this.curKey = key;
            this.modelDate = this.getDateRange(new Date(), key, true);
            this.date = this.getDateRange(new Date(), key, true);
            
        },
        /**
         * 选择日期
         */
        changeDate(date) {
            this.date = [this.$moment(date[0]).format("YYYY-MM-DD"),this.$moment(date[1]).format("YYYY-MM-DD")];
            // this.date = date;
            let dateList = this.btnList.filter(
                it =>
                    (this.getDiffDays(date[1], new Date().getTime()) === 0 &&
                        this.getDiffDays(date[0], date[1]) === it.key &&
                        it.key !== 1) ||
                    (this.getDiffDays(date[1], new Date().getTime()) === 1 &&
                        this.getDiffDays(date[0], new Date().getTime()) === 1 &&
                        it.key === 1)
            );
            if (dateList.length) {
                this.curKey = dateList[0].key;
            } else {
                this.curKey = -1;
            }
        },
        /**
         * 计算相隔天数的具体日期
         * @param {*} dateNow
         * @param {*} intervalDays
         * @param {*} bolPastTime
         */
        getDateRange(dateNow, intervalDays, bolPastTime) {
            let oneDayTime = 24 * 60 * 60 * 1000;
            let list = [];
            let lastDay;
            if (bolPastTime == true) {
                lastDay = new Date(
                    dateNow.getTime() - intervalDays * oneDayTime
                );
                list.push(this.$moment(lastDay).format("YYYY-MM-DD"));
                (intervalDays === 1 &&
                    list.push(this.$moment(lastDay).format("YYYY-MM-DD"))) ||
                    (intervalDays !== 1 &&
                        list.push(this.$moment(dateNow).format("YYYY-MM-DD")));
            } else {
                lastDay = new Date(
                    dateNow.getTime() + intervalDays * oneDayTime
                );
                list.push(this.$moment(dateNow).format("YYYY-MM-DD"));
                (intervalDays === 1 &&
                    list.push(this.$moment(dateNow).format("YYYY-MM-DD"))) ||
                    (intervalDays !== 1 &&
                        list.push(this.$moment(lastDay).format("YYYY-MM-DD")));
            }
            return list;
        },

        /**
         * 计算出相差天数
         * @param {*} startDate
         * @param {*} endDate
         */
        getDiffDays(startDate, endDate) {
            const diffTime =
                this.$moment(endDate).valueOf() -
                this.$moment(startDate).valueOf(); //时间差的毫秒数
            return Math.floor(diffTime / (24 * 3600 * 1000));
        }
    },
    watch: {
        date() {
            this.$bus.$emit("change-date", {
                date: this.date,
                type: this.type
            });
        }
    }
};
</script>
<style lang="less" scoped>
 
.date-picker {
    .el-col-2 {
        padding: 10px 0;
        width: 100px;
        margin-right: -30px;
    }
    .el-col-5 {
        width: 177px;
        .el-input__inner {
            height: 36px;
            line-height: 36px;
        }
    }
    .el-col-6 {
        text-align: right;
    }
    .active-btn {
        background: #fff;
        border: 1px solid #478aee;
        color: #478aee;
    }
}
</style>