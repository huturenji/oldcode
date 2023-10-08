<template>
    <div class="search-bar-container">
        <div class="search-box">
            <Icon type='icon_search_default' size='.32' />
            <form action="javascript:return true;">
                <input type="search" ref="searchInputDom" :placeholder='placeholder' @keyup.13="searchFun" autocomplete='off'
                    @focus="focusFun" @blur='blurFun' @click='$emit("click")' @input='inputSearch' v-model.trim="searchValue" :disabled="disabled" :required="disabled">
            </form>
            <Icon type='search_close' size=".32" v-if='currStatu.key=="search" && searchValue!=null && searchValue!=""' @click.native="clearValue" />
            <!--联想搜索未实现-->
            <template v-if='associateList'>
                <ul class='associate-list'>
                    <li v-for='word in associateList' :key="word">
                        {{word}}
                    </li>
                </ul>
            </template>
        </div>
        <div class='btn icon-btn' v-if='!!currStatu.text' :class="{showCancel:showCancel}" @click='currStatu.click'>{{currStatu.text}}</div>
    </div>
</template>
<script>
// import extendUtils from 'common/lib/utils';
import Icon from 'commonComp/icon';

const DEFAULT_PLACEHOLDER = '搜索';

export default {
    name: 'searchBar',
    components: { Icon },
    props: {
        //传递进来的搜索关键字
        value: {
            type: String,
            default: ''
        },
        //input 的placeholder内容
        placeholder: {
            type: String,
            default: DEFAULT_PLACEHOLDER
        },
        statu: {//初始的状态
            type: String,
            default: 'NONE'
        },
        autoFocus: {//是否自动获取焦点
            type: Boolean,
            default: false
        },
        //input框是否可用 或只读
        disabled: {
            type: Boolean,
            default: false
        },
        associateList: {//搜索联想，未实现
            type: Array,
            default: null
        },
        async: {//输入时是否同步更新v-model
            type: Boolean,
            default: false
        },
        showCancel: {//控制是否显示取消按钮
            type: Boolean,
            default: false
        },
        defaultKeyWord: {
            type: String,
            default: null
        }
    },
    data() {
        let statusObj = {
            NONE: {
                key: 'none',
                text: null,
                click: ()=>{}
            },
            INIT: {//这个状态未使用，目前使用的是IOS的交互习惯，只有“取消”按钮
                key: 'init',
                text: '搜索',
                click: this.searchFun
            },
            SEARCH: {
                key: 'search',
                text: '取消',
                click: this.cancelFun
            }
        };
        return {
            searchValue: null,
            statusObj: statusObj,
            currStatu: statusObj[this.statu.toUpperCase()]
        }
    },
    computed: {
    },
    mounted() {
        //自动获取焦点
        if(this.autoFocus){
            this.focus();//移动端无效，必须是用户主动操作才能获取焦点并弹出键盘
        }
    },
    watch: {
        value(_new){
            this.searchValue = _new;
        }
    },
    methods: {
        /**
             * input回车搜索的时候
             */
        searchFun() {
            //没有输入直接点搜索，使用placeholder作为关键词；但placeholder不能是“搜索”
            if(this.searchValue==null || this.searchValue=='' && this.defaultKeyWord!=null){
                this.searchValue = this.defaultKeyWord;
            }
            this.$refs.searchInputDom.blur();
            this.$emit('input', this.searchValue);
            this.$emit('search', this.searchValue);
        },

        /**
             * input聚焦的时候
             */
        focusFun() {
            //如果禁用input框，则return
            if (this.disabled) {
                return
            }
            this.focus();
            this.$emit('focus');
        },

        /**
             * 清空数据
             */
        clearValue() {
            this.searchValue = null;
            this.$emit('input', null);
            this.$emit('cancel', 'clear');
        },

        cancelFun(){
            this.$refs.searchInputDom.blur();
            this.searchValue = null;
            this.$emit('input', null);
            this.$emit('cancel', 'cancel');
        },

        inputSearch(){
            // eslint-disable-next-line no-unused-expressions
            this.async && this.$emit('input', this.searchValue);
        },

        focus(){
            this.currStatu = this.statusObj.SEARCH;
            this.$refs.searchInputDom.focus();
        },

        blurFun(){
            this.$emit('blur');
        }
    }
}
</script>
<style scoped lang="less">
    @import "~themes/default/styles/index/index.less";

    .search-bar-container {
        width: 100%;
        height: .68rem;
        display: flex;
        align-items: center;
        background: transparent;
        justify-content: space-between;
        .showCancel{
            display: none;
        }
        .search-box {
            position: relative;
            flex: auto;
            height: 100%;
            .icon {
                &.icon_search_default {
                    fill: @third-text-color;
                    position: absolute;
                    left: .26rem;
                    top: 50%;
                    margin-top: -.16rem;
                }

                &.search_close {
                    fill: #D3D3D3;
                    position: absolute;
                    right: .26rem;
                    top: .18rem;
                    cursor: pointer;
                }
            }

            form {
                height: 100%;
                input:-webkit-autofill {
                    transition: background-color 5000s ease-in-out 0s;
                }
                input {
                    -webkit-appearance:none;
                    border-radius: 0;
                    outline:none;
                    background:ragb(0,0,0,0);
                    -webkit-tap-highlight-color:rgba(0,0,0,0);
                }
                input {
                    padding: 0 .6rem 0 .64rem;
                    height: 100%;
                    line-height: normal;
                    background:@search-background-color;
                    border-radius: .2rem;

                    &::placeholder {
                        color: @placeholder-color;
                        text-align: center;
                        font-size: .28rem;
                        line-height: normal;
                    }
                }
            }
        }

        .btn {
            font-size: .28rem;
            color: @third-text-color;
            cursor: pointer;
            width: 0.86rem;
            text-align: right;
        }
    }

    input[type=search] {
        -webkit-appearance: textfield;
        -webkit-box-sizing: border-box;
    }

    input::-webkit-search-decoration,
    input::-webkit-search-cancel-button {
        display: none;
    }
</style>