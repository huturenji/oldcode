import {
    getStorage,
    setStorage,
    removeStorage,
    isEmpty
} from '@/utils/utils';
import _uniqBy from 'lodash/uniqBy';

let user_info = getStorage('user_info')||"{'user_name':'seller'}";
let user_name = JSON.parse(user_info).user_name
let SAVEGOODSKEY = `${user_name}_goodsData`


export const saveData = (_this) => {
    const { step,top_nav_step,goods_cat,sele_goods_cat_data, spec_data_table, goods_img_data, goods_video_data, spec_set_data,tab_spec_list,spu_img_data,spuDetail } = _this.state;
    
    let values = _this.props.form.getFieldsValue();
    // 如果第三级分类不存在,直接跳到第一步，不进行后面两步的缓存
    if(sele_goods_cat_data.length<3){
        let params = {}
        params.step=step
        params.top_nav_step=top_nav_step
        params.goods_cat = goods_cat 
        params.sele_goods_cat_data_copy = sele_goods_cat_data
        setStorage(SAVEGOODSKEY,JSON.stringify(params))
        return
    }

    if (values) {
        let params = {};
        params.step=step
        params.top_nav_step=top_nav_step
        params.goods_cat = goods_cat
        params.sele_goods_cat_data_copy = sele_goods_cat_data 
       
        if (goods_video_data[0].fileList.length > 0) {
            params.goodsVideo = goods_video_data[0].fileList[0].response.data.path;//视频
        }
        params.categoryId1 = sele_goods_cat_data[0].categoryId;//3级分类ID
        params.categoryId2 = sele_goods_cat_data[1].categoryId;//3级分类ID
        params.categoryId3 = sele_goods_cat_data[2].categoryId;//3级分类ID
        let categoryNamePath = []
        sele_goods_cat_data.forEach((item)=>{
            categoryNamePath.push(item.categoryName)
        })
        params.categoryNamePath = categoryNamePath.join('->')
        params.brandId = values.brandId;//品牌ID
        params.spuName = values.spuName;
        //   params.spuBrief = values.spuBrief;//商品广告语
        params.sellNow = values.sellNow;//发布类型，false-放入仓库（待售）；true-立即售卖（在售）
        //   params.storeIsRecommend = values.storeIsRecommend;//商品推荐，0-不推荐；1-推荐（店铺内是否推荐）
        params.vatInvoice = values.vatInvoice;//是否可以开具增值税发票0-不可以；1-可以
        params.spuRelatedTemplateIdTop = values.relatedTemplateIdTop > 0 ? values.relatedTemplateIdTop : null;//顶部关联版式
        params.spuRelatedTemplateIdBottom = values.relatedTemplateIdBottom > 0 ? values.relatedTemplateIdBottom : null;//底部关联版式
        params.virtualSales = values.virtualSales;//虚拟销量

        params.spuVideo = '';
        // 处理图片
        let spuImageList = [];
        if(spu_img_data[0]){
            for(let s = 0; s < spu_img_data[0].fileList.length; s++) {
                let item = spu_img_data[0].fileList[s].response;
                if (item.state == 200) {
                    spuImageList.push({
                        image: item.data.path,
                        imageUrl:item.data.url,
                        imageType: 2   
                    });
                }
            }
        }
        params.spuImageList = spuImageList
        //富文本
        params.spuDetail = spuDetail

        params.skuList = [];

        //运费模板
        if (values.express_method == 'common') {
            params.freightFee = values.freightFee;//统一运费
        } else {
            params.freightId = values.freightId;//运费模板
        }

        //店铺分类的处理
        params.storeInnerLabelList = _uniqBy(_this.sel_cat_data,'innerLabelId');

        //绑定的商品标签
        params.spuLabelList = [];
        if (values.serviceLabelIds != undefined && values.serviceLabelIds.length > 0) {
            values.serviceLabelIds.forEach(item => {
                for (let i = 0; i < _this.service_list.length; i++) {
                    if (item == _this.service_list[i].labelId) {
                        params.spuLabelList.push({
                            spuLabelId: item,
                            spuLabelName: _this.service_list[i].labelName
                        });
                        break;
                    }
                }
            });
        }

        //属性信息
        params.attributeList = [];//平台检索属性
        params.parameterGroups = [];//店铺自定义属性

        //平台检索属性
        if (_this.search_attr_list.length > 0) {
            _this.search_attr_list.forEach((item) => {
                if (values[`search_attr_${ item.attributeId}`] != undefined && values[`search_attr_${ item.attributeId}`]) {
                    //根据属性值id获取属性值
                    let cur_attr_val = item.attributeValueList.filter(attr_val => attr_val.attributeValueId == values[`search_attr_${ item.attributeId}`])[0].attributeValue;
                    params.attributeList.push({
                        attributeId: item.attributeId,
                        attributeName: item.attributeName,
                        attributeValue: cur_attr_val,
                        attributeValueId: values[`search_attr_${ item.attributeId}`]
                    });
                }
            });
        }

        //店铺自定义属性
        if (values.groupId != undefined && values.groupId && _this.store_attr_group_attr_list.length > 0) {
            // 根据groupId，拿到所在分组信息
            let select_group = _this.store_attr_group.filter((item)=>values.groupId.includes(item.groupId))
            // 所有分组选择的属性信息
            let parameterList = []
            _this.store_attr_group_attr_list.forEach((item) => {
                if (values[`store_attr_${ item.parameterId}`] != undefined && values[`store_attr_${ item.parameterId}`]) {
                    parameterList.push({
                        groupId:item.groupId,
                        parameterId: item.parameterId,
                        parameterName: item.parameterName,
                        parameterValue: values[`store_attr_${ item.parameterId}`]
                    });
                }
            });
            // 构造数据 分组归类
            let group_list = []
            select_group.forEach((item)=>{
                let temp = parameterList.filter((ele)=>ele.groupId==item.groupId)
                if(temp.length>0){
                    group_list.push({
                        groupId:item.groupId,
                        groupName:item.groupName,
                        parameterList:temp

                    })
                }
            })
            params.parameterGroups = group_list
        }

        if (spec_data_table.list.length > 0) {
            //规格信息列表,多规格必传
            params.specInfoList = [];
            // for (let i in spec_set_data[0].show_data) {change by wbb
            for(let i = 0; i < spec_set_data[0].show_data.length; i++) {
                let item_spec_data = spec_set_data[0].show_data[i];
                let tmp_spec_data = {};//选择的规格数据
                tmp_spec_data.specId = item_spec_data.specId;
                tmp_spec_data.specName = item_spec_data.specName;
                tmp_spec_data.isMainSpec = item_spec_data.is_img_spec != undefined && item_spec_data.is_img_spec ? 1 : 0;
                tmp_spec_data.specValueInfoList = [];
               
                for(let j = 0; j < item_spec_data.showValList.length; j++) {
                    let tmp_spec_val_data = {};
                    tmp_spec_val_data.specValueId = item_spec_data.showValList[j].specValueId;
                    tmp_spec_val_data.specValueName = item_spec_data.showValList[j].specValueName;
                    if (item_spec_data.is_img_spec != undefined && item_spec_data.is_img_spec) {
                        //如果是图片规格的话需要传图片
                        tmp_spec_val_data.imageList = [];
                        let cur_img_data = goods_img_data.filter(item => item.specValueId == item_spec_data.showValList[j].specValueId)[0].fileList;
                        if (cur_img_data.length == 0) {
                            return false;
                        }

                        for(let s = 0; s < cur_img_data.length; s++) {
                            let item = cur_img_data[s].response;
                            if (item.state == 200) {
                                tmp_spec_val_data.imageList.push({
                                    image: item.data.path,
                                    imageUrl:item.data.url,
                                    isMain: s == 0 ? 1 : 2//主图标识[1==主图,2==非主图]
                                });
                            }
                        }

                    }
                    tmp_spec_data.specValueInfoList.push(tmp_spec_val_data);
                }
                params.specInfoList.push(tmp_spec_data);
            }

            //货品列表--启用规格必填
            for(let sku = 0; sku < spec_data_table.list.length; sku++) {
                let sku_item = spec_data_table.list[sku];
                let sku_data = {};//每个sku的数据

                sku_data.specInfoList = [];
                for(let spec = 0; spec < sku_item.spec_info.length; spec++) {
                    let spec_data = {};
                    spec_data.specId = sku_item.spec_info[spec].specId;
                    spec_data.specName = sku_item.spec_info[spec].specName;
                    spec_data.specValueId = sku_item.spec_info[spec].specValueId;
                    spec_data.specValueName = sku_item.spec_info[spec].specValueName;
                    sku_data.specInfoList.push(spec_data);
                }

                //   sku_data.marketPrice = sku_item.marketPrice;
                sku_data.salePrice = sku_item.productPrice;
                sku_data.settlementPrice = sku_item.settlementPrice; //结算价
                sku_data.skuStock = sku_item.productStock;
                sku_data.skuStockWarning = sku_item.productStockWarning;
                sku_data.weight = sku_item.weight;
                sku_data.length = sku_item.length;
                sku_data.width = sku_item.width;
                sku_data.height = sku_item.height;
                //   sku_data.productCode = sku_item.productCode;
                sku_data.sku = sku_item.productId;
                sku_data.barCode = sku_item.barCode;
                sku_data.state = sku_item.state;//是否启用，1-启用；2-不启用
                //   sku_data.isDefault = sku_item.isDefault;//是否默认货品：0-否；1-是，只有一个默认，如果未设置默认，则默认第一个货品

                sku_data.skuName = tab_spec_list[sku].skuName;
                sku_data.detail = tab_spec_list[sku].description;
                sku_data.skuVideo = tab_spec_list[sku].skuVideo;
                sku_data.taxCode = tab_spec_list[sku].taxCode;
                sku_data.taxRate = tab_spec_list[sku].taxRate;
                // 处理图片
                let imageList = [];
                for(let s = 0; s < goods_img_data[sku].fileList.length; s++) {
                    let item = goods_img_data[sku].fileList[s].response;
                    if (item.state == 200) {
                        imageList.push({
                            image: item.data.path,
                            imageUrl:item.data.url,
                            imageType: 2   
                        });
                    }
                }
                sku_data.imageList = imageList
                // 处理版式
                sku_data.relatedTemplateIdTop = values[`relatedTemplateIdTop${sku}`] > 0 ? values[`relatedTemplateIdTop${sku}`] : null;//顶部关联版式
                sku_data.relatedTemplateIdBottom = values[`relatedTemplateIdBottom${sku}`] > 0 ? values[`relatedTemplateIdBottom${sku}`] : null;//底部关联版式

                params.skuList.push(sku_data);
            }

        } else {
            //默认sku信息 
            let defaultSku = {};
            let tab_spec_init_item = tab_spec_list[0]
            //   defaultSku.marketPrice = values.marketPrice;//市场价
            defaultSku.salePrice = values.productPrice;//销售价
            defaultSku.settlementPrice = values.settlementPrice;//结算价
            defaultSku.skuStock = values.goodsStock;//商品库存
            defaultSku.skuStockWarning = values.stockWarning;//库存预警值
            defaultSku.weight = values.weight;//重量kg
            defaultSku.length = values.length;//长度cm
            defaultSku.width = values.width;//宽度cm
            defaultSku.height = values.height;//高度cm
            defaultSku.sku = values.productId;//商品sku
            defaultSku.barCode = values.barCode;//条形码
            defaultSku.skuName = tab_spec_init_item.skuName;
            defaultSku.detail = tab_spec_init_item.description;
            defaultSku.skuVideo = tab_spec_init_item.skuVideo;
            defaultSku.taxCode = tab_spec_init_item.taxCode;
            defaultSku.taxRate = tab_spec_init_item.taxRate;
            // 处理图片
            let imageList = [];
            for(let s = 0; s < goods_img_data[0].fileList.length; s++) {
                let item = goods_img_data[0].fileList[s].response;
                if (item.state == 200) {
                    imageList.push({
                        image: item.data.path,
                        imageUrl:item.data.url,
                        imageType: 2   
                    });
                }
            }
            defaultSku.imageList = imageList
            // 处理版式
            defaultSku.relatedTemplateIdTop = values[`relatedTemplateIdTop${tab_spec_init_item.key}`] > 0 ? values[`relatedTemplateIdTop${tab_spec_init_item.key}`] : null;//顶部关联版式
            defaultSku.relatedTemplateIdBottom = values[`relatedTemplateIdBottom${tab_spec_init_item.key}`] > 0 ? values[`relatedTemplateIdBottom${tab_spec_init_item.key}`] :null;//底部关联版式

            params.skuList.push(defaultSku)

        }
       
        setStorage(SAVEGOODSKEY,JSON.stringify(params))
    }

};


