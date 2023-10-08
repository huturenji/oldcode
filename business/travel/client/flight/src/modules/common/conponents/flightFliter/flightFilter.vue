<!--
README:
1. 本组件可独立使用，用户选择的选项都在privateSelectedFilters中。
当用户点击"确定"时，会把privateSelectedFilters传给父组件，如果父组件设置了selectedFilters，则privateSelectedFilters会和selectedFilters同步
2. confirm方法应作为privateSelectedFilters的唯一出口，否则数据可能会紊乱
3. 选项是否选中，基本是依靠privateSelectedFilters来驱动的。privateSelectedFilters的结构比较复杂，主要是为了在整个流程中使用同一套数据格式，方便双向绑定。
-->
<template>
    <div class="flight-filter-container">
        <div class="filter">
            <div class="popup-header">
                筛选
                <Icon type="icon_common_close" class="close icon-btn cursorp" size='.4' @click.native="closeFilter"/>
            </div>
            <!--显示选中的选项-->
            <div class="selected-options" v-if="!!privateSelectedFilters && Object.keys(privateSelectedFilters).length>0">
                <ul class="clear">
                    <template v-for="(opObj, type) in privateSelectedFilters">
                        <template v-if="opObj instanceof Array">
                            <template v-for="(obj,index) in opObj">
                                <template v-if="obj.value!=NOLIMIT.value">
                                    <li :key="index">
                                        {{obj.text}}
                                        <Icon type="icon_plane_close" size='.3' class='close' @click.native="checkOption(type, obj)"/>
                                    </li>
                                </template>
                            </template>
                        </template>
                        <template v-else>
                            <li :key="type">
                                {{opObj.text}}
                                <Icon type="icon_plane_close" size='.3' class='close' @click.native="checkOption(type, opObj)"/>
                            </li>
                        </template>
                    </template>
                </ul>
            </div>
            <div class="head-option">
                <div @click="checkOtherOption(!(privateSelectedFilters.DIRECTION || {}).value, 'DIRECTION')">
                    <Icon v-if='!!(privateSelectedFilters.DIRECTION || {}).value' type='btn_common_checkbox_sel' size='.4'/>
                    <Icon v-else type='btn_common_checkbox_nor' size='.4'/>
                    {{flightFilterName.DIRECTION}}
                </div>
                <div @click="checkOtherOption(!(privateSelectedFilters.HIDE_SHARE || {}).value, 'HIDE_SHARE')">
                    <Icon v-if='!!(privateSelectedFilters.HIDE_SHARE || {}).value' type='btn_common_checkbox_sel' size='.4'/>
                    <Icon v-else type='btn_common_checkbox_nor' size='.4'/>
                    {{flightFilterName.HIDE_SHARE}}
                </div>
            </div>
            <div class="option-list">
                <!-- 筛选条件名称 -->
                <div class="left" ref="selectOption">
                    <template v-for="(name,index) in filterOptionNames">
                        <div class="title cursorp" :key="index" :class="{isSelected: selectedFilterName==name}" @click="selectedFilterName=name">
                            <div class="hasValues" v-if="hasSelected(name)"></div>
                            {{name | optionName}}
                        </div>
                    </template>
                </div>
                <!--筛选条件选项，从FlightFilterKeyValue中根据key获取映射的选项，key和value是一对多关系-->
                <template v-for="(optionNameArr,name) in flightFilterKeyValue">
                    <div v-show="selectedFilterName==name" class="right" :key="name">
                        <template v-for="(optionName,index) in optionNameArr">
                            <div class="optionList" :key="index">
                                <filterOption :optionList='filterOptions[optionName]' :data="privateSelectedFilters[optionName]" :type="optionName" @checkOption="checkOption" @clearOption="clearOption" ></filterOption>
                            </div>
                        </template>
                    </div>
                </template>
            </div>
            <div class="footer">
                <span class="reset normal-btn cursorp" @click="clearSelected">清空选择</span>
                <span class="confirm normal-btn cursorp" @click="confirm">确定</span>
            </div>
        </div>
    </div>
