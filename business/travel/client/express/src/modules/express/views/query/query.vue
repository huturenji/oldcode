<template>
	<div class='query'>
        <div class="iframeWrap">
            <iframe v-if=" nu != ''" :src='src+nu+"&sswbv_multipage=false"' class='iframeWindow' id='express'></iframe>
        </div>
        <div class="searchOutWrap">
            <div class="searchWrap">
                <input class="searchInput" type="text" placeholder="请输入快递单号" v-model="number">
                <div class="searchBut cursorp" @click="searchdo"></div>
            </div>            
        </div>
   	</div>
</template>
<script>
    import expressHandler from '../expressServer/js/expressHandler.js';
    export default {
        mixins: [expressHandler.mixin.tChatEventMixin],
        data() {
            return {
                src:'https://m.kuaidi100.com/result.jsp?nu=',
                nu:this.$route.query.nu || '',
                number: this.$route.query.nu || '',
            }
        },
        created(){
            let _this = this;
		},
		mounted(){
		},
        methods: {
            /**
            * T信回退事件的注册回调 必须是goBackFun
            */
            goBackFun(){
                this.$router.back();            
            },
			/**
			 * 查询
			 */	
			searchdo(){
                let _this = this;
                let tempNum = _this.number;
                _this.nu = '';
                setTimeout(()=>{
                    _this.nu = tempNum;
                },500)
                
			}
        }
    }
</script>
<style scoped lang="less">
@import '~themes/default/styles/query/query.less';        
</style>

