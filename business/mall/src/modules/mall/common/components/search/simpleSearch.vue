<template>
<div class="search-container">
    <div class="search-box" :class='theme'>
            <div class="input-part">
                <Icon type='icon_search' class="icon-search" size='.32'></Icon>
                <form action="javascript:true">
                    <input type="text" :placeholder="placeholderText" ref="searchInputDom" @keyup.13="searchFun()" @focus ="focusFunc" @blur="showPlaceholder=true" @input="inputFun" v-model.trim="searchValue" :disabled="isDisabled" :readonly="readonly">
                </form>
                <!--input的placeholder在某些机型上高度和搜索按钮对不齐，因此改用div模拟-->
                <!-- 此处v-show=false的原因是首页下滑 需要定位此处为假dom占位-->
                <div v-show='false' class='placeholder' @click="focusFunc">{{placeholderText}}</div>
                <span class="icon-close" @click="clearValue" v-if="showClearIcon && showBtn">
                    <Icon type='search_close' size=".32"  />
                </span>
                

            </div>
        <div v-if="showClearIcon && showBtn" @click="searchFun" class="search-btn">搜索</div>
        <div v-if="!showClearIcon && showCancleBtnCopy && showBtn" @click="cancleFun" class="cancle-btn">取消</div>
    </div>
