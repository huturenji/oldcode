<template>
    <div class="MyTripList" v-if="useTypeConfig && useTypeConfig.isPublic(modelData.hotelUseType, 3) && !modelData.getAuthing">
        
        <div class="contentWrap" v-if="modelData.haveAuth && tripListDate.length == 0 && useTypeConfig.isPublic(modelData.hotelUseType)">
            <div class="toptips">您已获特殊授权，可以预订<span class="antuTips cursorp normal-btn" @click="showAuthTips"><Icon type='icon_common_clamation-circle' class="circle normal-btn" size=".28"/></span></div>
        </div>
        
        <div class="warTipsWrap" v-if="!modelData.haveAuth && tripListDate.length == 0 && useTypeConfig.isPublic(modelData.hotelUseType)">
            <div class="warTips">未发现相关出差申请，请先提交申请</div>
        </div>
        <div class="contentWrap" v-if="tripListDate.length > 0">
            <div class="toptips" v-if="validTriplList.length == 1">你可以选择关联对应的行程，方便行程管理</div>
            <div class="toptips" v-if="validTriplList.length > 1">你可以选择关联对应的行程，方便行程管理</div>
            <div class="toptips" v-if="tripListDate.length > 0 && validTriplList.length == 0">您有相关出差申请正在审批，请在审批通过后预订</div>
            <div class="tripListWrap">
                <div class="tripList cursorp" :class="{active:(modelData.choosedTrip == trip.tripNo)}" v-for="(trip,index) in tripListDate" :key="index" @click="choosedTripFun(trip)">
                    <!-- :class="{'disabled':judgeTrip(trip)}" -->
                    <span>{{trip.cause}}</span>
                    <span v-if="judgeTrip(trip)" class="apply">审批中</span>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import tripHandler from './js/tripHandler.js';
