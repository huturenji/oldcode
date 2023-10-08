<template>
    <div class="service-track"> 
        <div class="sp-track">
            <label class="title">供应商进度详情</label>
            <el-timeline class="steps">
                <el-timeline-item
                    :class="{'active-status': index === spSteps.length-1}"
                    v-for="(activity, index) in spSteps"
                    :key="index"
                    type="primary"
                >
                    <div class="item-title">
                        {{ activity.title }}
                    </div>
                    <div>{{ activity.createTime }}</div>
                    <div
                        class="item-top"
                        :class="{'item-context': index !== spSteps.length-1}"
                    >
                        {{ activity.content }}
                    </div>
                </el-timeline-item>
            </el-timeline>
        </div>
        <div class="mall-track">
            <label class="title">商城VOP进度详情</label>
            <el-timeline class="steps">
                <el-timeline-item
                    :class="{'active-status': index === mallStepList.length-1 && !showOperate}"
                    v-for="(activity, index) in mallStepList"
                    :key="index"
                    type="primary"
                >
                    <div class="item-title">
                        {{ activity.title }}
                    </div>
                    <div>{{ activity.createTime }}</div>
                    <div
                        class="item-top"
                        :class="{'item-context': index !== mallStepList.length-1 || showOperate}"
                        v-html="activity.content"
                    ></div>
                </el-timeline-item>
                <el-timeline-item
                    v-if="customerTab && !isMakeup"
                    class="active-status" 
                    type="primary"
                >
                    <track-dealmap
                        :order-info="orderInfo"
                        :supplier-info="supplierInfo"
                        :transmit-info="transmitInfo"
                        :task-id="taskId"
                    ></track-dealmap>
                    <!-- <service-dealmap title="处理方案" ref="serviceDeal" :data-list="serverDetail['MALL']" :transmit-info="transmitInfo['MALL']"></service-dealmap> -->
                </el-timeline-item>
            </el-timeline>
        </div>
    </div>
</template>
<script>
import TrackDealmap from "./trackdealmap";
export default {
    components: {
        TrackDealmap
    },
    props: {
        showOperate: {
            type: Boolean,
            default: true
        },
        orderInfo: {
            type: Object,
            default: () => {}
        },
        supplierInfo: {
            type: Object,
            default: () => {}
        },
        isMakeup: {
            type: Boolean,
            default: false
        },
        transmitInfo: {
            type: Object,
            default: () => {}
        },
        spSteps: {
            type: Array,
            default: () => []
        },
        mallSteps: {
            type: Array,
            default: () => []
        },
        customerTab: {
            type: String,
            default: null
        },
        taskId: {
            type: String,
            default: null
        }
    },
    computed: {
        mallStepList() {
            return this.mallSteps.map(step => {
                step.content = step.content
                    .replace(/\n/g, "<br/>")
                    .replace(/\n\r/g, "<br/>")
                    .replace(/↵/g, "<br/>");
                return step;
            });
        }
    }
};
</script>
<style lang="less" scoped>
 
.service-track {
    box-sizing: border-box;
    margin-bottom: 16px;
    border-radius: 8px;
    padding: 16px 0 32px 0;
    display: flex;
    background-color: #fff;
    width: 100%;
    .title {
        padding: 0 32px;
    }
    .sp-track,
    .mall-track {
        flex: 1;
    }
    .mall-track {
        border-left: 1px solid #eee;
    }
    .steps {
        margin: 24px 56px;
        .item-title {
            margin-bottom: 8px;
        }
        .item-top {
            margin-top: 8px;
        }
        .item-context {
            color:  #999;
        }
    }
}
</style>