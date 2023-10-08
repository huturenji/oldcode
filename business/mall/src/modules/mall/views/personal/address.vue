<template>
    <div>
        <Address ref='addressComp' addressType="addressManagement" :showCheck='false'></Address>
    </div>
</template>
<script>
import Address from 'commonComp/address/address.vue';
import extendUtils from 'common/lib/utils';
import tChatEventMixin from 'common/lib/mixin/tChatEventMixin';
export default {
    mixins: [tChatEventMixin],
    components:{
        Address
    },
    data() {
        let managerData = extendUtils.stateManager.setData([],this)
        return Object.assign(managerData, {

        })
    },
    created(){
        
    },
    methods: {
        /**
         * T信回退事件的注册回调 必须是goBackFun
         */
        goBackFun(){
            this.$router.back();
        },
    }
};
</script>
<style scoped lang="less">

</style>