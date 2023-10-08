/*
 * mall的混入js
 */
import extendUtils from 'common/lib/utils';
import goodsHandler from 'common/lib/requestHandler/goodsHandler.js';
import cartHandler from 'common/lib/requestHandler/cartHandler.js';

var mallMixin = {
    data(){
        return {
        }
    },
    methods: {

        /**
         * 校验加入购物车的数量是否超过了库存,如果超过了库存，返回true, 否则返回false
         */
        async checkNumLimit(goods){ 
          let that = this; 
          let stockList = await that.getRemainNum(goods); //查询要加入购物车的目前库存数量
          let cartList = await that.getCartListNum(); //查询购物车列表数据

          let flag = false;
          if(stockList.length > 0){
            for(let i=0; i < stockList.length; i++){
              const item = stockList[i];
              if(!!item.remainNum && item.remainNum >= 0){//此时说明该商品的库存是存在的
                let index = cartList.findIndex(temp => {
                  return temp.sku == item.sku; 
                })
                
                let indexSet = goods.findIndex(temp => {
                  return temp.sku == item.sku; 
                })


                if(index > -1){ //说明购物车里面存在该商品
                  flag = (parseInt(goods[indexSet].quantity) + parseInt(cartList[index].quantity)) > parseInt(item.remainNum); //如果购物车里面的商品加上要加入的商品大于库存，此时不能加入购物车
                  break;
                }
              }
            }
          }
          return flag;
        },


        /**
         * 查询该商品的库存数量
         * @param goods(Array) 要加入的商品项数组
         */
        getRemainNum(goods){
          let that = this;
          return new Promise(async (resolve, reject) => {
            if(!!!goods || goods.length <= 0 ){res([])};

            //整合地址id参数
            let addressId = await goodsHandler.getAddressId();
            let arr = addressId.split('/');
            let areaId1 = arr[0] || '';
            let areaId2 = arr[1] || '';
            let areaId3 = arr[2] || '';
            let areaId4 = arr[3] || '';
            
            //整合地址sku参数
            let ids = goods.map(item=>{
              return {
                sku: item.sku,
                num: item.quantity,
              }
            })

            let param = {
                stockRequire:ids,
                areaId1,
                areaId2,
                areaId3,
                areaId4,
                supplierId: goodsHandler.supplierId,
            }
            goodsHandler.getlistStock(param).then(res => {
              if(res.resultCode == 0 && !!res.result && res.result.stock.length > 0){
                resolve(res.result.stock);               
              }else{
                resolve([]);
              }
            }).catch(e=>{ 
                console.log(e);
                resolve([]);
            })
          })
        },

         /**
         * 获取购物车的商品列表 
         */
        getCartListNum(){
          let that = this;
          let param = {
            "userId": cartHandler.userId,
            "companyId": cartHandler.companyId,
            "channelId": cartHandler.channelId,
            "supplierId": cartHandler.supplierId,
          };
          return new Promise((resolve, reject) => {
              cartHandler.getCartList(param).then(res=>{
                  if(res.resultCode == 0){
                      resolve(res.result.list);
                  }else{
                      resolve([]);
                  }
              }).catch(e=>{ 
                  console.log(e);
                  resolve([]);
              })
          })
        },

        
        /**
         * 加入购物车 全局混入的方法
         * @param {*} goods 需要加入购物车的item
         */
        setIntoShopCar(goods){
          let that = this;
          return new Promise(async (resolve, reject) => {
            let flag = await that.checkNumLimit(goods);
            if(!!flag){
              extendUtils.showToast('亲，库存无法支持购买更多');
              resolve(false);
              return
            }
    
            let param = {
              "userId": cartHandler.userId,
              "companyId": cartHandler.companyId,
              "channelId": cartHandler.channelId,
              "supplierId": goods[0].supplierId || cartHandler.supplierId,
              "goods":goods
            }
            this.$loading.show();
            
            cartHandler.addCartList(param).then(res=>{
              this.$loading.hide();
              if(res.resultCode == 0){
                //加入购物车成功之后要将购物车页面的该商品置为选中状态
                that.setGoodsChecked(goods);
                //刷新购物车的数量
                that.$store.dispatch('getCartNum');
                resolve(true);
              }
            }).catch(e=>{
              this.$loading.hide();
              console.log(e);
              reject(false)
            })
          })
        },

        /**
         * 加入购物车之后要将该商品置为选中的状态，通过localStorage缓存来判断 缓存的key必须为cartUpdatedList，因为购物车页面（cart.vue）用它来判断添加属性checked
         * @param goods（Array） 加入购物车成功的商品列表
         */
        setGoodsChecked(goods){
          if(!goods){return};
          //获取缓存中的购物车商品 用来判断购物车商品选中状态判断的
          let cartUpdatedList = !!extendUtils.getStorage(goodsHandler.primaryKey +'_cartUpdatedList')?JSON.parse(extendUtils.getStorage(goodsHandler.primaryKey +'_cartUpdatedList')):[];
          goods.forEach(item => {
            let index = cartUpdatedList.findIndex(temp => {
              return temp.sku == item.sku;
            })
            if(index>-1){
              cartUpdatedList[index].checked = true;
            }
          })
          //更新缓存
          extendUtils.setStorage(goodsHandler.primaryKey + '_cartUpdatedList', JSON.stringify(cartUpdatedList));
        },

        /**加入产品收藏 全局混入的方法
        *@param skus Array 支持批量新增 参数类型必须是数组 skus 事例： [{sku:String,supplierId:1}]
        **/
        addFavorite(skus){
          let param = {
            skus: skus,
            "userId": goodsHandler.userId,
            "companyId": goodsHandler.companyId,
            "channelId": goodsHandler.channelId,
          }
          this.$loading.show();
          return new Promise((resolve,reject)=>{
            goodsHandler.addFavoriteList(param).then(res=>{
              this.$loading.hide();
              if(res.resultCode == 0){
                extendUtils.showToast('收藏成功');
                resolve(true);
              }
            }).catch(e=>{
              console.log(e);
              this.$loading.hide();
              reject(false)
            })
          })

          

        },

        /****
         * 全局混入的处理商品规格相关的东西 此处处理目前仅在两个地方1.购物车页面的展示 2.购物车分享页面的展示 因为这两个地方只需要展示spec字段，不需要展示具体的属性key
         * 之前spec均为字符串，后续改动为json字符串，同时做了兼容
         */
        dealSpecification(spec){
          if(!!!spec){ return ''}
          try{
            let specObj = JSON.parse(spec);
            if(extendUtils.getClass(specObj) == 'String'){
              specObj = JSON.parse(specObj);
            }
            return specObj.spec || '';
          }catch(e){
            // console.log(e);
            return spec;
          }
          
        },


        /****
         * 全局混入的处理商品规格相关的东西 此处处理目前仅在两个地方1.商品下单页面 2.订单详情页面。此时需要特殊处理显示产品不同的规格key的名称以及内容（例如 颜色: 白色）
         * 之前spec均为字符串，后续改动为json字符串，同时做了兼容
         */
        dealSpecificationKeys(specObjStr){
          if(!!!specObjStr){ return ''}
          try{
            let specObj = JSON.parse(specObjStr);
            if(extendUtils.getClass(specObj) == 'String'){
              specObj = JSON.parse(specObj);
            }
            let specDetail = specObj.specDetail || [];
            let str = ''
            specDetail.forEach(item => {
              str += `${!!item.saleName?item.saleName:''}: ${!!item.saleValue?item.saleValue:''} `;
            })
            return str;
          }catch(e){
            // console.log(e);
            return specObjStr;
          }
        },

        //部分商品是没有图片的（附件或者赠品，此时用默认图片）
        dealImg(imgUrl){
          if(!!!imgUrl){
            return this.BMallConfig.GOODS.DEFAULT_THUMBNAIL_GIFT
          }else{
            return imgUrl;
          }
        },
    }
  }

export default mallMixin;
