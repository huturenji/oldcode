<script>
import md5 from 'js-md5';
let Base64 = require('js-base64').Base64;
// import LoadingX from "components/loading/LoadingX.vue";
// import EmptyX from "components/empty/EmptyX.vue";
import expressHandler from './js/expressHandler.js';
export default {
    // components:{LoadingX,EmptyX},
    data(){
        return {
            API_HOST: "https://m.kuaidi100.com/app/",
            SECRET_KEY: "d35e02df8ccd457381dea56d9f7d29d8",
            CONAME:"bizcloud",
            APPID:"bizcloud"
        }
             
    },
    beforeCreate(){
        sinosdk.sino.onChildWindowClose(function (res) { expressHandler.closePage(null, 1); })
    },
    created(){
        let _this = this;
        _this.toThirdPage();
    },
    methods:{
        toThirdPage(){
            location.replace(`${window.location.origin}/bizcloud/static/kuaidi100/index.html`);
        }
    }
        
}
</script>

<style scoped lang="less">
    @import '~themes/default/styles/expressServer/expressDetail.less';
</style>