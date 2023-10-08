<template>
    <div class="CargoInfoWrap">
        <div class="roomInfoWrap" @touchmove.prevent>
            <div class="roomTit bbpxs">物品信息<div class="but cursorp" @click="$emit('cloose','')"></div>
            </div>                  	
            <div class="roomInfoTit">物品类型</div>
            <div class="checkerWrap bbpxsl">
                <div class="checkItem" v-for="(item, index) in expressCargoMap" :key="index">
                    <div class="checkerDefault icon-btn" :class="{check:cargoInfo.name==item}" @click="choosed(item)">{{item}}</div>
                </div>
                
            </div>
            <div class="roomInfoTit">物品重量</div>
            <div class="weightWrap">
                <div class="text">预估重量（公斤）</div>
                <div class="buttonWrap">
                    <div class="roundBut icon-btn subbut" @click="setWeight('sub')"></div>
                    <div class="roundText">{{cargoInfo.weight}}</div>
                    <div class="roundBut icon-btn addbut" @click="setWeight('add')"></div>
                </div>
            </div>
            <div class="bottomButWrap">
                <div class="okButton icon-btn" @click="ok">确定</div>
            </div>
        </div>        
    </div>

</template>
<script>
import {expressCargoData} from '../enum/expressEnum.js';
export default {
    components: {
    },
    props:{
        value: {//物品信息
            type: Object,
            default:{name:'',weight:'1',}
        },	
        showCargoInfo:{
            type:Boolean,
            defaule:false
        },
    },
    data() {
        return {
            expressCargoMap:expressCargoData,//快递公司配置
            cargoInfo:JSON.parse(JSON.stringify(this.value)),//物品信息
        };
    },
    watch: {
        showCargoInfo: function (newValue) {
        let _this = this;
            if (!newValue) {//界面关闭时重置数据
                _this.resetData(true);
            }
        },
    },    
    methods: {
         /**
         * 选择物品分类
         */	
        choosed(item){
            let _this = this;
            _this.cargoInfo.name = item;
            
        },
         /**
         * 设置重量
         */	
        setWeight(type){
            let _this = this;
            if('sub' == type && _this.cargoInfo.weight > 1){
                _this.cargoInfo.weight--;
            }else if('add' == type && _this.cargoInfo.weight < 100){
                _this.cargoInfo.weight++;
            }

        },
         /**
         * 确认
         */	
        ok(){
            let _this = this;
            _this.$emit('input',_this.cargoInfo);
            _this.$emit('cloose','');
        },
         /**
         * 重置数据，未点击确认前数据只在组件内部
         */	
        resetData(isOnlyClose){
            let _this = this;
            if(!!isOnlyClose){
                _this.cargoInfo = JSON.parse(JSON.stringify(this.value));
            }
        }
    }
};
</script>
<style scoped lang="less">
@import '~themes/default/styles/expressServer/comp/cargoInfo.less';
</style>
