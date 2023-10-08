<template>
<div class="search-bar-container">
    <div class="search-box">
            <div class="input-part">
                <Icon type='search' class="icon-search" size='.32'></Icon>
                <form action="javascript:return true;">
                    <input type="text" :placeholder="placeholder" ref="searchInputDom" @keyup.13="searchFun" @focus ="focusFunc"
                        v-model="value" :disabled="disabled" :readonly="readonly">
                </form>
                <span class="close-btn" @click="clearValue" v-if="state==1">
                    <Icon type='search_close' size=".32"  />
                </span>
            </div>
        <div v-if="state==1" @click="searchFun" class="search-btn">搜索</div>
        <div v-if="state==0" @click="cancleFun" class="cancel-btn">取消</div>
    </div>
</div>
</template>
<script>
import Icon from 'components/icon';
export default {
    name:'search-bar',
    components: {Icon},
    model: {
        prop: 'value',
        event: 'input'
    },
    props:{
        //传递进来的搜索关键字
        value:{
            type: String,
            default: ''
        },
        
        //input 的placeholder内容
        placeholder:{
            type: String,
            default: ''
        },

        //input框是否可用
        disabled: {
            type: Boolean,
            default: false
        },
        
        //input框是否只读
        readonly: {
            type: Boolean,
            default: false
        }

    },
    data(){
        return {
            state: -1//输入状态： -1未获取焦点，0获取焦点未输入或无焦点但有值，1正在输入
        }
    },
    watch:{
        value(val){
            let isFocus = this.$refs.searchInputDom == document.activeElement;
            if (!isFocus){
                this.state = 0;
            } else {
                this.state = val!=null && val!=undefined && val!='' ? 1 : 0;
            }
            this.$emit('input', val)
        } 
    },
    mounted(){
        this.$refs.searchInputDom.focus();
    },
    methods:{

        /**
         * input回车搜索的时候
         */
        searchFun(){
            this.state = 0;
            this.$emit('search', this.value);
        },


        /**
         * input聚焦的时候
         */
        focusFunc(){
            if (this.disabled){ return } //如果禁用input框，则return
            //每次获取焦点时更新一次状态
            if (this.value==null || this.value==undefined || this.value==''){
                this.state = 0;
            } else {
                this.state = 1;
            }
            this.$emit('focus');
        },

        /**
         * 清空数据
         */
        clearValue(){
            this.$emit('input', '');
            this.$refs.searchInputDom.focus();
        },

        /**
        * 点击取消的按钮
        */
        cancleFun(){
            this.state = -1;
            this.$emit('input', '');
            this.$emit('cancel')
        }
    }
}
</script>
<style scoped lang="less">
@import '~themes/default/styles/common/index.less';
@import '~styles/mixins/mixinsStyle.less';
.search-bar-container{
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    .search-box{
        @height: .68rem;
        width: 100%;
        height: 100%;
        position: relative;
        display: flex;
        justify-content: space-between;
        align-items: center;
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
        .cancel-btn{
            height: @height;
            line-height: @height;
            text-align: left;
            margin-left: 0.3rem;
            background-color: transparent;
            color: @third-text-color;
            border-radius: 0.1rem;
            font-size: 0.28rem;
        }
        .input-part{
            height: 100%;
            flex: 1;
            position: relative;
            display: flex;
            justify-content: space-between;
            background: #fff;
            border-radius: @border-radius-base;

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
            .close-btn{
                display: flex;
                align-items: center;
                margin-right: .2rem;
                .icon{
                    fill: @disable-color;
                }
            }
        }
        form{
            flex: auto;
            height: 100%;
        }
        input{
            padding-left: 0.6rem ;
            font-size: 0.24rem;
            height: 100%;
            border-radius: @border-radius-base;
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
        }
        
        ::-moz-placeholder { /* Mozilla Firefox 19+ */
            font-size: .28rem;
        }
        
        :-ms-input-placeholder { /* Internet Explorer 10+ */
            font-size: .28rem;
        } 

        .icon-search{
            position: absolute;
            left: 0.2rem;
            top: 50%;
            transform: translateY(-50%);
            fill: @placeholder-color;
        }
        .icon-close{
            position: absolute;
            right: 0.24rem;
            top: 50%;
            transform: translateY(-50%);
            width: 0.32rem;
            height: 0.32rem;
            fill: @placeholder-color;
        }
    }
}
</style>