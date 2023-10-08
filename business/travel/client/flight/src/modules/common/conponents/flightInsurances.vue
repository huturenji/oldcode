<template>
    <div>
        <div class="insurancetitWrap" :class="{active:(choosedInsurance.length > 0 || unableChooseList.length > 0)}"
            v-if="!! insuranceList && insuranceList.length > 0">
            <div class='icon'></div>
            <div class="insurancetit">
                {{(choosedInsurance.length > 0 || unableChooseList.length > 0)?'守护您旅途平安':'买一份保险，多一份安心'}}</div>
        </div>
        <div class="insuranceWrap" v-if="!! insuranceList && insuranceList.length > 0">
            <template v-if="(index < MORE_INSURANCEIS_NUM) || moreInsuranceisShow">
                <div class="insurance lineBorderB"
                    :class="{active:getIsChoosedAll(item.productNo),unable:getIsUnableChoosed(item.productNo)}"
                    v-for="(item,index) in insuranceList" :key='index'>
                    <div class="insuranceText">
                        <div class="insuranceTextOut">
                            <div class="supplierName cursorp" @click.stop="showInsurance(item)">{{item.productShortName}}
                                <Icon type='icon_common_prompt' size='.28' class='icon'/>
                            </div>
                            <div class="shortDescription" v-for="(desItem,ind) in item.shortDescription.split('&')"
                                :key="ind">{{desItem}}</div>
                        </div>
                    </div>
                    <div class="insurancetips">
                        <div class="tipsText">
                            <span class='rmb small-size'>&yen;</span><span class='num-font'>{{item.farePrice}}</span>
                            /份<span class=' small-size'>x{{getInsuranceLength(item.productNo)}}</span>
                        </div>
                        <div class="tipsBut cursorp" @click="chooseInsuranceUser(item)">修改份数</div>
                    </div>
                    <Icon :type='getIsUnableChoosed(item.productNo) ? "btn_common_checkbox_dis" : getIsChoosedAll(item.productNo) ? "btn_common_checkbox_sel" : "btn_common_checkbox_nor"' 
                        size='.4' class='icon-check cursorp' @click.native="shooseInsurancefun(item.productNo)"/>
                </div>
            </template>
            <div class="moreInsuranceWrap cursorp"
                v-if="!moreInsuranceisShow && !! insuranceList && insuranceList.length > MORE_INSURANCEIS_NUM"
                @click="moreInsuranceisShow=true;">
                <div class="moreInsurance">
                    更多保险
                    <Icon type='icon_common_downarrow' size='.16' class='icon'/>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import Icon from 'components/icon';