import Icon from '../icon';
export default {
    directives:{
    },
    components:{
        Icon
    },
    props:{
        value:{
            type:Object,
            default(){
                return {
                    'choosedTrip':'', //选择的行程tripNo
                    'haveAuth':false, //是否有特殊授权
                    'tripListLength':0,
                    'hotelUseType': tripHandler.USE_TYPE_ENUM.PUBLIC.name, //因公还是因私
                    'getAuthing':false
                }
            }
        },
        inDays:{
            type:Number,
            default:1
        },
        departDate:{
            type:String,
            default:''
        },
        initTripNo:{
            type:String,
            default:''
        },
        noRefreshPage:{
            type:Boolean,
            default:false
        }
    },
    watch: {
        departDate: function (newValue) {
            let _this = this;
            if (newValue!='') {
                _this.init();
            }
        }
    },
    data() {
        return {
            tripListDate: [],//所有的行程数据
            validTriplList: [],//可用的行程数据，目前针对审批中状态的数据
            modelData: this.value,
            nowDate: parseInt(new Date(new Date()).getTime()),//当前时间
            initTripNoData:this.initTripNo,
            tripLimitBound:0,//预定日期设置
            useTypeConfig: null//获取因公因私的工具函数
        };
    },
    async created(){
        let _this = this;
        _this.init();    
        if (!this.noRefreshPage){
            sinosdk.sino.onChildWindowClose(function(){ //注册推送
                _this.getMyValidTripList();
            }.bind(this)); 
        }              
    },
    activated: function () {
        let _this = this;
        _this.init();
    },
    mounted(){
    },
    methods:{
        /**
             * 初始化数据
             */
        async init(){
            try {
                this.useTypeConfig = await tripHandler.useTypeConfig();   
                this.modelData.getAuthing = true;
                //获取商品列表 暂时屏蔽掉获取预定日期
                this.modelData.getAuthing = false;
                this.getMyValidTripList();
            } catch (e){
                console.error(e);
                this.getMyValidTripList();
            }
        },
        /**
             * 获取预定日期设置
             */
        getReservationDateRange(){
            return new Promise((resolve) => {
                // setTimeout(()=>{
                //     resolve(0);
                // }, 5000);
                // tripHandler.GetReservationDateRangeFunction({uaid: 0, cpyId: 0}).then(data => {
                //     if (data && data.ret == 0) {
                //         resolve(parseInt(data.responseData.range));
                //     }else{
                resolve(0);
                //     }
                // }).catch((err) => {
                //     console.log(err);
                //     resolve(0);
                // });
            })
        },
        /**
             * 判断是否有特殊授权
             */
        getHaveAuth(specialInfo){
            let _this = this;  
            let ret = false;
            if (specialInfo.length > 0){
                let specialData = specialInfo[0];
                if (!!specialData.forever){
                    ret = true;
                    _this.modelData.haveAuth = ret;
                    _this.$emit('input',_this.modelData)
                    return;
                }
                let startDate = parseInt(new Date(specialData.startTime).getTime());
                let endDate = parseInt(new Date(specialData.endTime).getTime())+24*60*60*1000-1;
                if (endDate > _this.nowDate && startDate < _this.nowDate){
                    ret = true;
                    _this.modelData.haveAuth = ret;
                    _this.$emit('input',_this.modelData)
                    return;
                }
            }
            _this.modelData.haveAuth = ret;
            _this.$emit('input',_this.modelData)
        },
        /**
             * 获取行程列表
             */
        getMyValidTripList() {
            const _this = this;
            if (this.departDate==''){
                return;
            }
            let param = {
                'fromDate': _this.departDate
            }      
            if (!!_this.tripLimitBound && 0 < _this.tripLimitBound){
                param['days'] = _this.tripLimitBound;
            }
            tripHandler.getMyValidTriplList(param).then((res) => {
                if (!!res.result.tripList) {
                    //不需要筛选掉审批中的行程 item.tripStatusEnum != 'APPLY'
                    _this.tripListDate = _this.validTriplList = res.result.tripList;
                        
                    _this.modelData.tripListLength = _this.validTriplList.length;
                        
                    if (_this.validTriplList.length == 0){ //无合法行程时
                        _this.modelData.choosedTrip = '';
                    } else if (_this.validTriplList.length > 0 && _this.useTypeConfig.isPublic(_this.modelData.hotelUseType)){ //有合法形成且因公
                        //只有一个合法行程时，默认选中
                        if (_this.validTriplList.length == 1){
                            _this.modelData.choosedTrip = _this.validTriplList[0].tripNo;
                        } else if (!_this.arrhaveitem(_this.modelData.choosedTrip,_this.validTriplList,'tripNo')){
                            //传入的行程不合法时，不采用
                            _this.modelData.choosedTrip = '';
                        } else if (_this.initTripNoData == ''){
                            //页面传入的行程为空时，去除选择的行程
                            _this.modelData.choosedTrip = '';
                        }
                    }
                    _this.$emit('input',_this.modelData)
                }
                _this.nowDate = parseInt(new Date(res.result.currentTime).getTime());
            }).catch((err) => {
                console.log(err);
            });
        },
        /**
             * 选择行程
             */
        choosedTripFun(trip){
            let _this = this;
            //审批中的不能选择
            // if(_this.judgeTrip(trip)){
            //     return
            // }
            if ( _this.modelData.choosedTrip == trip.tripNo){ //已经选中的是可以取消的
                _this.modelData.choosedTrip = '';
            } else {
                _this.modelData.choosedTrip = trip.tripNo;
            }
            _this.$emit('input',_this.modelData)
        },
        /**
             * 展示特殊授权说明
             */
        showAuthTips(){
            tripHandler.showConfirm('特殊授权是指您在 “因公” 出行时，无需提交出差申请，可直接预订机票、火车票、酒店；',function(){},1)
        },
        /**
             * 数组是否包含元素
             * @item 元素
             * @arr 数组
             */
        arrhaveitem(item,arr,key){
            var isInArr = false;
            var len = arr.length;
            for (var i=0;i<len;i++){
                if (arr[i][key] == item){
                    isInArr = true;
                    break;
                }
            }
            return isInArr;
        }, 
        /**
             * 判断该行程是否位申请中
             */
        judgeTrip(trip){
            return trip.tripStatusEnum == 'APPLY';
        }
    }
}
</script>
<style scoped lang="less">
@import '~styles/core/common.less';
@import '~styles/mixins/mixinsStyle.less';
.MyTripList{
    .warTipsWrap{
            background: #FFF4D7;
        .warTips{
            padding: 0.15rem 0.3rem 0.15rem 0.68rem;
            color: @danger-color-light;
            font-size: 0.26rem;
            background: url('./img/tips.png') no-repeat 0.3rem center;
            background-size: 0.3rem;
        }
    }
    .contentWrap{
        background: @sub-background-color;
        padding: 0.1rem 0.3rem;
        color: @text-color;
        .toptips{
            font-size:0.28rem;
            padding: 0.2rem 0;
            .flex-box();
            .align-items(center);
            .antuTips{
                display: inline-block;
                width: 0.3rem;
                height: 0.3rem;
                margin-left: 0.1rem;
                color:@theme-color; 
            }
        }
        .tripListWrap{
            .tripList{
                font-size:0.26rem;
                padding: 0.2rem 0 0.2rem 0.5rem;
                background: url('./img/btn_common_radio_nor@3x.png') no-repeat left;
                background-size: 0.4rem;
                &.active{
                    background: url('./img/btn_common_radio_sel2@3x.png') no-repeat left;
                    background-size: 0.4rem;
                }
                span{
                    display: inline-block;
                }
                .disabled{
                    color: @disable-color;
                }
                .apply{
                    width:1.1rem;
                    height:0.40rem;
                    line-height: 0.4rem;
                    text-align: center;
                    border-radius:0.20rem;
                    background-color: #FF6622;
                    color: @sub-background-color;
                    font-size: 0.26rem;
                }
            }

        }
    }
    
    
}
</style>

