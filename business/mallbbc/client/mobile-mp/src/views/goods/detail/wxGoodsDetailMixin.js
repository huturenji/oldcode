
// 针对微信小程序商品详情富文本的兼容性处理
// 通过调研京东商品详情返回的数据，小程序和h5返回的商品详情的格式是各不一样的，所以针对小程序的商品详情要特殊处理，为了兼容性写法统一，故针对小程序的商品详情此时单独处理
// 该文件目前只针对京东企业购的商品 后续再去兼容其他供应商的
const mixin={
    data() {
        return {   
            detailImgList: [] // 处理后的详情图片集合（以备来日）
        }
    },    
    mounted() {          
    },

    onShow() {
        
    },
    
    methods: {
        //京东企业购返回的是这样的
        initWxNodes(str){
            try {
                let nodes = JSON.parse(str || "[]");
                this.detailImgList = nodes.filter(item=>!!item).map(item=>`https:${item}`);
            } catch (error) {
            }
        }
    }
}
export default mixin;