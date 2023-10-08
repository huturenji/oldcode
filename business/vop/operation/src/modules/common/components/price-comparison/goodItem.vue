<template>
    <div
        class="order-box"
        @click.stop="onclick"
    >
        <div>
            <el-popover
                placement="top-start"
                width="250"
                trigger="hover"
            >
                <img
                    style="height: 200px"
                    :src="goods.mainImage"
                    alt=""
                />
                <img
                    slot="reference"
                    class="img"
                    :src="goods.mainImage"
                    alt=""
                />
            </el-popover>
        </div>
        <div class="infos">
            <div class="line1">
                <span>{{ "[分数:"+(goods.score?goods.score.toFixed(1): "--")+"]" }}</span>
                {{ goods.skuName }}
            </div>
            <div class="line2">
                <div>
                    {{
                        "sku:" +
                            goods.sku +
                            ";" +
                            ("规格:" + (goods.specify || "--"))
                    }}
                </div>
                <el-button
                    size="small"
                    type="primary"
                    v-if="detailed"
                    @click.stop="openDetail"
                >详情</el-button>
            </div>
            <div class="line3">
                <div class="values">
                    <span>{{ goods.supplierName }}</span>
                    <span>{{ "店铺:" + (goods.storeName || "--") }}</span>
                    <span class="pricespan">{{ "￥" + (goods.price || 0).toFixed(2) }}</span>
                </div>
                <div class="imgs">
                    <img
                        v-if="selected"
                        :src="require('assets/icon_choosed.png')"
                        alt=""
                    />
                    <img
                        v-if="showDel"
                        :src="require('assets/icon_cancelled.png')"
                        alt=""
                        @click="delte"
                    />
                </div>
            </div>
        </div>
        <div @click.stop="">
            <!-- 外层放div防止冒泡 -->
            <goodDetail
                :isShowModal="showDetail"
                :goodItem="goods"
                @close="showDetail = false"
            ></goodDetail>
        </div>
    </div>
</template>
<script>
import goodDetail from "./gooddetail.vue";
export default {
    components: {
        goodDetail
    },
    props: {
        goods: {
            //商品信息
            type: Object,
            default:() => {}
        },
        showDel: {
            //是否显示删除按钮
            type: Boolean,
            default: false
        },
        selected: {
            //是否显示选中效果
            type: Boolean,
            default: false
        },
        detailed: {
            //是否显示详情按钮
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            showPreview: false,
            url: "",
            showDetail: false //是否显示详情
        };
    },
    methods: {
        delte: function () {
            this.$emit("onDelItem", this.goods);
        },
        onclick: function () {
            this.$emit("onclick", this.goods);
        },
        openDetail: function () {
            console.log("openDetail");
            this.showDetail = true;
            // this.$emit("openDetail", this.goods);
        }
    }
};
</script>
<style lang="less">
.order-box {
    display: flex;
    align-items: center;
    background-color: #fff;
    margin-bottom: 2px;
    border-radius: 8px;
    .img {
        height: 80px;
        width: 80px;
        padding: 3px;
    }
    .infos {
        margin-left: 5px;
        flex: 1;
        .line1 {
            font-size: small;
            overflow-y: hidden;
            max-height: 80px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: normal !important;
            word-break: break-all !important;
        }
        .line2 {
            font-size: smaller;
            color: blue;
            display: flex;
            justify-content: space-between;
            padding-right: 10px;
        }
        .line3 {
            display: flex;
            margin-top: 5px;
            font-size: smaller;
            color: gray;
            justify-content: space-between;
            .values {
                display: flex;
                justify-content: space-between;
                flex: 1;
            }
            .imgs {
                width: 30px;
                margin-top: -11px;
                img {
                    height: 24px;
                }
            }
            .pricespan {
                color: red;
            }
        }
    }
}
</style>