<template>
<!-- 价格区间的筛选模板 -->
<div class="filter-address-container">
     <div class="title-part">
        <p class="title-name">配送地区</p>
        <p class="address">
            <span @click="showAddressComp" class="address-name">
                <Icon type='icon_clockin_locatoion' size='0.24rem'></Icon>
                {{addressDefault}}
                </span>
        </p>
    </div>
    
    <ul class="filterlist-part">
        <li @click="clickFilterItem(item, index)" v-for="(item, index) in value" :class="{active: item.choosed}" :key="index">
            {{item.name}}
            <Icon type='icon_select' size='.3'/>
        </li>
    </ul>
    
</div>
</template>

<script>
const Icon = ()=>import('commonComp/base/Icon.vue');
export default {
    components:{
        Icon
    },
    props:{
        value:{
           type: Array,
           default(){
               return [];
           }
        },
        addressDefault:{
            type: String
        }
    },
    data() {
        return {
           
        }
    },
    watch:{
      
    },
    computed: {
    },
    created() {
        
    },
    methods:{
        /**
         * 选择单个的筛选项
         * @param item 筛选项
         */
        clickFilterItem(item, index){
            item.choosed = !item.choosed;
        },

        /**
         * 显示地址选择的回调
         */
        showAddressComp(){
            this.$emit('showAddressComp');
        }
    }
} 
</script>

<style scoped lang="less">
@import '~themes/default/styles/common/variable.less';
@import '~mallStyles/mixins/mixinsStyle.less';
.filter-address-container{
    padding: 0.6rem 0.3rem 0 0.3rem;
    .title-part{
        display: flex;
        justify-content: space-between;
        font-size: 0.24rem;
        align-items: center;
        .title-name{
            width: 1.8rem;
            color:@third-text-color;
        }
        .address{
            color: @text-color;
            flex: 1;
            text-align: right;
            display: flex;
            align-items: center;
            overflow: hidden;
            justify-content: flex-end;
            .address-name{
                font-size: 0.24rem;
                display: inline-block;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
            }
            i{
                display: inline-block;
                width: 0.4rem;
                color: @theme-color;
                font-size: 0.4rem;            
            }
        }
    }
    .filterlist-part{
        display: flex;
        flex-wrap: wrap;
        li{
            position: relative;
            width: 30%;
            height: 0.68rem;
            line-height: 0.7rem;
            text-align: center;
            background-color: @background-color;
            border-radius: 0.1rem;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            font-size: 0.24rem;
            margin-top: 0.2rem;
            margin-right: 0.2rem;
            padding: 0 0.2rem;
            cursor: pointer;
            &:nth-child(3n){
                margin-right: 0;
            }
            .icon_select{
                display: none;
                position: absolute;
                width: 0.3rem;
                height:0.3rem;
                right: 0;
                bottom: 0;
                color: @theme-color;
            }
            &.active{
                color: @theme-color;
                background-color: #ffe6e3;
                .icon_select{
                    display: block;
                }
            }
        }
    }
}

</style>
