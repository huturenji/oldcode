<template>
  <div class="preview">
            <div class="box" v-if="type == 'img'">
              <img

                class="img"
                :src="url"
            />
            </div>
            <iframe
                v-else-if="type == 'pdf'"
                :src="url"
                style="width: 100%; height: calc(100vh - 125px)"
            ></iframe>
  </div>
</template>
<script>
  export default {
   
    data() {
      return {
        type:this.$route.query.type,
        url:this.$route.query.url
      };
    },
    created() {
       
    },
    methods: {
      handleClick(tab, event) {
        
      }
    }
  };
</script>
<style scoped lang="less">
  .preview{
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  // 嵌套一层盒子 解决长图片无法显示的问题
  .box{
    height: 100%;
  }
  .img{
    max-width: 100%;
  }
</style>