<template>
    <div class="addresschoose-container">
        <AddressTitle :showTitle='true' :showIconBtn='showAddressModel' :showBottomBorder='true' title='配送至' 
        @closePopup='closePopup' @iconBtnCallback='showAddressModel=false'></AddressTitle>
        <!-- <template v-show='showAddressModel'>
            <AddressComp v-if='showAddressModel' @selectAddress = 'selectAddress'></AddressComp>
        </template> -->
        <template v-show='!showAddressModel'>
            <section class="addresschoose-section">
                <mescrollVue ref="mescroll" :down="mescrollDown" :up="mescrollUp" @init="mescrollInit">
                    <div id='addressChooseList'>
                        <div  class='address-item' v-for='(item,index) in addressList' :key='index' @click='chooseAddress(item)'>
                            <Icon type='icon_clockin_locatoion' size='.32'></Icon>
                            <p class='address-text' :class="{active: checkChoosed(item)}">
                                <SymbolComp v-if ="item.defaultFlag" class='default'></SymbolComp>
                                <SymbolComp v-if ="item.tags" :symbol='item.tags' class='symbol-item'></SymbolComp>
                                <span>{{item.fullAddress2}}</span>
                            </p>
                            <Icon v-show="checkChoosed(item)" type='icon_mall_select' size='.4'></Icon>
                        </div>
                    </div>
                </mescrollVue>
            </section>
            <div class='btn-container' @click='selectOtherAddress' v-if="showOtherBtn && !showAddressModel">
                <span class='btn-text cursor-btn normal-btn'>新增配送地址</span>
            </div>
        </template>
    </div>
