<template>
    <div class="content">
        <Announcement v-if='isCurrent' class='announcement' :config="{businessTypes: '4'}"/>
        <div class='tip'>
            <img src='~themes/default/img/train/logo.png'/>
            <div class='text'>火车票由同程火车票提供服务</div>
        </div>
        <div class='btn' @click="goTongCheng">点击跳转到同程火车票</div>
    </div>
</template>

<script>
const Announcement = () => import('components/announcement/index');
export default {
    components: {Announcement},
    props: {
        currentView: {
            type: String
        }
    },
    computed: {
        isCurrent(){
            return this.currentView == 'Train'
        }
    },
    mounted(){
        this.$emit('mounted')
    },
    methods: {
        goTongCheng(){
            sinosdk.sino.openThirdApplet({url: 'https://m.ly.com/universal/touch/?refid=85141262#/'})
        }
    }
}
</script>
<style lang='less' scoped>
@import '~themes/default/styles/componets/train/index.less';
</style>