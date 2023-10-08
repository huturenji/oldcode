<template>
    <div class="timeline">
        <div
            class="timeline-item"
            v-for="(item,index) in expressList"
            :key="index"
        >
            <div class="timeline-item-label">
                {{ item.recordTime }}
            </div>
            <div class="timeline-item-tail"></div>
            <div
                class="timeline-item-header"
                :class="[{'timeline-item-icon':item.showState},item.showState?`${item.state}`:'']"
            >
            </div>
            <div class="timeline-item-content">
                <div
                    :class="{'state':item.state=='SIGNED'}"
                    v-if="item.showState"
                >
                    {{ expressStateMap[item.state] }}
                </div>
                <div class="desc">
                    {{ item.description }}
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import utils from "bislibs/utils";
export default {
    data() {
        return {
            expressStateMap: utils.expressStateMap
        };
    },
    props: {
        expressList: {
            type: Array,
            default: () => []
        }
    },
    computed: {
        expressTime() {
            return function(time, type) {
                return type == "true"
                    ? this.$moment(time).format("YYYY年MM月DD日 HH:mm:ss")
                    : this.$moment(time).format("HH:mm:ss");
            };
        }
    }
};
</script>
<style lang="less" scoped>
 
.timeline {
    padding: 24px 24px 0 24px;
    &-item {
        position: relative;
        margin: 0;
        padding-bottom: 24px;

        &:last-child {
            .timeline-item-tail {
                display: none;
            }
            padding-bottom: 0;
        }

        &-label {
            position: absolute;
            top: -5px;
            width: 198px;
            text-align: right;
        }

        &-tail {
            position: absolute;
            top: 8px;
            left: 225px;
            height: 100%;
            border-left: 1px dashed #e8e8e8;
        }

        &-header {
            position: absolute;
            top: 5px;
            left: 225px;
            width: 8px;
            height: 8px;
            background-color: #e8e8e8;
            border-radius: 50%;
            transform: translate3d(-50%, -50%, 0);
        }

        &-icon {
            width: 24px;
            height: 24px;
        }

        .DELIVERING {
            background: url("../~assets/icon_delivering.png")
                no-repeat center;
        }

        .DISPATCHING {
            background: url("../~assets/icon_dispatching.png")
                no-repeat center;
        }

        .SIGNED {
            background: url("../~assets/icon_signed.png")
                no-repeat center;
        }
        .ORDER_CREATED {
            background: url("../~assets/icon_order_created.png")
                no-repeat center;
        }
        .REPOSITORY_PROCESSING {
            background: url("../~assets/icon_repository_processing.png")
                no-repeat center;
        }
        .FAILED {
            background: url("../~assets/icon_failed.png")
                no-repeat center;
        }
        .CANCELLED {
            background: url("../~assets/icon_cancelled.png")
                no-repeat center;
        }
        &-content {
            position: relative;
            top: -5px;
            left: 246px;
            font-size: 14px;
            word-break: break-word;
            width: calc(~"100% - 260px");
            .desc {
                color: #999;
                margin-top: 8px;
            }
            .state {
                color: #23b45d;
            }
        }
    }
}
</style>