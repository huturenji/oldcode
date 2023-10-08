<template>
    <div class="imgbadge">
        <img
            v-if="imgSrc"
            class="logoImg"
            :src="imgSrc"
        />
        <img
            v-else
            class="logoImg"
            :src="require('assets/icon_empty.png')"
        />
        <div
            class="badge"
            @click="onBagdeClick"
        >
            —
        </div>
    </div>
</template>

<script>
export default {
    props: {
        imgSrc: {
            type: String,
            default: ""
        }
    },
    created() {},
    mounted() {},
    methods: {
        onBagdeClick() {
            this.$emit("onBagdeClick");
        }
    }
};
</script>

<style scoped lang="less">
.imgbadge {
    position: relative;

    img {
        width: 60px;
        height: 60px;
        margin: 15px 0px;
    }
    .badge {
        position: absolute;
        color: white;
        background: red;
        font-size: 12px;
        width: 15px;
        height: 15px;
        border: 1px solid red;
        border-radius: 50%;
        text-align: center;
        top: 0px;
        right: -15px;
        line-height: 15px;
        cursor: pointer;
    }
}
</style>