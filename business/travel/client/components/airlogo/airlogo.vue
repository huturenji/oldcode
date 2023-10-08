<template>
    <div v-if='airlogos.indexOf(airCode)>-1'
         :class='"icon-flight"+" icon-"+airCode'></div>
    <div v-else class='icon-iconDefault'></div>
</template>
<script>
export default {
    directives: {
    },
    components: {
    },
    props: {
        airCode: {
            type: String,
            default: ''
        }
    },
    data: function () {
        return {
            airlogos: require('./sprite/airLogoSprite.json')
        }
    },
    created: function () {
    },
    mounted() {
    },
    watch: {
    },
    methods: {
    }
}
</script>
<style scoped lang="less">
    @import './sprite/sprite_airlogo.less';
</style>
