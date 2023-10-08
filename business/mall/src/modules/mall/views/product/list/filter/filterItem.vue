<template>
<!-- 基本的筛选item 模板 -->
<div class="filter-item">
    <div class="title-part">
        <p class="title-name">{{filterItem.name}}</p>
        <p @click="showMore(filterItem)" v-if="filterItem.showAll" class="select">
            <span class="span_text" :class="{redColor: isSelected}">{{formatStr(filterItem.selectedName)}}</span>
            <span class="icon_box" :class="{transformTop: (filterItem.number == filterItem.children.length)}">
                <Icon  type='icon_common_downarrow' size=".24" />
            </span>
        </p>
    </div>
    <ul class="filterlist-part">
        <li @click="clickFilterItem(item, index)" v-show="index < filterItem.number" :class="{'active': item.choosed}" v-for="(item, index) in filterItem.children" :key="index">
            <div class='text'>{{formatStr(item.name)}}</div>
            <Icon type='icon_select' size='.3'/>
        </li>
    </ul>
</div>
</template>

<script>
import extendUtils from 'common/lib/utils';
const Icon = ()=>import('commonComp/base/Icon.vue');
export default {
    components: {
        Icon
    },
    props:{
      filterItem:{
          type:Object,
          default(){
              return {}
          }
      },
      brandSearchType:{ //确定筛选支持单选还是多选 single代表单选 multiple代表多选 此处是在config.js配置的
        type:String,
        defaule:true
      }
    },
    data() {
        return {
            //初始化显示数量
            minNumber:6
        }
    },
    watch:{

        /**
         * 监听filterItem，当选中筛选项的时候，更新并替换右上角显示的文字内容
         */
        filterItem:{
            handler(val){
    
                let showAllStr = '';
                val.children.forEach(function(item, index){
                    if(!!item.choosed){
                        showAllStr += (item.name + '，');
                    }
                });

                //删除最后的 ","
                let index = showAllStr.lastIndexOf('，'); 
                val.selectedName = !!this.isSelected ? (showAllStr.substring(0, index)) : '';
            },
            deep: true
        }
    },
    computed: {
        //判断该filterItem里面是否有选中的
        isSelected(){
            return this.filterItem.children.some(item => {
                return !!item.choosed;
            });
        }
    },

    created() {
        
    },
    methods:{
        /**
         * 选择每一个单独的筛选项
         */
        clickFilterItem(item, index){
            //组多选择5个选项
            let number = 0;
            if(!item.choosed){
                this.filterItem.children.forEach(item => {
                    !!item.choosed && number++;
                })
                if(number >= 5){
                    extendUtils.showToast('最多选择5个哦~');
                }else{
                    item.choosed = !item.choosed;
                    this.dealBrandSingle(item, index);
                }
            }else{
                item.choosed = !item.choosed;
                this.dealBrandSingle(item, index);
            }


        },

         /**
         * 处理品牌筛选的单选
         */
        dealBrandSingle(item, index){
            if(this.brandSearchType == 'single'){
                  if(!!item.choosed){
                    this.filterItem.children.forEach((item, i) => {
                        if(index != i){
                            item.choosed = false;
                        }
                    })
                }
            }
        },

        /**
         * 点击全部的按钮 折叠的按钮
         */
        showMore(item){
            item.number = (item.number == item.children.length) ? this.minNumber : item.children.length;
        },
        /**
         * 将中文'（'转成英文'('
         */
        formatStr(str){
            let a = '(';
            let b = ')';
            str = str.replace(/（/g,a).replace(/（/g,b);
            return str;
        }
    }
} 
</script>

<style scoped lang="less">
@import '~themes/default/styles/common/variable.less';
@import '~mallStyles/mixins/mixinsStyle.less';
.filter-item{
    padding: 0.3rem;
    .title-part{
        display: flex;
        justify-content: space-between;
        font-size: 0.3rem;
        .title-name{
            font-weight: bold;
            font-size: 0.24rem;
            color:@text-color;
            max-width: 2rem;
        }
        .select{
            color: @third-text-color;
            flex: 1;
            text-align: right;
            display: flex;
            justify-content: space-between;
            align-items: center;
            overflow: hidden;
            .span_text{
                font-size: 0.24rem;
                display: inline-block;
                flex: 1;
                text-align: right;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
                padding-left: 0.3rem;
                &.redColor{
                    color: @theme-color;
                }
            }
            .icon_box{
                font-size: 0.24rem;
                display: inline-block;
                transition: all 0.5s;
                margin-left: 0.22rem;
                &.transformTop{
                    transform: rotate(-180deg);
                }
            }
        }
    }
    .filterlist-part{
        display: flex;
        flex-wrap: wrap;
        overflow: hidden;
        li{
            display: flex;
            justify-content: center;
            align-items: center;
            position: relative;
            width: 30%;
            height: 0.8rem;
            text-align: center;
            background-color: @background-color;
            border-radius: 0.08rem;
            overflow:hidden;
            font-size: 0.24rem;
            margin-top: 0.2rem;
            margin-right: 0.2rem;
            padding: 0 0.2rem;
            cursor: pointer;
            &:nth-child(3n){
                margin-right: 0;
            }
            .text{
                text-overflow:ellipsis;
                display:-webkit-box;
                -webkit-box-orient:vertical;
                -webkit-line-clamp:2;
                overflow: hidden;
                white-space: normal;
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
