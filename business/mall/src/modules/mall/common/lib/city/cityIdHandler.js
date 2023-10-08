/*
 * 获取cityCode的混入js
 * 
 */

import extendUtils from 'common/lib/utils';
import requestHandler from 'common/lib/requestHandler/addressHandler.js';
import Config from 'common/lib/config.js';

class City {
  constructor(){
    this.locationId = ""; //当前定位的地址code
    this.cityId = ""; //cityId市id
    this.addressId = ""; //省市区县至少是三级地址
    this.supplierId = '';//当前的供应商id
    // this.init();
  }

  init(){
    //初始化
    let that = this;
    that.supplierId = requestHandler.supplierId;
    if(that.supplierId!=null && that.supplierId!=undefined && that.supplierId!='' && !!Config.SUPPLIER_Map[that.supplierId].needAddressId){
      let cityId = extendUtils.getStorage(requestHandler.primaryKey + '_cityId');
      let addressId = extendUtils.getStorage(requestHandler.primaryKey + '_addressId');
      if(!!!cityId || !!!addressId){ //如果没有缓存的话才加载该js
        that.initCode(); 
      }
    }
  }

  /** 
  * 通过cityName换取cityCode
  */
  transferNameToCode(cityName){
    const codeObj = require(`./${this.supplierId}_cityId.json`); //获取当前供应桑的cityCode.json数据
    let cityId = Config.SUPPLIER_Map[that.supplierId].defaultCityId;
    for(let i = 0; i < codeObj.codeList.length; i++){
      const item = codeObj.codeList[i];
      if(cityName == item.name){
        cityId = item.id;
      }
    }
    return cityId;
  }
  
  /***
   * 获取cityCode
   * 交互逻辑：有默认地址的时候用默认地址，没有默认地址用地址栏第一个地址，没有地址的时候用 GPS，没有地址和GPS关闭的情况下就用深圳
   */
  async initCode() {
    const that = this;
    that.supplierId = requestHandler.supplierId;
    try{
      //从localStorage里面取上个页面带过来的购买的商品选择的收货地址
      let addressSelected = !!extendUtils.getStorage(requestHandler.primaryKey + '_addressSelected') ? JSON.parse(extendUtils.getStorage(requestHandler.primaryKey + '_addressSelected')) : {}; 
      if(Object.keys(addressSelected).length > 0){
        that.setCityIdStorage(addressSelected.areaCode.split('/')[1]);
        that.setAddressIdStorage(addressSelected.areaCode);
      }else{
        
        let data = await that.getAddressList();
        that.addressList = data;
        if(that.addressList.length == 0){
          //屏蔽掉没有地址的话，直接用定位获取当前的地址 
          // extendUtils.getLocation().then(data => {//通过定位获取当前的城市，如果未获取当前地址的信息，此时默认为深圳
          //   console.log('locationData', data);
          //   if(!!data){
          //     that.locationId = that.transferNameToCode(data);
          //     extendUtils.setSession(requestHandler.primaryKey+'_cityId', that.locationId);
          //     console.log('that.locationId', that.locationId)
          //   }
          // }).catch(e=>{
          //   console.log('定位获取当前位置失败', e);
          // });

          // 目前如果缓存中没有地址的话，直接从config里面取配置的默认的
          that.setCityIdStorage(Config.SUPPLIER_Map[that.supplierId].defaultCityId);
          that.setAddressIdStorage(Config.SUPPLIER_Map[that.supplierId].defaultAddressId);
        }else if(that.addressList.length >= 1){
          //如果地址管理的数据大于等于1条首先看列表是否有默认的，如果有取默认的，如果没有取第一条
          let arr = that.addressList.filter(item => {
            return !!item.defaultFlag;
          });
          if(arr.length > 0){//此时说明有默认的
            that.cityId = arr[0].areaCode.split('/')[1];
            that.addressId = arr[0].areaCode;
          }else{//此时说明没有有默认的
            that.cityId = that.addressList[0].areaCode.split('/')[1];
            that.addressId = that.addressList[0].areaCode;
          }
          that.setCityIdStorage(that.cityId);
          that.setAddressIdStorage(that.addressId);
        }
      }
    }catch(e){
      console.error(e);
    }
  }

  /** 
  * 将cityId设置缓存
  */
  setCityIdStorage(value){
    extendUtils.setStorage(requestHandler.primaryKey+'_cityId', value); //更新缓存的cityCode
  }

  /** 
  * 将addressId设置缓存
  */
  setAddressIdStorage(value){
    extendUtils.setStorage(requestHandler.primaryKey+'_addressId', value); //更新缓存的addressId
  }

   /**
   * 获取地址列表的接口 
   */
  getAddressList(){
    const that = this;
    let param = {
      userId: requestHandler.userId,
      companyId: requestHandler.companyId,
      channelId: requestHandler.channelId,
      supplierId: requestHandler.supplierId,
      project: 'MALL', //用来区分是商城的还是商旅的
    }

    return new Promise((resolve, reject) => {
      requestHandler.getAddressList(param).then(res=>{
            if(res.resultCode == 0 && !!res.result.list && res.result.list.length >= 0){
                resolve(res.result.list);
            }else{
                resolve([]);
            }
        }).catch(e=>{ 
            console.log(e);
            resolve([]);
        })
    })
  }

  
    /**
     * 地址管理的增删改查初始化缓存中的cityId字段
     */
    initCityId(){
        this.initCode();
    }

    /**
     * 地址管理的增删改查更新缓存中的cityId字段
     */
    updateCityIdCache(item){
        if(!!item.areaCode){
          this.setAddressIdStorage(item.areaCode);
          if(!!item.areaCode.split('/')[1]){
              this.setCityIdStorage(item.areaCode.split('/')[1]) 
          }
        }
    }
    }

export default new City();