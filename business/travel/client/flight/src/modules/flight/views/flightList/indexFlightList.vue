<template>
    <div>
        <RealPage></RealPage>
    </div>
</template>
<script>
document.body.addEventListener('touchstart', function () { });
export default {
    components: {
        'RealPage': resolve => { require(['./flightList.vue'], resolve) } //异步加载组件
    },
    data: function () {
        return {
            loading: true,
            showPage: false
        }
    },
    created: function () {
    },
    mounted() {
    }
}
</script>
<style scoped lang="less">
    .fade-enter-active,
    .fade-leave-active {
        -webkit-animation-name: fadeIn;
        -webkit-animation-duration: .3s;
        -webkit-animation-iteration-count: 1;
        -webkit-animation-delay: 0s;
    }

    .fade-enter,
    .fade-leave-to {
        opacity: 0;
    }

    @-webkit-keyframes fadeIn {
        0% {
            opacity: 0;
        }

        33% {
            opacity: 0.33;
        }

        66% {
            opacity: 0.7;
        }

        100% {
            opacity: 1;
        }
    }
</style>