export const useData = async (_this) => {
   
    let { goods_base_data, spuDetail, sele_goods_cat_data, goods_img_data, spec_data_table, spu_data_table, other_data, express_data, spec_set_data, top_bottom_tpl_data, invoice_data, goods_video_data,store_info } = _this.state;
    goods_img_data = [];
    let spu_img_data = []
    let data = JSON.parse(getStorage(SAVEGOODSKEY));
    if(isEmpty(data)){
        return
    }
    const {step,goods_cat,top_nav_step,sele_goods_cat_data_copy} = data
    if(sele_goods_cat_data_copy.length<3){
        _this.setState({
            step,
            top_nav_step,
            goods_cat,
            sele_goods_cat_data:sele_goods_cat_data_copy
        })
        return
    }
    let res = {data}
    if (res.data) {
        let result = res.data;
        await _this.get_brand_attr_detail(result.categoryId3, res.data.attributeList != null && res.data.attributeList.length > 0 ? res.data.attributeList : []);
        //三级分类ID数组
        let tmp_goods_cat = result.categoryNamePath.split('->');
        sele_goods_cat_data[0] = {};
        sele_goods_cat_data[0].categoryId = result.categoryId1;
        sele_goods_cat_data[0].categoryName = tmp_goods_cat[0];
        sele_goods_cat_data[1] = {};
        sele_goods_cat_data[1].categoryId = result.categoryId2;
        sele_goods_cat_data[1].categoryName = tmp_goods_cat[1];
        sele_goods_cat_data[2] = {};
        sele_goods_cat_data[2].categoryId = result.categoryId3;
        sele_goods_cat_data[2].categoryName = tmp_goods_cat[2];

        //初始化商品的goods_base_data信息
        for (let i = 0; i < goods_base_data.length; i++) {
            if(goods_base_data[i].name == 'brandId' && result.brandId){
                if(!goods_base_data[i].sel_data.some(el=>el.brandId==result.brandId)){
                    goods_base_data[i].sel_data.unshift({brandId:result.brandId,brandName:result.brandName})
                }
            }
            if (goods_base_data[i].name == 'goods_cat') {
                goods_base_data[i].initialValue = `${tmp_goods_cat[0] }>${ tmp_goods_cat[1] }>${ tmp_goods_cat[2]}`;//三级分类展示字符串
            } else {
                goods_base_data[i].initialValue = result[goods_base_data[i].name];
            }
        }

        /*商品规格-start*/
        if (result.specInfoList != null && result.specInfoList.length != undefined && result.specInfoList.length > 0) {
            if(store_info.goodsSource==1){
                const obj = []
                result.specInfoList.forEach((item)=>{
                    obj.push({...item,specValueInfoList:item.specValueInfoList})
                })
                spec_set_data[0].sel_data = obj;
            }
            result.specInfoList.forEach((item, index) => {
                let tmp_spec_set_data = spec_set_data[0].sel_data.filter(items => items.specId == item.specId);
                if (tmp_spec_set_data != undefined && tmp_spec_set_data.length != undefined && tmp_spec_set_data.length > 0) {

                    tmp_spec_set_data[0].sele_flag = true;
                    tmp_spec_set_data[0].is_img_spec = item.isMain == 1 ? true : false;

                    //规格值的处理
                    let sele_spec_val_data = [];
                    result.specInfoList[index].specValueInfoList.forEach((item_spec_val) => {
                        let tmp_spec_val_data = tmp_spec_set_data[0].specValueInfoList.filter(item1 => item1.specValueId == item_spec_val.specValueId);
                        if (tmp_spec_val_data != undefined && tmp_spec_val_data.length != undefined && tmp_spec_val_data.length > 0) {
                            tmp_spec_val_data[0].sele_flag = true;
                            sele_spec_val_data.push({ ...tmp_spec_val_data[0] });
                        }

                        //商品图片处理
                        if (item.isMainSpec == 1) {
                            //该规格项是图片规格
                            goods_img_data.push(JSON.parse(JSON.stringify(_this.img_item)));
                            let cur_data = goods_img_data[goods_img_data.length - 1];
                            cur_data.label = item_spec_val.specValueName;
                            cur_data.name = `image${ item_spec_val.specValueId}`;
                            cur_data.specId = item.specId;
                            cur_data.specValueId = item_spec_val.specValueId;
                            cur_data.specValueName = item_spec_val.specValueName;
                            cur_data.extra_param = { specValueId: item_spec_val.specValueId };
                            cur_data.fileList = [];
                            //组装图片
                            item_spec_val.imageList.forEach(item_spec_val_img => {
                                let img_info = {};
                                img_info.uid = item_spec_val_img.image;
                                img_info.thumbUrl = item_spec_val_img.imageUrl;//图片的url地址
                                img_info.status = 'done';
                                img_info.response = {};
                                img_info.response.state = 200;
                                img_info.response.data = {
                                    path: item_spec_val_img.image,
                                    url: item_spec_val_img.imageUrl//图片的url地址
                                };
                                cur_data.fileList.push(img_info);
                            });

                            cur_data.uploadPreview = function(info) {
                                _this.uploadImgPre(info);
                            };
                            cur_data.uploadChange = function(info, extra) {
                                _this.uploadImg(info, `image${ extra.specValueId}`);
                            };
                        }
                    });

                    //规格项的处理
                    spec_set_data[0].show_data.push({
                        ...JSON.parse(JSON.stringify(tmp_spec_set_data[0])),
                        showValList: sele_spec_val_data,
                        is_img_spec: item.isMainSpec == 1 ? true : false
                    });
                }

            });

            //sku list的处理
            let skuList = [];
            let key = 0;
            result.skuList.forEach((itemP) => {
                key += 1;
                let tmpItem = {};
                tmpItem.barCode = itemP.barCode;
                tmpItem.productPrice = itemP.salePrice;
                tmpItem.settlementPrice = itemP.settlementPrice;
                tmpItem.productStock = itemP.skuStock;
                tmpItem.height = itemP.height;
                //   tmpItem.isDefault = itemP.isDefault;
                tmpItem.length = itemP.length;
                tmpItem.key = key;
                tmpItem.marketPrice = '';
                tmpItem.productCode = '';
                tmpItem.productId = itemP.sku;
                tmpItem.state = itemP.state;
                tmpItem.productStockWarning = itemP.skuStockWarning;
                tmpItem.weight = itemP.weight;
                tmpItem.width = itemP.width;
                tmpItem.specValIdArray = [];
                // tmpItem.specValIdArray = itemP.specAttrId.split(',');
                //   tmpItem.specValIdArray = itemP.specValueIds.split(',');
                //   tmpItem.spec_info = [];
                //组装spec_info数据
                //   tmpItem.specValIdArray.forEach((itemSpecVal) => {
                //       let curItem = {};
                //       curItem.sele_flag = true;
                //       for (let specI = 0; specI < result.specInfoList.length; specI++) {
                //           let tar_specValItem = result.specInfoList[specI].specValueInfoList.filter(item => item.specValueId == itemSpecVal);
                //           if (tar_specValItem.length > 0) {
                //               curItem.specId = result.specInfoList[specI].specId;
                //               curItem.specName = result.specInfoList[specI].specName;
                //               curItem.specValueName = tar_specValItem[0].specValueName;
                //               curItem.specValueId = tar_specValItem[0].specValueId;
                //               curItem.specImage = tar_specValItem[0].imageList;
                //               break;
                //           }
                //       }
                //       tmpItem.spec_info.push({ ...curItem });
                //   });
                itemP.specInfoList.forEach((itemSpec)=>{
                    itemSpec.sele_flag = true;
                    tmpItem.specValIdArray.push(itemSpec.specValueId)
                })
                tmpItem.spec_info = itemP.specInfoList
                skuList.push({ ...tmpItem });
            });
            spec_data_table.list = skuList;
            console.log(111,spec_data_table)
        } else {
            //初始化spu_data_table数据
            let tmp_spu_data = spu_data_table.list[0];
            let tar_data = result.skuList[0];
            tmp_spu_data.marketPrice = tar_data.marketPrice;
            tmp_spu_data.productPrice = tar_data.salePrice;
            tmp_spu_data.settlementPrice = tar_data.settlementPrice;
            tmp_spu_data.goodsStock = tar_data.skuStock;
            tmp_spu_data.weight = tar_data.weight;
            tmp_spu_data.length = tar_data.length;
            tmp_spu_data.width = tar_data.width;
            tmp_spu_data.height = tar_data.height;
            tmp_spu_data.stockWarning = tar_data.skuStockWarning;
            tmp_spu_data.productCode = tar_data.productCode;
            tmp_spu_data.productId = tar_data.sku;
            tmp_spu_data.barCode = tar_data.barCode;
        }

        if (result.spuImageList && result.spuImageList.length != 0) {
            //spu商品图片的处理
            spu_img_data = [JSON.parse(JSON.stringify(_this.img_item))];
            let cur_data = spu_img_data[0];
            cur_data.label = `图片`;
            cur_data.name = 'imagespu';
            cur_data.specId = '';
            cur_data.specValueId = '';
            cur_data.specValueName = '';
            cur_data.extra_param = {};
            cur_data.fileList = [];
            //初始化图片数据
            result.spuImageList.forEach(item => {
                let img_info = {};
                img_info.uid = item.image;
                img_info.thumbUrl = item.imageUrl;//图片的url地址
                img_info.status = 'done';
                img_info.response = {};
                img_info.response.state = 200;
                img_info.response.data = {
                    path: item.image,
                    url: item.imageUrl//图片的url地址
                };
                cur_data.fileList.push(img_info);
            });
            cur_data.uploadPreview = function(info) {
                _this.uploadImgPre(info);
            };
            cur_data.uploadChange = function(info) {
                _this.uploadSpuImg(info, 'imagespu');
            };
        }else{
            //spu商品图片的处理
            spu_img_data = [JSON.parse(JSON.stringify(_this.img_item))];
            let cur_data = spu_img_data[0];
            cur_data.label = `图片`;
            cur_data.name = 'imagespu';
            cur_data.specId = '';
            cur_data.specValueId = '';
            cur_data.specValueName = '';
            cur_data.extra_param = {};
            cur_data.fileList = [];
            cur_data.uploadPreview = function(info) {
                _this.uploadImgPre(info);
            };
            cur_data.uploadChange = function(info) {
                _this.uploadSpuImg(info, 'imagespu');
            };
        }

        /* 商品视频 start */
        if(result.spuVideo){
            let video_info = {};
            video_info.uid = result.goodsVideo;
            video_info.thumbUrl = result.goodsVideoUrl;//商品视频的url地址
            video_info.status = 'done';
            video_info.response = {};
            video_info.response.state = 200;
            video_info.response.data = {
                path: result.goodsVideo,
                url: result.goodsVideoUrl//商品视频的url地址
            };
            goods_video_data[0].fileList = [video_info];
        }
        /* 商品视频 end */

        /* 发票信息 start */
        invoice_data.forEach(item => {
            item.initialValue = res.data[item.name];
        });
        /* 发票信息 end */

        /* 物流数据start 这里需要处理一下 新增状态下物流默认是运费,express_data不删除额话会多一个运费此处删除2项*/  
        for(let express_index = 0; express_index < express_data.length; express_index++) {
            if (express_data[express_index].name == 'express_method') {
                if (result.freightId > 0) {
                    express_data.splice(express_index + 1, 2, { ..._this.special_express, initialValue: result.freightId });
                    express_data[express_index].initialValue = 'special';
                } else {
                    express_data.splice(express_index + 1, 2, { ..._this.common_express, initialValue: result.freightFee });
                    express_data[express_index].initialValue = 'common';
                }
            }
        }
        /* 物流数据end */

        /* 其他信息数据start */
        for(let other_index = 0; other_index < other_data.length; other_index++) {
            if (other_data[other_index].name == 'innerLabelIds') {
                //店铺分类初始化
                let tar_store_cat_id = [];
                if (res.data.storeInnerLabelList.length > 0) {
                    res.data.storeInnerLabelList.forEach(item => {
                        tar_store_cat_id.push(item.innerLabelId);
                        _this.sel_cat_data.push({
                            innerLabelId: item.innerLabelId,
                            innerLabelName: item.innerLabelName
                        });
                    });
                }
                other_data[other_index].initialValue = tar_store_cat_id;//店铺分类

            } else if (other_data[other_index].name == 'serviceLabelIds') {
                let tar_service_label_id = [];
                let all_service_label_id = [];
                _this.service_list.forEach(item => {
                    all_service_label_id.push(item.labelId);
                });
                if (res.data.spuLabelList.length > 0) {
                    res.data.spuLabelList.forEach(item => {
                        if (all_service_label_id.indexOf(item.spuLabelId) > -1) {
                            tar_service_label_id.push(item.spuLabelId);
                        }
                    });
                }
                other_data[other_index].initialValue = tar_service_label_id;//商品标签
            } else if (other_data[other_index].name == 'sellNow') {
                //11-放入仓库无需审核 21-放入仓库待审核, 12-放入仓库审核通过, 5-放入仓库商品下架 , 3-上架无需审核, 20-上架待审核
                other_data[other_index].initialValue = (result.state==5||result.state==11||result.state==12||result.state==21)?false:true;
            } else {
                other_data[other_index].initialValue = result[other_data[other_index].name];
            }
        }
        /* 其他信息数据end */

        spuDetail = res.data.spuDetail;//spu商品详情

        //店铺属性处理-start
        if (res.data.parameterGroups != null && res.data.parameterGroups!= undefined && res.data.parameterGroups.length>0) {
            let groupIds = []
            let parameterList = []
            res.data.parameterGroups.forEach((item)=>{
                groupIds.push(item.groupId);
                parameterList = parameterList.concat(item.parameterList)
            })
            _this.handleAttrGroup(groupIds, parameterList,true);
        }
        //店铺属性处理-end

        //店铺关联版式spu -start
        top_bottom_tpl_data.forEach(item => {
            let nameMap = {
                'relatedTemplateIdTop':'spuRelatedTemplateIdTop',
                'relatedTemplateIdBottom':'spuRelatedTemplateIdBottom'
            }
            let key = nameMap[item.name]
            item.initialValue = res.data[key] == 0 ? -1 : res.data[key];
        });
        //店铺关联版式-end
        _this.setState({
            loading: false,
            express_show: true,//展示物流数据
            sele_goods_cat_data,//分类id数组
            goods_base_data,//商品的基本信息
            spuDetail,//spu商品详情
            goods_img_data,//图片信息
            goods_video_data,//商品视频
            spec_set_data,//规格数据
            spu_data_table,//spu商品数据
            express_data,//物流信息数据
            other_data,//其他信息数据
            spec_data_table,//展示的数据
            top_bottom_tpl_data,//顶部底部关联版式
            show_radio_flag: true,
            invoice_data,
            spu_img_data, //sku图片
            editCopySkuList:JSON.parse(JSON.stringify(spec_data_table.list)),
            goods_cat,
            top_nav_step, step
        }, () => {
            //根据选择的结果计算规格数据
            _this.getCalcDEscartes(spec_set_data[0].show_data,res.data.skuList);
        });
    }
};