</template>
<script>
// const AddressComp = ()=>import('common/components/base/AddressComp.vue');
import AddressTitle from 'common/components/base/AddressTitle.vue';
import SymbolComp from 'common/components/base/symbol.vue';
import Icon from 'common/components/base/Icon.vue';
import mescrollMixin from 'common/lib/mixin/mescrollMixin';
import extendUtils from 'common/lib/utils';
import requestHandler from 'common/lib/requestHandler/addressHandler.js';
import cityIdHandler from 'common/lib/city/cityIdHandler'; //加载cityCodeHandler组件,当地址变更的时候更新cityCode
import Bus from 'common/lib/bus/bus.js';
export default {
    name: 'AddressChooseComp',
    components: {
        AddressTitle,
        Icon,
        SymbolComp,
        // AddressComp
    },
    mixins: [mescrollMixin],
    props:{
       value:{
           type:Object,
           default(){
                return {}
           }
       },
       showOtherBtn:{
           type:Boolean,
           default:true
       }
    },
    data(){
        return Object.assign(extendUtils.stateManager.setData([
            'showAddressModel',//三级联动地址选择弹窗
        ]), {
            addressList: [], //地址的数据列表
            mescrollUp: { 
                htmlNodata: '', //不显示‘没有更多了’
                    empty: {
                    warpId: 'addressChooseList'
                }
            }
        })
    },
    async created(){
        await extendUtils.authInterceptor();
        cityIdHandler.init();
        // Bus.$on('BUS_INIT_ADDRESS_LIST', ()=>{
        //     this.mescroll.resetUpScroll();
        // })
    },
    methods:{
         /**
         * 省市区地址选择后处理
         */
        selectAddress(idArr, nameArr){
            this.showAddressModel = false;
            this.$emit('selectAddress', idArr, nameArr);
        },
        /**
         * 是否被外侧选中了
         */
        checkChoosed(item){
            return this.value.id == item.id;
        },

        //关闭父级弹窗组件
        closePopup(){
            this.$emit('closePopup');
        },

        //调用父级的选择其他地址弹窗组件
        selectOtherAddress(){
            this.$emit('addAddress');
            // this.showAddressModel = true;
        },

        //地址列表中选择地址后的回调
        chooseAddress(item){
            this.$emit('input', item);
            this.closePopup();
            extendUtils.setStorage(requestHandler.primaryKey + '_addressSelected', JSON.stringify(item));
            
            //更新cityId的缓存 取cityId的城市code
            cityIdHandler.updateCityIdCache(item)
        },

        //下拉刷新方法
        re_fresh(mescroll){
            mescroll.resetUpScroll();
        },

        /**
       * 获取地址列表
       * @param page 分页对象，由mescroll提供 在本文件 不用此参数
       * @param mescroll mescroll对象
       */
        async getListData(page, mescroll = this.mescroll){
            const that = this;
            try{
                let resdata = await this.getData();
                this.addressList = resdata;
                that.addressChoose(that.addressList);
                mescroll.endSuccess(resdata.length, false);
            }catch(e){
                console.log(e);
                if(mescroll){
                    mescroll.endErr();
                }
                
            }
        },
         /**
         * 取地址优先级：
         * 1：选择了省市区的，选省市区这个地址
         * 2：上次选中的地址
         * 3：默认地址
         * 4：地址列表第一条地址
         * 初始化处理地址选择逻辑 
         */
      addressChoose(addressList){
        let that = this;
        let selectCity = !!extendUtils.getSession(requestHandler.primaryKey + '_selectedCity') ? JSON.parse(extendUtils.getSession(requestHandler.primaryKey + '_selectedCity')) : {};
        let addressSelected = !!extendUtils.getStorage(requestHandler.primaryKey + '_addressSelected') ? JSON.parse(extendUtils.getStorage(requestHandler.primaryKey + '_addressSelected')) : {}; //从sessionStorage里面取上个页面带过来的购买的商品选择的收货地址
        if(Object.keys(selectCity).length > 0 && selectCity.addNewAddress != 'false'){
            that.$emit('input', selectCity);
            return;
        }
        if(Object.keys(addressSelected).length > 0 && !!addressSelected.id){ //如果有从商品详情和购物车页面带过来商品列表存在的地址，则其为优先显示
          that.$emit('input', addressSelected);
        }else{
          let index = addressList.findIndex(item => {
            return !!item.defaultFlag;
          });
          if(index > -1){
            that.$emit('input', addressList[index]);//当default的值为true的时候， 默认代表该地址为默认地址
          }else{
            //如果前几个都没有，默认选择地址列表中的第一个
            if(addressList.length){
            that.$emit('input', addressList[0]);
            }else{
                //如果地址列表为空
            that.$emit('input', {});
            }
            
          }
          
        }
      },
        //通过API获取地址列表
        getData(){
            let param = {
                userId: requestHandler.userId,
                companyId: requestHandler.companyId,
                channelId: requestHandler.channelId,
                supplierId: requestHandler.supplierId,
                project: 'MALL', //用来区分是商城的还是商旅的
            };
            return new Promise((resolve, reject) => {
                requestHandler.getAddressList(param).then(res=>{
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
        }
    }
}
</script>
<style lang='less'>
@import '~themes/default/styles/components/mescroll.less';
</style>
<style scoped lang="less">
@import '~themes/default/styles/common/variable.less';
@import '~mallStyles/mixins/hairLine.less';
.addresschoose-container{
    height: 100%;
    background: #fff;
    position: relative;
    display: flex;
    flex-direction: column;
    .addresschoose-section{
        /deep/ .mescroll-empty{
            position: absolute;
        }
        flex: 1;
        overflow: hidden;
        position: relative;
        .address-item{
            position: relative;
            display: flex;
            flex-direction: row;
            padding: 0.4rem 0.36rem 0 0.3rem;
            align-items: center;
            .address-text{
                flex: 1;
                padding: 0 0.3rem 0 0.1rem;
                font-size: 0.28rem;
                line-height: 0.4rem;

                .symbol-item{
                    color: @address-color;
                    border-color: @address-color;
                }
            }
            .active{
                color: @text-color;
                font-weight: 600;
            }
            .icon_mall_select{
                color: @theme-color;
            }
        }
    }
    .btn-container{
        height: 1.2rem;
        padding: 0.2rem 0.3rem;
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        .btn-text{
            font-size: 0.3rem;
            height: 100%;
            width: 100%;
            background: @theme-color;
            color: #fff;
            border-radius: 0.4rem;
            display: flex;
            justify-content: center;
            align-items: center;
        }
    }
}

</style>