import extendUtils from 'flightCommon/extend.js';
export default {
    components: {
        Icon
    },
    props: {
        value: {//选中的保险乘客列表
            type: Array,
            default(){
                return []
            }
        },
        insuranceList: {//保险列表
            type: Array,
            default(){
                return []
            }
        },
        customerList:{//乘客数组
            type: Array,
            default(){
                return []
            }
        },
        unableChooseList: {//不可操作的列表
            type: Array,
            default: () => { return [] }
        }
    },
    data() {
        return {
            choosedInsurance: this.value,
            moreInsuranceisShow: false,//更多保险是否显示、更多保险按钮是否隐藏
            MORE_INSURANCEIS_NUM: 3//超过此数显示更多
            // unableChooseList:this.unableChooseList,//不可操作的列表
            // customerList:this.customerList//
        }
    },
    mounted() {
        let _this = this;
        _this.getIsMoreInsuranceis();
    },
    watch: {
        customerList: {
            handler() {
                //更新优惠券
                this.checkAndSetChoosedByChange();
            },
            deep: true
        }
    },        
    methods: {
        /**
            * 选择保险
            */
        shooseInsurancefun(item) {
            let _this = this;
            if (0 == this.customerList.length){
                extendUtils.showToast('请先填写乘客信息');
                return;
            }
            //不可操作的数据不进行选取和取消选中
            if (_this.getIsUnableChoosed(item)){
                return;
            }
            //取消全选,能取消就表示有可取消的数据,insuredInfos不为[]
            if (_this.getIsChoosedAll(item)){
                let index = _this.indexOfArr(item, _this.choosedInsurance,'productNo');
                let tempInsuredInfos = JSON.parse(JSON.stringify(_this.choosedInsurance[index].insuredInfos));
                let insLen = _this.choosedInsurance[index].insuredInfos.length;
                //是否包含不可操作的人员
                let IsHaveUnable = false;
                for (let i=0;i<insLen;i++){
                    //是否在无法选列表内
                    let tempUserId = _this.choosedInsurance[index].insuredInfos[i].passengerId;
                    if (_this.getUserIsInUnable(item,tempUserId)){
                        IsHaveUnable = true;
                    } else {
                        tempInsuredInfos.splice(_this.indexOfArr(tempUserId,tempInsuredInfos,'tempUserId'), 1)
                    }
                }
                //有无法操作的数据直接赋值
                if (IsHaveUnable){
                    _this.choosedInsurance[index].insuredInfos = JSON.parse(JSON.stringify(tempInsuredInfos));
                } else if (0==tempInsuredInfos.length){
                    //全部取消
                    _this.choosedInsurance.splice(_this.indexOfArr(item, _this.choosedInsurance,'productNo'), 1);
                    //可操作的选项全部取消
                } else {
                    _this.choosedInsurance[index].insuredInfos = JSON.parse(JSON.stringify(tempInsuredInfos));
                }

            } else { //可操作性的选项全选
                let insLength = _this.customerList.length;
                for (let i=0;i<insLength;i++){
                    let ind = _this.indexOfArr(item, _this.choosedInsurance,'productNo');
                    //是否在无法选列表内
                    let tempUserId = _this.customerList[i].passengerId;
                    //是否是不可操作的人员
                    if (!_this.getUserIsInUnable(item,tempUserId)){
                        if (-1==ind){
                            _this.choosedInsurance.push({productNo:item,insuredInfos:[_this.customerList[i]]})
                        } else if (!_this.arrhaveitem(_this.customerList[i].passengerId,_this.choosedInsurance[ind].insuredInfos,'passengerId')){
                            _this.choosedInsurance[ind].insuredInfos.push(_this.customerList[i]);
                        }
                    }
                }
            }
            _this.choosedInsurance.sort(_this.sequence);
            _this.$emit('input', _this.choosedInsurance);
            //改签页面触发计算价格的方法
            _this.$emit('shooseInsurance', _this.choosedInsurance);
        },
        /**
            * 获取保险下人员是否在不可选择列表内
            */
        getUserIsInUnable(pro,passengerId){
            let _this = this;
            let res = false;
            let unableLen = _this.unableChooseList.length;
            for (let i=0;i<unableLen;i++){
                //是否在无法选列表内
                if (pro == _this.unableChooseList[i].productNo && passengerId == _this.unableChooseList[i].passengerId){
                    res = true;
                    break; 
                }
            }
            return res;
        },
        /**
            * 获取保险下选择人员的数量
            */
        getInsuranceLength(item){
            let _this = this;
            let str = 0;
            if (_this.arrhaveitem(item, _this.choosedInsurance,'productNo')){
                let index = _this.indexOfArr(item, _this.choosedInsurance,'productNo');
                str = _this.choosedInsurance[index].insuredInfos.length;
            }
            return str;
        },
        /**
            * 修改乘客后处理选中
            */
        checkAndSetChoosedByChange(){
            let _this = this;
            let arrLength = _this.choosedInsurance.length;
            let tempChoosedInsurance = JSON.parse(JSON.stringify(_this.choosedInsurance));
            for (let i=0;i<arrLength;i++){
                let sonArrLength = _this.choosedInsurance[i].insuredInfos.length;
                for (let j=0;j<sonArrLength;j++){
                    //判断单个保险下人员是否需要删除
                    if (!_this.arrhaveitem(_this.choosedInsurance[i].insuredInfos[j].passengerId,this.customerList,'passengerId')){
                        tempChoosedInsurance[i].insuredInfos.splice(_this.indexOfArr(_this.choosedInsurance[i].insuredInfos[j].passengerId, _this.choosedInsurance[i].insuredInfos,'passengerId'), 1);
                        //不需要删除则更新乘客数据
                    } else {
                        let customerIndex = _this.indexOfArr(_this.choosedInsurance[i].insuredInfos[j].passengerId, _this.customerList,'passengerId')
                        tempChoosedInsurance[i].insuredInfos[j] = _this.customerList[customerIndex];
                    }
                }
            }
            //判断保险内人员是否为空是否需要删除
            let tempArr = [];
            let beforeArrlength = tempChoosedInsurance.length;
            for (let i=0;i<beforeArrlength;i++){
                if (0!=tempChoosedInsurance[i].insuredInfos.length){
                    tempArr.push(tempChoosedInsurance[i]);
                }
            }
            _this.choosedInsurance = JSON.parse(JSON.stringify(tempArr));
            _this.$emit('input', _this.choosedInsurance);
            //改签页面触发计算价格的方法
            _this.$emit('shooseInsurance', _this.choosedInsurance);

        },
        /**
            * 查看保险详情
            */
        showInsurance(item) {
            let _this = this;
            _this.$emit('showInsuranceDo', item);
        },
        /**
            * 维数组是否包含元素
            */
        arrhaveitem(item, arr, key) {
            var isInArr = false;
            var len = arr.length;
            for (var i = 0; i < len; i++) {
                if (!!key ? arr[i][key] == item : arr[i] == item) {
                    isInArr = true;
                    break;
                }
            }
            return isInArr;
        },
        /**
            * 元素在数组中的索引
            */
        indexOfArr(val, arr, key) {
            for (var i = 0; i < arr.length; i++) {
                if (!!key ? arr[i][key] == val : arr[i] == val) {
                    return i;
                }
            }
            return -1;
        },
        /**
            * 正序排列
            */
        sequence(a, b) {
            if (a > b) {
                return 1;
            } else if (a < b) {
                return -1
            } 
            return 0;
                
        },
        /**
            * 获取是否显示更多保险按钮
            */
        getIsMoreInsuranceis() {
            let _this = this;
            let insuranceList = _this.insuranceList;
            let insuranceListLength = insuranceList.length;
            for (let i = _this.MORE_INSURANCEIS_NUM; i < insuranceListLength; i++) {
                if (_this.arrhaveitem(insuranceList[i].productNo, _this.unableChooseList,'productNo')) {
                    _this.moreInsuranceisShow = true;
                }
            }
        },
        /**
            * 设置保险购买人员
            */
        chooseInsuranceUser(item){
            let _this = this;
            if (0 == this.customerList.length){
                extendUtils.showToast('请先填写乘客信息');
                return;
            }
            let index = _this.indexOfArr(item.productNo, _this.choosedInsurance,'productNo');
            _this.$emit('chooseInsuranceUser', index==-1?{productNo:item.productNo,insuredInfos:[]}:_this.choosedInsurance[index]);
        },
        /**
            * 判断保险是否可以勾选
            */
        getIsUnableChoosed(pro){
            let _this = this;
            let res = false;
            let unableNum = 0;
            let len = _this.unableChooseList.length;
            for (let i=0;i<len;i++){
                if (pro == _this.unableChooseList[i].productNo){
                    unableNum++
                }
            }
            if (unableNum == _this.customerList.length && unableNum != 0){
                res = true;
            }
            return res;
        },
        /**
            * 判断可选保险是否全部勾选
            */
        getIsChoosedAll(pro){
            let _this = this;
            let res = false;
            let unableNum = 0;
            let index = _this.indexOfArr(pro, _this.choosedInsurance,'productNo');
            let custLen = _this.customerList.length;
            for (let i=0;i<custLen;i++){
                //判断是否已选或无法选择
                let isInUnableList = false;
                let isInChooseList = false;
                let len = _this.unableChooseList.length;
                for (let j=0;j<len;j++){
                    //是否在无法选列表内
                    if (pro == _this.unableChooseList[j].productNo && _this.customerList[i].passengerId == _this.unableChooseList[j].passengerId){
                        isInUnableList = true;
                        break; 
                    }
                }
                //是否在已选列表内
                if (-1 < index && _this.arrhaveitem(_this.customerList[i].passengerId, _this.choosedInsurance[index].insuredInfos || [],'passengerId')){
                    isInChooseList = true;
                }
                if (isInUnableList || isInChooseList){
                    unableNum++;
                }
            }
            if (unableNum == custLen && unableNum != 0){
                res = true;
            }
            return res;
        }
    }
}
</script>
<style scoped lang="less">
    @import '~themes/default/styles/common/index.less';
    @import '~styles/mixins/hairLine.less';

    .insurancetitWrap {
        padding: 0 0.3rem;
        position: relative;
        background: url(~themes/default/img/flightList/bg_plane_Insurance1.jpg) no-repeat 0 0;
        background-size: cover;
        color: #fff;
        height: .8rem;
        line-height: .8rem;
        .icon{
            background: url(~themes/default/img/flightList/icon_plane_bao.png) no-repeat 0 0;
            background-size: contain;
            width: .48rem;
            height: .48rem;
            position: absolute;
            left: .3rem;
            top: 50%;
            transform: translateY(-50%);
        }
        .insurancetit {
            font-size: 0.3rem;
            padding-left: .6rem;
        }

        &.active {
            background: url(~themes/default/img/flightList/bg_plane_Insurance2.jpg) no-repeat 0 0;
            background-size: cover;
        }
    }

    .insuranceWrap {
        background: #fff;
        font-size: 0.24rem;
        color: @text-color;
        padding: .2rem 0.3rem;

        .insurance {
            display: flex;
            border: 0;
            padding: 0.2rem 0;
            justify-content:space-between;
            align-items: center;

            img {
                vertical-align: middle;
                width: .3rem;
                padding-left: inherit;
                margin-left: .1rem;
            }

            .insuranceText {
                flex: 1;

                .insuranceTextOut {
                    align-items: center;

                    .supplierName {
                        font-size: 0.3rem;
                        display: flex;
                        align-items: center;
                        .icon{
                            fill: @third-text-color;
                            margin-left: .1rem;
                        }
                    }

                    .shortDescription {
                        padding-top: 0.1rem;
                        color: @third-text-color;
                        font-size: 0.24rem;
                    }
                }
            }

            .insurancetips {
                margin: 0 .4rem 0 .2rem;
                font-size: 0.3rem;
                text-align: right;
                .small-size{
                    font-size: .24rem;
                }
                .tipsBut{
                    font-size: .24rem;
                    color: @theme-color;
                }
            }
        }


        .insurance.unable {
            color: #999;

            .insuranceIcon {
                background: url(~assets/img/orderConfirm/unabelcheck.png) no-repeat center;
                background-size: 0.38rem;
            }

            .insuranceText {
                .insuranceTextOut {
                    .supplierName {
                        color: #999;
                    }

                    .shortDescription {
                        color: #999;
                    }
                }
            }
        }

        &.gray {
            .insurance {
                color: #999;

                .insuranceText {
                    .insuranceTextOut {
                        .supplierName {
                            color: #999;
                        }

                        .shortDescription {
                            color: #999;
                        }
                    }
                }
            }
        }

        .moreInsuranceWrap {
            text-align: center;

            .moreInsurance {
                .bpx(1px, .24rem);
                margin: .3rem auto .1rem;
                width: 1.76rem;
                height: .48rem;
                line-height: .48rem;
                border-radius: 50%;
                font-size: 0.24rem;
                color: @secondary-text-color;
                .icon{
                    margin-left: .06rem;
                    fill: @placeholder-color;
                }
            }
        }
    }
</style>
