<template>
    <div class="xck">
        <div class="banner">Banner</div>
        <div class="joinrule">
            <div class="circle">参与抽奖</div>
        </div>
        <div class="prizes">
            <div>奖品信息</div>
            <div
                class="prizeItem"
                v-for="(item, index) in prizeList"
                :key="index"
            >
                <!-- <div>{{ item.gradeName }}</div> -->
                <div class="prizeName">{{ item.inputName || item.name }}</div>
                <div class="prizeNum">{{ item.num }}</div>
            </div>
        </div>
        <div class="winners">
            <div>中奖名单</div>
            <div class="table">
                <div
                    class="winnerItem"
                    v-for="(item, index) in winnerList"
                    :key="index"
                >
                    <div>{{ item.name }}</div>
                    <div>{{ item.content }}</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { utils } from 'opcl'

export default {
    props: {
        // 奖品数据
        prizeList: {
            required: true,
            type: Array
        },
        winnerList: {
            required: true,
            type: Array,
            default: () => {
                return [
                    { name: '小李', content: 'Apple Watch 4 1 块' },
                    { name: '小李2', content: 'Apple Watch 4 3 块' },
                    { name: '小李', content: 'Apple Watch 4 5 块' }
                ]
            }
        }
    },
    watch: {
        prizeList(nVal, oVal) {
            if (nVal.length !== oVal.length) {
                this.updateCanvas()
            }
        }
    },
    data() {
        return {
            // imgUrl: getApp().globalData.imgUrl,
            // 设置指针默认指向的位置,现在是默认指向2个扇形之间的边线上
            rotateAngle: 0,
            rotateTransition: '',
            startRotateDegree: 0, // 开始转动的角度
            turnsRun: false,
            firstFlag: true,
            prizeNameWidth: '',
            prizeImgWidth: '',
            activityId: utils.getStorage('typeId')
        }
    },
    mounted() {
        this.$nextTick(() => {
            if (this.activityId == '1') {
                this.initCanvas()
            }
        })
    },
    activated() {
        this.updateCanvas()
    },
    methods: {
        updateCanvas() {
            this.$nextTick(() => {
                if (this.activityId == '1') {
                    this.initCanvas()
                }
            })
        }
    }
}
</script>

<style lang="less" scoped>
.xck {
    width: 375px;
    overflow-y: scroll;
    height: 640px;
    border-radius: 10px 10px 38px 38px;
    position: relative;
    background: white;
    padding: 10px;

    .banner {
        border: 1px solid #e2e2e2;
        height: 150px;
        margin-top: 20px;
        // background: url('../../../../../../themes/default/img/icon/icon_cj_hby.png')
        //     no-repeat center;
        // background-size: 100% 100%;
        border-radius: 10px;
    }
    .joinrule {
        margin: 15px auto;
        text-align: center;
        .circle {
            border-radius: 50%;
            width: 60px;
            height: 60px;
            display: inline-block;
            font-size: large;
            background: #e2e2e2;
            text-align: center;
            padding: 5px;
        }
    }
    .prizes {
        border: 1px solid #e2e2e2;
        border-radius: 10px;
        margin: 15px 0;
        padding: 10px;
        .prizeItem {
            display: flex;
            justify-content: space-between;
            margin: 7px 3px;
            .prizeName{
                flex: 2;
            }
            .prizeNum{
                flex: 1;
                text-align: end;
            }
        }
    }
    .winners {
        border: 1px solid #e2e2e2;
        border-radius: 10px;
        padding: 10px;
        .winnerItem {
            display: flex;
            justify-content: space-between;
            margin: 3px;
        }
        .table {
            max-height: 150px;
            overflow-y: auto;
        }
    }
}
</style>
