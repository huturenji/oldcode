<template>
    <div>
         <swp-psg-list :psgMgrFlag='true' ref='psg' hTitle='乘客管理'></swp-psg-list>
         <!-- <Passenger :psgMgrFlag='true' ref='psg' hTitle='乘客管理'></Passenger> -->
    </div>
</template>

<script>
// import Passenger from '../Passenger/list.vue';
import passengerHandler from '../Passenger/passengerHandler.js'
export default {
    directives: {
    },
    components: {
        // Passenger,
    },
    data: function() {
        passengerHandler.stateManager.setData(null,this);
        return {
        }
    },
    beforeRouteLeave(to, from, next) {
        console.log(' beforeRouteLeave !');
        passengerHandler.stateManager.closeTopPop(()=>{
            next();
        });
    },
    created: function() {
        //注册并监听t信返回事件
        sinosdk.sino.onBack(function () { //点击app返回事件
            passengerHandler.stateManager.closeTopPop(()=>{
                passengerHandler.closePage('');
            });
        },this);
    },
    mounted: function() {},
    methods: {}
}
</script>

<style>
</style>