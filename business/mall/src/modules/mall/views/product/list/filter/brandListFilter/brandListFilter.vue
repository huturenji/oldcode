<template>
<div class="brandlist-container">
    <ul class="brand-list-box">
        <li @click="chooseBrand(item, index)" v-for="(item, index) in brandFilterListCopy" :key="index" :class="{active: item.choosed}">
            <Icon v-if="item.choosed" type="icon_common_select" size=".32"/>   
            <span>{{item.name}}</span>
        </li>
    </ul>
    <!-- 底部的重置和确认按钮 -->
    <div class="bottom-btns">
        <p @click="clearBrand" class="clear-btn red-btn">重置</p>
        <p @click="confirmFun" class="confirm-btn normal-btn">确定</p>
    </div>
</div>
</template>

<script>
const Icon = ()=>import('commonComp/base/Icon.vue');
export default {
    props:{
        value: {
            type: Array,
        },	
        showBrandPop:{ //品牌列表弹窗的显示与否
            type:Boolean,
            defaule:false
        },
        brandSearchType:{ //确定筛选支持单选还是多选 single代表单选 multiple代表多选 此处是在config.js配置的
            type:String,
            defaule:true
        }
    },
    data() {
        return {
            isClickConfirmBtn: false, //是否是点击确认按钮关闭的弹窗 是的话为true 其余的方式为false
            brandFilterListCopy: JSON.parse(JSON.stringify(this.value)), //深拷贝传递过来的值
        }
    },
    components: {
       Icon,
    }, 
    watch:{
       showBrandPop(val){
           if(!!val){//弹窗打开 立即将isClickConfirmBtn置为false
               this.isClickConfirmBtn = false;
               this.brandFilterListCopy = JSON.parse(JSON.stringify(this.value));//此时必须重新赋值，因为data深拷贝的对象并没有及时更新
           }else if(!val && !this.isClickConfirmBtn){ //此情况说明是点击非确认按钮关闭的弹窗
               //此时需要将数据还原
               this.brandFilterListCopy = JSON.parse(JSON.stringify(this.value));
           }
       } 
    },
    created() {
    },
    mounted(){
        
    },
    methods:{

        /**
         * 选择品牌的点击事件
         * @param item 单个的品牌筛选项
         */
       chooseBrand(item, index){
           item.choosed = !item.choosed;
           this.dealBrandSingle(item, index);
       },

         /**
         * 处理品牌筛选的单选
         */
        dealBrandSingle(item, index){
            if(this.brandSearchType == 'single'){ //单选
                if(!!item.choosed){
                    this.brandFilterListCopy.forEach((item, i) => {
                        if(index != i){
                            item.choosed = false;
                        }
                    })
                }
           }
        },

        /**
         * 重置品牌的条件
         */
       clearBrand(){
           this.brandFilterListCopy.forEach(item => {
               item.choosed = false;
           })
       },

        /**
         * 点击确定的筛选按钮
         */
       confirmFun(){
           this.isClickConfirmBtn = true;
           //过滤出已经选择的品牌列表对象传递出去。
           this.$emit('input', JSON.parse(JSON.stringify(this.brandFilterListCopy)));
           this.$emit('closeBrandListPop');
       },
    },  
} 
</script>
<style scoped lang="less">
@import '~themes/default/styles/common/variable.less';
@import '~mallStyles/mixins/mixinsStyle.less';
.brandlist-container{
    background-color: #fff;
    padding-top: 2rem;
    .brand-list-box{
        border-top: 1px solid @background-color;
        margin-top: 0.08rem;
        padding-top: 0.2rem;
        font-size: 0.28rem;
        color: @text-color;
        max-height: 6rem;
        overflow-y: auto;
        overflow-x: hidden;
        display: flex;
        flex-wrap: wrap;
        .icon_common_select{
            color: @theme-color;
        }
        li{
            &.active{
                color: @theme-color;
                font-weight: bold;
            }
            cursor: pointer;
            width: 49%;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            margin-bottom: 0.3rem;
            padding-left: 0.3rem;
            i.iconduihao{
                color: @theme-color;
                font-weight: bold;
            }
        }
    }
    .bottom-btns{
        box-shadow:0px 6px 20px 0px rgba(101,112,242,0.12);
        width: 100%;
        display: flex;
        height: 1rem;
        line-height: 1rem;
        & > p{
            flex:1;
            text-align: center;
            font-size: 0.30rem;        
            color: @theme-color;
        }
        .confirm-btn{
            background-color: @theme-color;
            color: #fff;
        }
    }
}
</style>
