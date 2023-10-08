<template>
    <div class="roomInfoWrap">
        <div class="roomTit lineBorderB">
            <span>筛选</span>
            <icon class="but cursorp"  @click.native="closePopup" type="btn_common_close" size='.24' />
        </div>
        <div class="checkerScrollWrap trainlist">
            <div class="roomInfoTit">列车类型</div>
            <checker class="checkerWrap" type="checkbox" v-model="allOption.trainTypeOption" default-item-class="checkerDefault" selected-item-class="check">
                <checker-item :value="item" v-for="(item, index) in trainTypeList" :key="index">{{item}}</checker-item>
            </checker>
            <div class="roomInfoTit">发车时间</div>
            <checker class="checkerWrap" type="checkbox" v-model="allOption.timeOption" default-item-class="checkerDefault" selected-item-class="check">
                <checker-item :value="item" v-for="(item, index) in timeOptionList" :key="index">{{item}}</checker-item>
            </checker>
            <div class="roomInfoTit">出发站</div>
            <checker class="checkerWrap" type="checkbox" v-model="allOption.stationStartOption" default-item-class="checkerDefault" selected-item-class="check">
                <checker-item :value="item" v-for="(item, index) in stationStartList" :key="index">{{item}}</checker-item>
            </checker>
            <div class="roomInfoTit">到达站</div>
            <checker class="checkerWrap" type="checkbox" v-model="allOption.stationEndOption" default-item-class="checkerDefault" selected-item-class="check">
                <checker-item :value="item" v-for="(item, index) in stationEndList" :key="index">{{item}}</checker-item>
            </checker>
        </div>
        <div class="bottomButWrapBottom">
            <span class="rsetButton cursorp white-button-active" @click="clearSelected">重置</span>
            <span class="okButton cursorp blue-button-active" @click="filterTrain">确定</span>
        </div>
    </div>
</template>

<script>
import icon from "components/icon/index.vue"
import {
    Checker,
    CheckerItem
} from 'vux';
import trainHandler from 'trainHandler/common/lib/trainHandler.js';
	export default {
		directives: {
		},
		components: {
            Checker,
            CheckerItem,
            icon
        },
        props:{
             //车站列表，用于 底部导航栏 筛选 按钮
            stationStartList:{
                type:Array,
                default:function(){
                    return [];
                }
            },
            stationEndList:{
                type:Array,
                default:function(){
                    return [];
                }
            },
            allOptionProps:{
                type:Object,
                default:function(){
                    return {
                       //所有的筛选条件集合
                        trainTypeOption:[],//trainTypeList的结果集
                        timeOption:[],//timeOptionList的结果集
                        stationStartOption:[],//出发站的结果集
                        stationEndOption:[]//到达站的结果集
                    }
                }
            }
        },
		data: function() {
			return {
                //列车类型，用于 底部导航栏 筛选 按钮
                trainTypeList: [
                    '高铁(G/C)',
                    '动车(D)',
                    '普通(Z/T/K)',
                    '其它(L/Y等)',
                ], 
                //时间段列表，用于 底部导航栏 筛选 按钮
                timeOptionList: [
                    '00:00-06:00',
                    '06:00-12:00',
                    '12:00-18:00',
                    '18:00-24:00',
                ], 
                //筛选集合的最后的汇总
                allOption: JSON.parse(JSON.stringify(this.allOptionProps))
			}
        },
        watch:{},
		created: function() {},
		mounted: function() {
            //判断是否在首页勾选了高铁动车
            let trainType = parseInt(trainHandler.getStorage('trainType'));
            if(trainType==1){//说明勾选了高铁动车
                this.allOption.trainTypeOption.push('高铁(G/C)','动车(D)');
            }else{
                this.allOption.trainTypeOption = [];
            }
        },
		methods: {
            //根据allOption显示判断条件 看有没有筛选条件
            init(){
        
            },
            closePopup(){
                this.$emit('closePopup');
            },
            clearSelected(){
                this.clearOption();
            },
            //将筛选条件清空
            clearOption(){
                this.allOption.trainTypeOption = [];
                this.allOption.timeOption = [];
                this.allOption.stationStartOption = [];
                this.allOption.stationEndOption = [];
            },
            filterTrain(){
                this.$emit('filterTrain',this.allOption);
            },
        }
	}
</script>

<style scoped lang="less">
@import '~themes/default/styles/trainFilter.less';
</style>