</div>
</template>
<script>
import Icon from 'common/components/base/Icon';
import extendUtils from 'common/lib/utils';
import BaseHandler from 'common/lib/requestHandler/base.js'
let baseHandler = new BaseHandler();
export default {
    name:'searchComp',
    components: {Icon},
    props:{
        theme: {//自定义样式
            type: String,
            default: '',
        },

        //传递进来的搜索关键字
        value:{
            type: String,
            default: ''
        },
        
        //input 的placeholder内容
        placeholderText:{
            type: String,
            default: '输入商品名称搜索'
        },

        //显示取消按钮
        showCancleBtn: {
            type: Boolean,
            default: false
        },

        //input框是否可用
        isDisabled: {
            type: Boolean,
            default: false
        },
        
        //input框是否只读
        readonly: {
            type: Boolean,
            default: false
        },

        //点击取消是否回退页面
        cancelToback: {
            type: Boolean,
            default: false
        },

        //搜索记录是否存入缓存
        isCacheSearchHistory:{
            type: Boolean,
            default: true
        },
        
        //是否显示 搜索/取消按钮  搜索列表页传false  其他页面默认
        showBtn:{
            type: Boolean,
            default: true
        }

    },
    data(){
        return {
            showPlaceholder: true,//显示placeholder
            searchValue: this.value,
            showClearIcon: false, //是否显示清除icon
            showCancleBtnCopy: this.showCancleBtn, //是否显示取消的按钮
        }
    },
    computed: {
        isShowPlaceholder(){
           return (this.searchValue=="" || this.searchValue==null) && this.showPlaceholder;
       },
    },
    mounted(){
        //从首页进来时  清空输入框中内容
        if(!!this.$route.query.fromIndex){
            this.searchValue = '';
        }

        if(!!this.$route.query.fromProductList){
            this.searchValue = this.$route.query.keyWords;
        }
    },
    activated(){
        //从首页进来时  清空输入框中内容
        if(!!this.$route.query.fromIndex){
            this.searchValue = '';
        }

        if(!!this.$route.query.fromProductList){
            this.searchValue = this.$route.query.keyWords;
        }
    },
    watch:{
      searchValue(val){
          this.showClearIcon = !!val ? true : false;
          this.$emit('input', val)
      }, 
      value(val){
          this.searchValue = val;
      }  
    },
    methods:{

        /**
         * input回车搜索的时候
         */
       searchFun(){
           //搜索内容为空，不能搜索
           let str = this.searchValue.replace(/\s*/g, '');
           if(this.isCacheSearchHistory){          
               //首页搜索  空值不能搜索
                if(!!str){
                    //触发父组组件的搜索功能
                    this.$emit('search', this.searchValue);
                }
           }else{
               //订单列表搜索，空值可以搜索
               this.$emit('search', this.searchValue);
           }

            
       },


        /**
         * input聚焦的时候
         */
       focusFunc(){
           if(this.isDisabled){return}; //如果禁用input框，则return
           this.showPlaceholder = false; //隐藏模拟的placeholder
           this.showCancleBtnCopy = true; //显示取消按钮
           this.$emit('focusInputFun');
       },


        /**
         * input变化的时候触发
         */
       inputFun(e){
           this.showClearIcon = !!this.searchValue ? true : false;
           this.$emit('onInput', e.target.value)
       },

        /**
         * 清空数据
         */
       clearValue(){
           this.searchValue = '';
           this.$refs.searchInputDom.focus();
       },

       /**
        * 点击取消的按钮
        */
       cancleFun(){
           this.showCancleBtnCopy = false;
           this.$emit('cancleEmit')
           if(this.cancelToback){
               this.$router.go(-1);
           }
       },
    }
}
</script>
<style scoped lang="less">
@import '~themes/default/styles/common/variable.less';
@import '~mallStyles/mixins/mixinsStyle.less';
.search-container{
    width: 100%;
    display: flex;
    align-items: center;
    .search-box{
        @height: .68rem;
        width: 100%;
        position: relative;
        display: flex;
        justify-content: space-between;
        .search-btn{
            height: @height;
            line-height: @height;
            // width: 0.9rem;
            text-align: left;
            margin-left: 0.3rem;
            background-color: transparent;
            color: @theme-color;
            font-size: 0.28rem;
        }
        .cancle-btn{
            height: @height;
            line-height: @height;
            // width: 0.9rem;
            text-align: left;
            margin-left: 0.3rem;
            background-color: transparent;
            color: @third-text-color;
            border-radius: 0.1rem;
            font-size: 0.28rem;
        }
        .input-part{
            flex: 1;
            position: relative;

            .placeholder{
                background: transparent;
                position: absolute;
                left: .6rem;
                right: .6rem;
                top: 0;
                bottom: 0;
                color: @placeholder-color;
                opacity: .7;
                font-size: .28rem;
                display: flex;
                align-items: center;
                line-height: .68rem;
            }
        }
        input{
            padding: 0 0.6rem ;
            font-size: 0.24rem;
            height: 0.68rem;
            line-height: .68rem;
            border-radius: 0.2rem;
            background-color: #F5F5F5;
            color: @text-color;
        }
        input[type = search] {
            -webkit-appearance: none;
        }
        input::-webkit-search-decoration,
        input::-webkit-search-cancel-button {
        display: none;
        }
        ::-webkit-input-placeholder { /* WebKit browsers */
            font-size: .28rem;
            line-height: 0.68rem;
        }
        
        ::-moz-placeholder { /* Mozilla Firefox 19+ */
            font-size: .28rem;
            line-height: 0.68rem;
        }
        
        :-ms-input-placeholder { /* Internet Explorer 10+ */
            font-size: .28rem;
            line-height: 0.68rem;
        } 

        .icon-search{
            position: absolute;
            left: 0.24rem;
            top: 50%;
            margin-top: -0.15rem;
            color: @placeholder-color;
        }
        .icon-close{
            position: absolute;
            right: 0.24rem;
            top: 50%;
            margin-top: -0.15rem;
            width: 0.32rem;
            height: 0.32rem;
            color: @placeholder-color;
        }

        &.transparent{

            input:disabled{
                background-color: rgba(255,255,255,.35);
                opacity:1;  //默认的不透明级别为0.3
                -webkit-opacity:1;   //不透明级别安卓与IOS适配 
                color: #fff;
            }
            .icon-search{
                color: #fff;
            }
    
            .placeholder{
                color: #fff;
            }

            input{
                background-color: rgba(255,255,255,.35);
                color: #fff;
            }
            ::-webkit-input-placeholder { /* WebKit browsers */
                color: #fff;
            }
            
            ::-moz-placeholder { /* Mozilla Firefox 19+ */
                color: #fff;
            }
            
            :-ms-input-placeholder { /* Internet Explorer 10+ */
                color: #fff;
            } 
        }
    }
}
</style>