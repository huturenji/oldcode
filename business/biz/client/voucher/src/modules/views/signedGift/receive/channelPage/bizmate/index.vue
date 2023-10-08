<template>
    <div class="container">
        <div class='coupon'>
            <div class='btn' :class='{received}' @click.self='$emit("click")'>
                <div class='hand' v-if='!received'></div>
            </div>
        </div>
    </div>
</template>
<script>
export default{
    props: {
        received: {
            type: Boolean,
            default: false
        }
    }
}
</script>
<style lang="less" scoped>
.container{
    position: relative;
    width: 100%;
    height: 100vh;
    background: url('./img/background.png') 0 0 no-repeat;
    background-size: 100% 100%;

    .coupon{
        position: absolute;
        left: 50%;
        top: 68%;
        transform: translateX(-50%);
        width: 6.56rem;
        height: 2.64rem;
        background: url('./img/coupon.png') 0 0 no-repeat;
        background-size: 100% 100%;

        .btn{
            position: absolute;
            top: calc(50% - .06rem);
            right: 0.36rem;
            transform: translateY(-50%);
            width: 1.32rem;
            height: 1.39rem;
            background: url('./img/btn.png') 0 0 no-repeat;
            background-size: 100% 100%;
            cursor: pointer;

            &.received{
                background: url('./img/btn2.png') 0 0 no-repeat;
                background-size: 100% 100%;
            }

            .hand{
                position: absolute;
                bottom: -.4rem;
                left: 50%;
                width: .7rem;
                height: .75rem;
                background: url('./img/hand.png') 0 0 no-repeat;
                background-size: 100% 100%;
                cursor: default;
            }
        }
    }
}
</style>