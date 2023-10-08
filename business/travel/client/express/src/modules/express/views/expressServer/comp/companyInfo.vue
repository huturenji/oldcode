<template>
    <div class="CompanyInfoWrap">
        <div class="roomInfoWrap" @touchmove.prevent>
            <div class="roomTit bbpxs">快递选择<div class="but cursorp" @click="$emit('cloose','')"></div>
            </div>                  	
            <div class="roomInfoTit">快递公司</div>
            <div class="checkerWrap">
                <div class="checkItem" v-for="(item, index) in expressCompanyList" :key="index">
                    <div class="checkerDefault normal-btn" :class="{check:expressCompany.expressCompanyNo==item.expressCompanyNo}" @click="choosed(item)">{{item.expressCompanyName}}</div>
                </div>
            </div>
            <div class="bottomButWrap">
                <div class="okButton icon-btn" @click="ok">确定</div>
            </div>
        </div>        
    </div>
</template>
<script>
export default {
    components: {
    },
    props:{
        value: {//公司Id
            type: Object,
            default:{
                expressCompanyNo: '',//快递公司ID
                expressCompanyCode:'',//快递公司Code
                expressCompanyName: '',
                expressCompanyPhone: ''
            }
        },	
        showCompanyInfo:{
            type:Boolean,
            defaule:false
        },
        expressCompanyList:{
            type:Array,
            defaule:[]
        }
    },
    data() {
        return {
            expressCompany:JSON.parse(JSON.stringify(this.value)),//物品信息
        };
    },
    watch: {
        showCompanyInfo: function (newValue) {
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
            _this.expressCompany = item;
        },
         /**
         * 确认
         */	
        ok(){
            let _this = this;
            _this.$emit('input',_this.expressCompany);
            _this.$emit('cloose','');
        },
         /**
         * 重置数据，未点击确认前数据只在组件内部
         */	
        resetData(isOnlyClose){
            let _this = this;
            if(!!isOnlyClose){
                _this.expressCompany = JSON.parse(JSON.stringify(this.value));
            }
        }
    }
};
</script>
<style scoped lang="less">
@import '~themes/default/styles/expressServer/comp/companyInfo.less';
</style>
