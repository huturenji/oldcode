<template>
    <div class="editDetail">
        <template v-if='optionList'>
            <div class="dataList" v-for='(item, index) in optionList' @click="chooseItem(item)"  :key="index">
                <div class="detail" :class="{'label':item.type=='text'}">
                    <airlogo class="logo" v-if="item.airCode" :airCode="item.airCode"/><!--航班筛选用到的航班logo-->
                    {{item.text}}
                </div>
                <div class="checker" v-if="!item.noCheckbox">
                    <Icon v-if='checkedOption.some(option=>{return option.value==item.value})' type='btn_common_checkbox_sel' size='.4'/>
                    <Icon v-else type='btn_common_checkbox_nor' size='.4'/>
                </div>
            </div>
        </template>
    </div>
</template>
<script>
import Icon from 'components/icon';
import {NOLIMIT} from 'flightCommon/enum/flightFilterEnum.js';
import airlogo from 'components/airlogo/airlogo.vue';
export default {
    name: 'optionCheck',
    components: {
        airlogo,Icon
    },
    props: {
        optionList: {
            type: Array,
            default: function () {
                return []
            }
        },
        type: String,
        data: {
            type: Array,
            default: function () {
                return []
            }
        }
    },
    data: function () {
        return {
            checkedOption: []
        }
    },
    watch: {
        //父组件控制选项变化时，本组件自动更新选择状态
        data:{
            handler(_new){
                if (!!_new && _new.length>0){
                    this.checkedOption = _new;
                } else {
                    this.init();
                }
            },
            deep: true,
            immediate: true
        }
    },
    created: function () {
        //初始化时父组件可能已经传过来其他的值了，所以如果没有数据时才初始化成不限
        if (!this.checkedOption || this.checkedOption.length==0) {
            this.init();//默认只选中“不限”选项
        }
    },
    mounted: function () {
    },

    methods: {
        /**
             * 初始化成“不限”
             */
        init(){
            this.checkedOption = [NOLIMIT];
        },
        /**
             * 选择/取消选项
             * 本组件只负责展示样式和操作基本动作，选中的值都在父组件中保存
             * @param option
             */
        chooseItem(option){
            //如果选的是不限，则其他清空所有选项
            if (option.value==NOLIMIT.value){
                this.$emit('clearOption', this.type);
                return;
            }
            this.$emit('checkOption', this.type, option);
        }

    }
}

</script>
<style scoped lang="less">
    @import '~themes/default/styles/common/index.less';
    @import '~platform/styles/mixins/hairLine.less';
    .editDetail {

        .dataList {
            font-size: .28rem;
            display: flex;
            justify-content: space-between;
            height: .84rem;
            line-height: .84rem;
            padding-right: @white-space;
            &:not(:last-of-type){
                .bbpx();
            }

            &:last-of-type{
                margin-bottom: 0;
            }

            .checker {
                display: flex;
                align-items: center;
                .icon {
                    fill: @theme-color;
                }
            }

            .detail {
                &.label{
                    border-left: 2px solid @theme-color;
                    padding-left: .1rem;
                    color: #999;
                }
                .logo{
                    vertical-align: text-bottom;
                }
            }
        }
    }

</style>
