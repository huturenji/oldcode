<template>

</template>

<script>
  import config from 'common/lib/config'
  export default {
    name:'index-transfer',
    /***
     * 用路由守卫实现页面的重定向，加载不同的页面（目前用处是用来判断跳转京东的首页和苏宁的首页）
     */
    beforeRouteEnter (to, from, next) {
      if(!!to && !!to.query.supplierId){
        next(vm => {
          // 通过 `vm` 访问组件实例
          vm.$router.push({
            path: config.SUPPLIER_Map[to.query.supplierId].path,
            query: {
              supplierId: to.query.supplierId
            }
          }).catch(() => {});
        })
        
      }else{
        console.log('url没有配置supplierId')
      }

      
    }
  }
</script>

