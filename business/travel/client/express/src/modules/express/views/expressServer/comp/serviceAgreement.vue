<template>
    <div class="serviceAgreement">
        <div class="contectWrap">
            <div :class="item.class" v-for="(item,index) in serviceAgreement" :key="index">{{item.text}}</div>
        </div>
    </div>
</template>
<script>
import {serviceAgreementData} from '../enum/serviceAgreementEnum.js';
export default {
    components: {
    },
    data() {
        return {
            serviceAgreement:serviceAgreementData,//快递公司配置
        };
    },   
    methods: {
    }
};
</script>
<style scoped lang="less">
@import '~themes/default/styles/expressServer/comp/serviceAgreement.less';
</style>
