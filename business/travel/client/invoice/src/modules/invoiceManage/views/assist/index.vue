<template>
    <div class="main">
        <indexContent @showOff="showOff"></indexContent>
    </div>
</template>
<script>
const indexContent = ()=>import('./indexContent.vue');
export default {
    directives: {},
    components: {
        indexContent
    },
    data(){
        return {
        }
    },
    created: function () {
    },
    mounted: function () {},
    methods: {
        showOff(type) {
            let _this = this;
            _this.$emit('showOff', type);
        }        
    }
}

</script>
