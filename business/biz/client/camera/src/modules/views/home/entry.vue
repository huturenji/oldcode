<template>
    <div class="entry">
        <div class="gridbox">
            <div class="lotterybox" :class="item.bgName" v-for="(item, index) in meun" :key="index" @click="gotoPage(item)">
            </div>
        </div>
        <div class="logoWrap"></div>
    </div>
</template>
<script>
export default {
    components: {
    },
    data() {
        return {
            meun:[//菜单
                {
                    name: "注册纸纹",
                    bgName:'register',
                    path:'/register'
                },
                {
                    name: "核验纸纹",
                    bgName:'verify',
                    path:'/verify'
                },
                {
                    name: "查看注册列表",
                    bgName:'registerList',
                    path:'/register/list'
                },
            ]
        };
    },
    beforeCreate(){
        if(!!!sessionStorage.getItem('userInfo')){
            this.$router.replace('/login');
        }
    },
    created() {},
    mounted() {
    },
    methods: {       
        /**
         * 页面跳转
         */
        gotoPage(item) {
            this.$router.push({ path: item.path});
        }
    }
};
</script>
<style lang="less" scoped>
.entry {
    position: relative;
    background: white url('@/themes/default/img/background.png') no-repeat;
    background-size: cover;
    .logoWrap{
        position: absolute;
        left: 16px;
        top: 12px;
        width: 199px;
        height: 56px;
        // background: url('@/themes/default/img/logo.png') left center no-repeat;
        background-size: 100%;
    }
}
.gridbox {
    display: flex;
    flex-flow: wrap;
    justify-content: center;
    min-width: 1080px;
    padding-top: 107px;
}
.lotterybox {
    width: 337px;
    height: 424px;
    cursor: pointer;
    &.register{
        background: url('@/themes/default/img/btn_input_nor.png') left center no-repeat;
        background-size: 100%;
        &:hover{
            background: url('@/themes/default/img/btn_input_hover.png') left center no-repeat;
            background-size: 100%;
        }
    }
    &.verify{
        background: url('@/themes/default/img/btn_verifica_nor.png') left center no-repeat;
        background-size: 100%;
        &:hover{
            background: url('@/themes/default/img/btn_verifica_hover.png') left center no-repeat;
            background-size: 100%;
        }
    }
    
    &.registerList{
        background: url('@/themes/default/img/btn_view_nor.png') left center no-repeat;
        background-size: 100%;
        &:hover{
            background: url('@/themes/default/img/btn_view_hover.png') left center no-repeat;
            background-size: 100%;
        }
    }
}
</style>