</template>
<script>
import filterOption from './filterOption.vue';
import {FlightFilterName, FlightFilterKeyValue,NOLIMIT} from 'flightCommon/enum/flightFilterEnum.js';
import Icon from 'components/icon';
export default {
    components: {
        filterOption,Icon
    },
    data: function () {
        return {
            privateSelectedFilters: {},//本组件私有的容器。所有选中的选项先存储在这里，只有点击确认后才更新到父容器的selectedFilters中
            selectedFilterName: null,//选中的条件名称
            flightFilterName: FlightFilterName,//引入的枚举对象，筛选条件对应显示的文字
            flightFilterKeyValue: FlightFilterKeyValue,//引入的枚举对象，筛选条件对应的选项
            NOLIMIT: NOLIMIT
        }
    },
    props:{
        filterOptions:{
            type: Object,
            default: ()=>{
                return {}
            }
        },
        filterOptionNames:{
            type: Array,
            default: ()=>{
                return []
            }
        },
        selectedFilters: {
            type: Object,
            default: ()=>{
                return {}
            }
        },
        showFilter:{//本组件是否显示的变量
            type: Boolean,
            default: false
        }
    },
    filters:{
        optionName(value){
            return value && FlightFilterName[value];
        }
    },
    computed: {
    },
    created: function () {

    },
    mounted: function () {},
    watch: {
        filterOptions: {
            handler(_new, _old) {
                if (_new == _old){ //TODO 这么做不合理。筛选全部改成服务器过滤后，这里要改
                    return;
                }
                //默认选中第一个过滤条件
                if (!this.selectedFilterName && !!_new){
                    this.selectedFilterName = Object.keys(_new)[0];
                }
                this.compareFilterDataAndOptions();
            },
            deep: true,
            immediate: true
        },
        selectedFilters: {
            handler(_new) {
                this.resetFilterData(_new);
            },
            deep: true,
            immediate: true
        },
        /**
             * 监听外部的变量，如果本组件被隐藏，则重置数据
             */
        showFilter(_new){
            //如果直接还原数据，在关闭弹窗的过程中，能明显看到页面被更新，因此延迟500毫秒还原
            !_new && setTimeout(()=>{
                this.resetFilterData();
            },500);
        }
    },
    methods: {
        /**
             * 判断是否有选中的选项
             */
        hasSelected(type){
            let array = FlightFilterKeyValue[type];//筛选名字对应的选项名字
            return !!array && array.some(name => {
                return !!this.privateSelectedFilters[name] && this.privateSelectedFilters[name].filter(filter=>{ return filter.value!=NOLIMIT.value }).length>0;
            })
        },
        /**
             * 单独处理直飞和共享的选项
             */
        checkOtherOption(value, type){
            this.checkOption(type, {text: FlightFilterName[type], value: !value});
        },
        /**
             * 选中/取消选项，并更新选则的筛选条件
             * @opName 选项类型
             * @opValue 选项对象
             */
        checkOption(opName, opObj){
            //如果opValue是布尔类型，则直接赋值
            if (typeof(opObj.value)=='boolean'){
                !opObj.value ? this.$set(this.privateSelectedFilters, opName, {text: opObj.text, value: true}) : this.$delete(this.privateSelectedFilters, opName);
                this.removeEmptyFilter();
                return;
            }
            //如果原来没有选中过这个条件，就new一个数组
            this.privateSelectedFilters[opName] = this.privateSelectedFilters[opName] || this.$set(this.privateSelectedFilters, opName, []);
            let option = this.privateSelectedFilters[opName];
            //如果selectedFilters中存在该选项，就删除（即不选中），反之新增（即选中）
            let index;
            let exsit = option.some((options, _index) => { index = _index; return options.value==opObj.value });
            exsit ? option.splice(index, 1) : option.push(opObj);
            this.checkAll(opName);
            //删除空数据的选项
            this.removeEmptyFilter();
        },
        /**
             * 是否全部选中（包括“不限”）
             * 当除了“不限”以外的选项都选中时，把“不限”也勾上
             */
        checkAll(opName){
            let optionArr = this.privateSelectedFilters[opName];
            //巧妙的用已选中的非“不限”的选项个数和所有选项的个数比较，它们之间差值为1
            if (!optionArr.some(option=>{ return option.value==NOLIMIT.value }) && optionArr.length == this.filterOptions[opName].filter(option=>!option.noCheckbox).length-1){
                optionArr.push(NOLIMIT);
            } else {
                let noLimitIndex=-1;
                optionArr.some((option,index) => {
                    if (option.value == NOLIMIT.value){
                        noLimitIndex = index;
                        return true;
                    }
                    return false
                })
                noLimitIndex>-1 && optionArr.splice(noLimitIndex, 1);
            }
        },
        /**
             * 删除空数据以及只有"不限"的选项
             */
        removeEmptyFilter(){
            for (let key in this.privateSelectedFilters){
                let filter = this.privateSelectedFilters[key];
                if (filter.length==0
                    || (filter.length==1 && filter[0].value==NOLIMIT.value)){
                    this.$delete(this.privateSelectedFilters, key);
                }
            }
        },
        /**
             * 清空某类型的选项
             */
        clearOption(opName){
            this.privateSelectedFilters[opName] && (this.$delete(this.privateSelectedFilters, opName))
        },
        /**
             * 关闭所有pop
             * */

        closeFilter() {
            this.$emit('closeFilter');
        },
        /**
             * 清空所有选项
             */
        clearSelected() {
            this.privateSelectedFilters = {}
        },
        resetFilterData(data=this.selectedFilters){
            if (!!data && Object.keys(data).length>0){
                this.privateSelectedFilters = JSON.parse(JSON.stringify(data));
            } else {
                this.privateSelectedFilters = {}
            }
        },

        /**
             * 防止外部数据篡改内部数据：将外部传入的“选中的数据”和内部“选项中的数据”进行比较，如果发现两者不等，说明外部数据不合法，不予使用。同时更新外部数据。
             */
        compareFilterDataAndOptions(){
            for (let key in this.privateSelectedFilters){
                let selectedData = this.privateSelectedFilters[key];//传入的数据
                let optionData = this.filterOptions[key];//对应的选项数据
                //将传入的选中的数据进行过滤，如果和选项不匹配，则不使用这条数据
                selectedData = selectedData.filter(sData => {
                    return optionData.some(oData => {
                        return oData.value!==null && oData.value!==undefined && oData.value == sData.value;
                    })
                })
                if (selectedData.length>0){
                    this.privateSelectedFilters[key] = selectedData
                } else {
                    delete this.privateSelectedFilters[key];
                }
                this.confirm();
            }
        },
        /**
             * 条件过滤
             * 注意：其中可能含有NOLIMIT的值（即-1）
             */
        confirm() {
            this.$emit('confirm',Object.keys(this.privateSelectedFilters).length>0 ? this.privateSelectedFilters : null);//没选择就传null
        }
    }
}
</script>
<style scoped lang="less">
    @import '~themes/default/styles/common/index.less';
    @import '~platform/styles/mixins/hairLine.less';
    *{
        box-sizing: border-box;
    }
    .flight-filter-container{
        width: 100%;
        height: 100%;
    }
    .filter {
        height: calc(~"100% - 1rem");
        background-color: #ffffff !important;
        display: flex;
        flex-direction: column;

        .selected-options{
            flex: none;
            background-color: @background-color;
            max-height: 3.8rem;
            overflow-y: auto;
            ul{
                padding: .3rem .3rem 0;
                li{
                    position: relative;
                    border: 1px solid @theme-color;
                    border-radius: .08rem;
                    padding: 0 .3rem;
                    font-size: .26rem;
                    color: @theme-color;
                    margin: 0 .3rem .3rem 0;
                    height: .6rem;
                    line-height: .6rem;
                    text-align: center;
                    float: left;
                    .close{
                        position: absolute;
                        right: 0;
                        top: 0;
                        fill: #fff;
                        cursor: pointer;
                    }
                }
            }
        }

        .popup-header {
            .bbpx();
            flex: none;
            height: 1.02rem;
            line-height: 1.02rem;
            color: @text-color;
            font-size: .32rem;
            text-align: center;
            position: relative;

            .close {
                fill: @third-text-color;
                position: absolute;
                right: .3rem;
                top: 50%;
                transform: translateY(-50%);
            }
        }

        .head-option{
            flex: none;
            height: 1rem;
            line-height: 1rem;
            display: flex;
            align-items: center;
            padding: 0 .3rem;
            font-size: .3rem;
            .icon{
                fill: @theme-color;
                vertical-align: middle;
            }
            &>div{
                flex: 1;
                display: flex;
                align-items: center;
                .icon{
                    margin-right: .16rem;
                }
            }
        }

        .option-list {
            overflow: hidden;
            flex: auto;
            position: relative;
            .left {
                float: left;
                background: @background-color;
                width: 2rem;
                height: 100%;
                position: absolute;
                left: 0;
                right: 0;
                top: 0;
                bottom: 0;
                overflow-y: auto;
                .title {
                    height: .88rem;
                    line-height: .88rem;
                    font-size: .28rem;
                    color: @secondary-text-color;
                    font-weight:400;
                    position: relative;
                    text-align: left;
                    padding-left: .3rem;

                    &.isSelected {
                        background: #fff;
                    }

                    .hasValues{
                        width: .12rem;
                        height: .12rem;
                        border: .02rem solid #23CDA7;
                        border-radius: 50%;
                        background: #fff;
                        position: absolute;
                        left: .15rem;
                        top: .24rem;
                    }
                }
            }

            .right{
                .btpx();
                position: absolute;
                left: 0;
                right: 0;
                top: 0;
                bottom: 0;
                margin-left: 2rem;
                height: 100%;
                overflow-y: auto;
                padding-left: @white-space;
            }
        }

        .footer {
            position: absolute;
            background: #fff;
            bottom: 0;
            left: 0;
            right: 0;
            width: 100%;
            height: 1rem;
            display: flex;
            justify-content: space-around;
            box-shadow: 0px .06rem .2rem 0px rgba(101, 112, 242, 0.12);
            .reset {
                flex: 1;
                text-align: center;
                padding: .3rem;
                font-size: .34rem;
                border-top: 1px solid #f2f3f5f2;
                display: inline-block;
            }

            .confirm {
                flex: 1;
                text-align: center;
                padding: .3rem;
                font-size: .34rem;
                display: inline-block;
                background-color: @theme-color;
                color: #fff;
            }
        }
    }
</style>
