<template>
    <div class="addresscomp-container" ref="addressContainer">
        <section class="address" >
            <div class="address" v-show='isShow'>
            <!-- 顶部选择后的地址显示 -->
                <section class="title">
                    <div class="area" 
                        v-for="(item, index) in dataList" 
                        v-show="item.show || !!item.name"
                        :key="index" 
                        @click="clickTitle(item, index)" 
                        :class="{active: !item.name}"
                    >
                        {{!!item.name?item.name:'请选择'}}
                    </div>
                </section>
                
                <div class='area-list' ref='areaList'>
                    <!-- 列表列表 -->
                    <div v-for="(temp, i) in dataList" :key="i" v-show="temp.show" >
                        <div class="addList" 
                            v-for="(item, index) in temp.list" 
                            :key='index' 
                            @click="clickListItem(temp, i, item, index)" 
                        >
                            <Icon v-if="item.selected" type='icon_common_select' size='.36'></Icon>
                            <span>{{item.name}}</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>
<script>

import Icon from "components/icon/index.vue";
import addressHandler from './addressHandler.js';
import Bus from './bus/bus.js';

export default {
    name: 'AddressComp',
    components: {
        Icon
    },
    props:{
        titleName:{ //title的名字
            type:String,
            default:'所在地'
        }
    },
    data(){
        return {
            isShow:true,
            dataList:[],
            lastCode:''// 记住当前所选择的省市区id   避免二次请求
        }

    },
    created(){
        Bus.$off('AUTO_SELECT_CITYS');
        Bus.$on('AUTO_SELECT_CITYS',code=>{
            if (this.lastCode == code){
                return false;
            }
            if (!!code){
                
                this.lastCode = code;
                let arr = code.split('/');
                if (arr.length){
                    this.setCheck(arr);
                }
            } else {
                this.initData();
            }
        });
        Bus.$on('CLEAR_CODE',()=>{
            this.lastCode = '';
        })
        //初始化data数据
        this.initData();
    },

    methods:{
        //编辑地址的时候 默认勾选省 市 区
        async setCheck(arr){
            this.isShow = false;
            for (let i = 0;i<arr.length;i++){
                let temp = this.dataList[i];
                let data;
                if (!!addressHandler.getStorage(addressHandler.primaryKey+ '_provinceList') && i == 0){
                    data = JSON.parse(addressHandler.getStorage(addressHandler.primaryKey+ '_provinceList'));
                } else {
                    data = await this.getAddressData(this.dataList[i].apiName, arr[i-1], this.dataList[i-1].transportId);
                }
                if (!!data && data.length > 0){            
                    this.dataList[i].list = data;
                    let index = this.dataList[i].list.findIndex(item => item.id == arr[i]);
                    if (index > -1){
                        temp.list[index] = Object.assign({}, temp.list[index], {selected: true})
                        if (i > 0){
                            this.dataList[i-1].show = false;
                        }
                        temp.show = true
                        temp.name = temp.list[index].name;
                        temp.id = temp.list[index].id;
                        temp.transportId = temp.list[index].transportId;
                    }
                }
            }
            this.isShow = true;
        },

        async initProvinceList(){
            this.dataList[0].list = await this.getAddressData(this.dataList[0].apiName);
            addressHandler.setStorage(addressHandler.primaryKey+ '_provinceList', JSON.stringify(this.dataList[0].list));
        },

        /**
         * 查询省市区县数据的公共方法
         * @param apiName 接口名，即查询省市区县的接口名
         * @param id 上级的id查省的时候不用传
         * @param transportId 上级的transportCode查省的时候不用传
         */        
        getAddressData(apiName, id){
            let param = {};
            if (!!id){
                param = Object.assign({}, param, {id: id})
            }
            return new Promise((resolve)=>{
                addressHandler[apiName](param).then(res=>{
                    if (res.resultCode == 0 && !!res.result.list && !!res.result.list.length > 0){
                        let data = res.result.list;
                        resolve(data);
                    } else {
                        resolve([]);
                    }
                }).catch(e=>{
                    console.log(e);
                    resolve([]);
                })
            })
            
        },

        /**
         * 点击一选择的地址的title
         */
        clickTitle(item, index){
            item.show = true;
            if (item.type != 'town'){
                this.dataList.forEach((temp, i)=>{
                    if (i > index){
                        temp.show = false;
                        temp.name = '';
                        temp.id = '';
                        temp.list = [];
                    }
                })
            }
        },

        /**
         * 点击列表的每一项
         * @param temp dataList的每一个item
         * @param i  dataList的点击的索引
         * @param item dataList的list的每一个item
         * @param index dataList的list的点击的索引
         */
        async clickListItem(temp, i, item, index){
            
            temp.list.map( a => a.selected = false ); //为了更新selected的样式
            temp.list[index].selected = true; //为了更新selected的样式

            temp.id = item.id; //更新id
            temp.transportId = !!item.transportId ? item.transportId : ''; //更新transportId
            temp.name = item.name; //更新名称
            if (temp.type != 'town'){ //点击非town的数据
                let data = await this.getAddressData(this.dataList[i+1].apiName, item.id ,item.transportId);
                if (!!data && data.length > 0){
                    temp.show = false;
                    this.dataList[i+1].show = true;
                    this.dataList[i+1].list = data;
                } else {
                    this.emitData();
                }
            } else {
                this.emitData();
            }
            
        },

        /**
         * 整合数据传递出去
         */
        emitData(){
            let idArr = [];
            let nameArr = [];
            this.dataList.forEach(item=>{
                if (!!item.id){
                    idArr.push(item.id);
                    nameArr.push(item.name);
                }
            })
            this.lastCode = idArr.join('/');
            this.$emit('selectAddress', idArr, nameArr)
        },

        //关闭父级弹窗组件
        closePopup(){
            this.$emit('closePop');
        },

        /**
         * 初始化dataList数据
         */
        initData(){
            this.dataList = [
                {
                    type:'province',
                    apiName: 'getProvince',
                    id: '',
                    transportId: '',
                    name:'',
                    list: !!addressHandler.getStorage(addressHandler.primaryKey+ '_provinceList') ? JSON.parse(addressHandler.getStorage(addressHandler.primaryKey+ '_provinceList')) : [],
                    show: true
                },
                {
                    type:'city',
                    apiName: 'getCity',
                    id: '',
                    transportId: '',
                    name:'',
                    list: [],
                    show: false
                },
                {
                    type:'county',
                    apiName: 'getCounty',
                    id: '',
                    transportId: '',
                    name:'',
                    list: [],
                    show: false
                },
                {
                    type:'town',
                    apiName: 'getTown',
                    id: '',
                    transportId: '',
                    name:'',
                    list: [],
                    show: false
                }
            ] 
            /**
             * 获取省份数据列表
             */
            if (!addressHandler.getStorage(addressHandler.primaryKey+ '_provinceList')){
                this.initProvinceList();
            }
            
        }
    }
}
</script>
<style scoped lang="less">
@import '~styles/core/common.less';
@import '~styles/mixins/mixinsStyle.less';
.addresscomp-container{
    /deep/ .AddressTitle-container{
        z-index: 570;
        border-radius:.20rem .20rem 0 0;
    }
    height: 100%;
    overflow: hidden;
    position: relative;
    .address{
        position: relative;
        z-index: 570;
        flex: 1;
        background:#fff;
        width:100%;
        height: 100%;
        .title{
            height: 0.9rem;
            position: relative;
            padding: 0.3rem 0.3rem 0rem 0.3rem;
            display: flex;
            justify-content: flex-start;
            .area{
                cursor: pointer;
                display:inline-block;
                font-size:0.3rem;
                color:@text-color;
                font-weight: 600;
                width: 25%;
                height: 0.5rem;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
                text-align: center;
            }
            .active{
                color:@theme-color;
                position: relative;
                &:after {
                    content: "";
                    position: absolute;
                    width: 0.52rem;
                    height: 2px;;
                    bottom: 0rem;
                    left:50%;
                    margin-left: -0.26rem;
                    background: @theme-color;
                    border-radius: 1px;
                    z-index: 10;
                }
            }
        }
        .area-list{
            padding:0 0 0.15rem 0;
            width:100%;
            max-height: calc(~'100% - 1.2rem');
            overflow-y:auto;
            overflow-x:hidden;
            .icon_common_select{
                fill: @theme-color;
            }
            .addList{
                width:100%;
                padding-left:0.3rem;
                font-size:0.3rem;
                color:@text-color;
                display: flex;
                align-items: center;
                padding-top: 0.28rem;
                span{
                    padding-left: 0.2rem;
                    cursor: pointer;
                }
            }
        }
    }
}
</style>