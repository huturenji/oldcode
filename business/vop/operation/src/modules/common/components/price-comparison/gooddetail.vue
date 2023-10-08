<template>
    <div class="goodDetailC">
        <el-dialog
            :visible.sync="isShowModal"
            :close-on-click-modal="false"
            :modal-append-to-body="false"
            :show-close="false"
            center
            :style="{ width: 'auto' }"
        >
            <div
                slot="title"
                class="title"
            >
                <span
                    class="cancelBtn"
                    :style="{ visibility: 'hidden' }"
                    @click.stop="confirm"
                >×</span>
                <div>详情展示</div>
                <span
                    class="cancelBtn"
                    @click.stop="confirm"
                >×</span>
            </div>
            <div class="inconContent">
                <div class="imgArea">
                    <el-carousel
                        trigger="click"
                        height="400px"
                    >
                        <el-carousel-item
                            v-for="item in imgUrlArr"
                            :key="item"
                        >
                            <img
                                :style="{ width: '400px' }"
                                :src="item"
                                alt=""
                            />
                        </el-carousel-item>
                    </el-carousel>
                </div>
                <div class="mainInfos">
                    <div :style="{ fontSize: 'large', color: 'red' }">
                        {{ "￥" + (goodDetail.settlePrice || "0") }}
                    </div>
                    <div :style="{ fontSize: 'large' }">
                        {{ goodDetail.skuName }}
                    </div>
                    <div>{{ "商品编号：" + goodDetail.sku }}</div>
                    <div>
                        {{
                            "供应商：" +
                                (goodDetail.supplierName || goodDetail.supplierType)
                        }}
                    </div>
                    <div>
                        {{
                            "店铺：" +
                                (goodDetail.shopName || "--") +
                                ";" +
                                (goodDetail.owner == "1"
                                    ? "自营商品"
                                    : "非自营商品")
                        }}
                    </div>
                </div>
                <div class="detailinfos">
                    <div class="detailtitle">
                        规格参数
                    </div>
                    <div v-html="goodDetail.paramWithHtml"></div>
                </div>
                <div
                    v-if="!!goodDetail.wareList"
                    class="detailinfos"
                >
                    <div class="detailtitle">
                        包装清单
                    </div>
                    <div>{{ goodDetail.wareList }}</div>
                </div>
                <div class="detailinfos">
                    <div class="detailtitle">
                        商品详细
                    </div>
                    <div v-html="goodDetail.introduction2"></div>
                </div>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import pricecomparehandler from "bislibs/requestHandler/pricecomparehandler";
export default {
    props: {
        isShowModal: {
            type: Boolean,
            default: false
        },
        goodItem: {
            //商品信息
            type: Object,
            default: () => {}
        }
    },
    data: function () {
        return {
            goodDetail: {}, //商品详情
            imgUrlArr: [] //图片数组
        };
    },

    methods: {
        confirm() {
            this.$emit("close", false);
        },

        // 查询商品操作区列表
        getGoodDetail() {
            let that = this;

            that.$iLoading.show();
            pricecomparehandler
                .getDetailBySkuInfo({
                    sku: this.goodItem.sku
                })
                .then((res) => {
                    that.$iLoading.hide();
                    if (!!res && res.resultCode == 0) {
                        that.goodDetail = res.result;
                        //处理图片数组
                        if (
                            !(
                                that.goodDetail.imgUrls &&
                                that.goodDetail.imgUrls.length
                            )
                        ) {
                            that.imgUrlArr = [
                                that.goodDetail.mainImage,
                                that.goodDetail.mainImage
                            ];
                        } else {
                            that.imgUrlArr = that.goodDetail.imgUrls;
                        }
                        //处理图片渲染过大，自定义样式修改
                        that.goodDetail.introduction2 =
                            that.goodDetail.introduction.replaceAll(
                                "<img src",
                                "<img style='width:48vw' src"
                            );
                    }
                })
                .catch(() => {
                    that.$iLoading.hide();
                });
        }
    },
    watch: {
        isShowModal() {
            // this.isNoAuth = this.$props.isShowModal;
            if (this.isShowModal) {
                this.getGoodDetail();
            }
            return this.$props.isShowModal;
        }
    }
};
</script>

<style lang="less">
.el-dialog {
    width: 52%;
}
.Ptable {
    width: 100%;
    border-collapse: collapse;
    font-size: 12px;
    border-spacing: 0;
    line-height: 18px;
    th,
    td {
        padding: 8px;
        border: 1px solid #ddd;
        text-align: left;
    }
    td:first-child {
        width: 90px;
    }
    td:last-child {
        word-break: break-all;
    }
}
</style>
<style lang="less" scoped>
.goodDetailC {
    .title {
        width: 50vw;
        font-size: 24px;
        display: flex;
        justify-content: space-between;
        border-bottom: 1px solid #e2e2e2;
        align-items: center;
        .cancelBtn {
            float: right;
            font-size: 24px;
            padding: 0 10px;
            cursor: pointer;
            &:hover {
                color: #478aee;
            }
        }
    }
    .inconContent {
        max-height: 60vh;
        overflow-y: auto;
        margin: 0 auto;
        width: 50vw;
        // padding: 0 20px;
        .imgArea {
            margin: 0 auto;
            padding: 10px;
            // background: #e2e2e2;
            width: 420px;
            .imgOperator {
                display: flex;
                justify-content: space-around;
                align-items: center;
            }
        }
        .mainInfos {
            margin-top: 10px;
        }
        .detailinfos {
            margin-top: 10px;
            // border-top: 1px solid #e2e2e2;
            .detailtitle {
                text-align: center;
                font-size: large;
            }
        }
    }
}
</style>