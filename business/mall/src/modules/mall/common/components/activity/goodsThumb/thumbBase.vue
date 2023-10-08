<template>
</template>
<!-- 说明：这是一个父类，所有的基础属性、函数都在这里定义。
 -->
<script>
    import thumbnail from './thumbnail';
    import priceLabel from 'common/components/base/priceLabel'
    export default {
        components: {thumbnail, priceLabel},
        props: {
            img: {//商品图片
                type: String,
                default: ''
            },
            title: {//商品标题
                type: String,
                default: ''
            },
            price: {//商品售价
                default: 0
            },
            status: {//商品状态（已下架，无货，剩余数量等）
                type: Object,
                defalut: null,
            },
            discount:{//折扣信息
                type: String,
                default: ''
            }
        },
    }

</script>
