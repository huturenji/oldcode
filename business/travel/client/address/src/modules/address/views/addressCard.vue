<template>
    <swp-address ref='addressCard' :showCheck='false'></swp-address>
    <!-- <AddressCard ref='addressCard' :showCheck='false'></AddressCard> -->
</template>
<script>    
import addressHandler from '../components/addressHandler.js';    
// import AddressCard from '../components/addressCard.vue';
export default {
    mixins: [addressHandler.mixin.tChatEventMixin],
    directives: {
    },
    components: {
        // AddressCard,
    },
    data: function() {
        let managerData = addressHandler.stateManager.setData([], this)
        return Object.assign(managerData, {

        })
    },
    created: function() {
        // var _this = this;
        // //注册并监听t信返回事件        
        // addressHandler.appBack(function(){
        //     addressHandler.stateManager.closeTopPop(()=>{
        //         addressHandler.goBackPage('');
        //     })                                                 
        // }, this)
    },
    mounted: function() {},
    methods: {
        goBackFun(){
            addressHandler.closePage('');
        }
    }
}
</script>
<style lang="less">
</style>
