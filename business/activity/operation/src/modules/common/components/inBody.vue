<template>
    <div>
        <slot></slot>
    </div>
</template>

<script>
export default {
   
    data() {
        return {
            
        };
    },
    mounted(){
        const node = this.$mount().$el
        document.body.appendChild(node)
    },
    destroyed(){
        const node = this.$mount().$el
        node.remove()
    },
    methods: {
       
    },
   
};
</script>

<style lang="less">

</style>