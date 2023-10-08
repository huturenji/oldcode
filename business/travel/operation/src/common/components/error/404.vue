<template>
    <EmptyX tipsText='页面不见了'/>
</template>
<script>
  import tmHandler from "bislibs/requesthandler/traveloperationhandler.js";
  import EmptyX from "components/empty/emptyxx.vue";
  export default {
    components: {
        EmptyX
    },
    data: function () {
    	return {}
    },
    created: function () {
      // debugger
    	tmHandler && tmHandler.reFreshPage(()=>{})
    },
    mounted: function () {},
	activated: function () {},
    deactivated: function () {},
    watch: {},
    methods: {}
  }
</script>