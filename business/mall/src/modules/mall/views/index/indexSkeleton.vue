<template>
    <div @touchmove.stop="eventStop">
        <indexSkeleton v-if="loading"></indexSkeleton>
        <RealPage v-show="!loading" @showOff="showOff"></RealPage>
    </div>
</template>
<script>
    import indexSkeleton from 'common/components/skeleton/index.vue';
    export default {
        components: {
            indexSkeleton,
            'RealPage': resolve => {require(['./index.vue'], resolve)} //异步加载组件
        },
        data: function () {
            return {
            	loading:true,
            }
        },
        created: function () {
        },
        mounted() {
        },
        methods: {
            showOff(type){
                let _this = this;
                _this.loading = false;
            },
            eventStop(){
                try {
                    event.stopPropagation();
                } catch (error) {

                }
            }
        },
    }
</script>