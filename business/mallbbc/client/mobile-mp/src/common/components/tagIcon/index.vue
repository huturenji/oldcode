<!--
 * @Author: yuqichao qichao.yu@sinosun.com.cn
 * @Date: 2023-03-17 11:05:13
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-04-25 09:53:06
 * @FilePath: \mobile-miniprogram\src\common\components\tagIcon\index.vue
 * @Description: icon组件, 适用于列表中商品名称前添加折扣, 优惠等icon和详情页商品图片左下角的icon
 * 如果需要加在图片左下角则传参 [{ "businessType": "discount", iconType: "text" }]
 * 加在文字左边如果不需要自定义height 可以直接传['discount']
-->
<template>
    <view class="discount-icon-box">
        <image mode="heightFix" v-for="(item, index) in renderArr" :key="index" :class="item.iconType === 'text' || item.iconType === 'detailText' ? 'text-icon' : 'img-icon'" :src="item.src" :style="{ height: item.height }"></image>
    </view>
</template>

<script>
import { isString, isObject, isNotEmpty } from '@/utils/common.js';
export default {
    data() {
        return {
            renderArr: [],
            discount: {
                text: {
                    // src: "https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/common/icon/icon_common_shihui1.svg",
                    src: "https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/goods/shihui/icon_sousuo_shihuia.svg",
                    // width: "88rpx",
                    height: "30rpx",
                    iconType: "text",
                },
                detailText: {
                    src: "https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/goods/shihui/icon_xq_shihui.svg",
                    // width: "88rpx",
                    height: "30rpx",
                    iconType: "text",
                },
                img: {
                    src: "https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/goods/icon_common_shihui2.svg",
                    // width: "128rpx",
                    height: "128rpx",
                    iconType: "img",
                },
            },
        }
    },
    props: {
        iconArr: {
            type: Array,
            default: () => [{ "businessType": "discount", height: "30rpx", width: "88rpx", iconType: "text" }]
        },
    },
    watch: {
        iconArr: {
            handler(newVal) {
                if (isNotEmpty(newVal)) {
                    this.renderArr = newVal.map(e => {
                        if (isString(e)) {
                            return this[e].text;
                        } else if (isObject(e)) {
                            const type = e.businessType || "discount", iconType = e.iconType || "text", preset = this[type]?.[iconType];
                            if (preset) {
                                const { height, src, iconType } = preset;
                                // if (!e.width) {
                                //     e.width = width;
                                // }
                                if (!e.height) {
                                    e.height = height;
                                }
                                if (!e.iconType) {
                                    e.iconType = iconType;
                                }
                                e.src = src;
                                return e;
                            }
                        }
                    }).filter(e => !!e);
                }
            },
            deep: true,
            immediate: true
        },
    },
    computed: {

    }
}
</script>

<style scoped lang="scss">
.discount-icon-box {
    display: inline-block;
    .text-icon {
        vertical-align: -6rpx;
        margin-right: 10rpx;
    }
    .img-icon {
        position: absolute;
        bottom: 30px;
        left: 20px;
        z-index: 1;
        animation: show 1.2s forwards;
    }
    @keyframes show {
        0% {
            opacity: 0.1;
        }
        50% {
            opacity: 0.8;
        }
        100% {
            opacity: 1;
        }
    }
}
</style>
