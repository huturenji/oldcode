<template>
    <div>
        <div v-if="!userCardType" class="insurancetitWrap">
            <div class="insurancetit">保险仅支持使用身份证购买，请更换乘机人证件类型后选购</div>
        </div>
        <div class="insurancetitWrap" :class="{active:(choosedInsurance.length > 0 || unableChooseList.length > 0)}"
            v-else-if="!! insuranceList && insuranceList.length > 0">
            <div class="insurancetit">
                {{(choosedInsurance.length > 0 || unableChooseList.length > 0)?'守护您旅途平安':'买一份保险，多一份安心'}}</div>
        </div>
        <div class="insuranceWrap" :class="{gray:!userCardType}" v-if="!! insuranceList && insuranceList.length > 0">
            <template v-for="(item,index) in insuranceList">
            <div v-if="index < MORE_INSURANCEIS_NUM || moreInsuranceisShow" class="insurance lineBorderB cursorp"
                :class="{active:arrhaveitem(index,choosedInsurance),unable:arrhaveitem(item.productNo,unableChooseList)}"
                @click.stop="showInsurance(item)" :key='index'>
                <div class="insuranceIcon cursorp" @click.stop="shooseInsurancefun(index,item)"></div>
                <div class="insuranceText">
                    <div class="insuranceTextOut">
                        <div class="supplierName">{{item.productShortName}}<img
                                src="~assets/img/flightList/icon_tips.png"></div>
                        <div class="shortDescription" v-for="(desItem,ind) in item.shortDescription.split('&')"
                            :key="ind">{{desItem}}</div>
                    </div>
                </div>
                <div class="insurancetips">￥{{item.farePrice}}/份 x {{customerLength}}</div>
            </div>
            </template>
            <div class="moreInsuranceWrap cursorp"
                v-if="!moreInsuranceisShow && !! insuranceList && insuranceList.length > MORE_INSURANCEIS_NUM"
                @click="moreInsuranceisShow=true;"><span class="moreInsurance">更多保险</span></div>

        </div>
    </div>
</template>
<script>
export default {
    components: {

    },
    props: {
        value: {
            type: Array,
            default: function() {
                return []
            }
        },
        userCardType: {
            type: Boolean,
            default: true
        },
        insuranceList: {
            type: Array,
            default: function() {
                return []
            }
        },
        customerLength: {
            type: Number,
            default: 0
        },
        unableChooseList: {
            type: Array,
            default: () => { return [] }
        }
    },
    data() {
        return {
            choosedInsurance: this.value,
            moreInsuranceisShow: false,//更多保险是否显示、更多保险按钮是否隐藏
            MORE_INSURANCEIS_NUM: 3//超过此数显示更多
        }
    },
    mounted() {
        let _this = this;
        _this.getIsMoreInsuranceis();
    },
    methods: {
        /**
            * 选择保险
            */
        shooseInsurancefun(index, item) {
            let _this = this;
            if (!this.userCardType || _this.arrhaveitem(item.productNo, this.unableChooseList)) {
                return;
            }
            if (_this.arrhaveitem(index, _this.choosedInsurance)) {
                _this.choosedInsurance.splice(_this.indexOfArr(index, _this.choosedInsurance), 1);
            } else {
                _this.choosedInsurance.push(index)
            }
            _this.choosedInsurance.sort(_this.sequence);
            console.log(_this.choosedInsurance);
            _this.$emit('input', _this.choosedInsurance);
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
            // let _this = this;
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
                if (_this.arrhaveitem(insuranceList[i].productNo, this.unableChooseList)) {
                    _this.moreInsuranceisShow = true;
                }
            }
        }
    },
    watch: {
    }
}
</script>
<style scoped lang="less">
    @import '~themes/default/styles/common/index.less';
    @import '~styles/mixins/mixinsStyle.less';

    .insurancetitWrap {
        padding: 0 0.3rem;
        background: #fff4d7;

        .insurancetit {
            padding: 0.15rem 0 0.15rem 0.5rem;
            font-size: 0.3rem;
            color: #f36f00;
            background: url(~assets/img/flightList/icon_insurance.png) no-repeat left;
            background-size: 0.32rem 0.4rem;
        }

        &.active {
            background: #e4ffd7;

            .insurancetit {
                color: #25cb67;
                background: url(~assets/img/flightList/icon_insurance_green.png) no-repeat left;
                background-size: 0.32rem 0.4rem;
            }
        }
    }

    .insuranceWrap {
        background: #fff;
        font-size: 0.24rem;
        color: @text-color;
        padding: 0 0.3rem;

        .insurance {
            display: -ms-flexbox;
            display: -webkit-box;
            display: -webkit-flex;
            display: flex;
            border: 0;
            padding: 0.25rem .3rem 0.25rem 0;
            color: @text-color;
            background: #ffffff;
            .justify-content(space-between);
            .align-items(center);

            img {
                vertical-align: middle;
                width: .3rem;
                padding-left: inherit;
                margin-left: .1rem;
            }

            .insuranceIcon {
                width: 1.2rem;
                height: 0.6rem;
                background: url(~assets/img/orderDetail/unCheck.png) no-repeat left 0.36rem center;
                background-size: 0.38rem;
            }

            .insuranceText {
                .flex(1);

                .insuranceTextOut {
                    // display: -ms-flexbox;
                    // display: -webkit-box;
                    // display: -webkit-flex;
                    // display: flex;
                    .align-items(center);

                    span {
                        width: 0.6rem;
                        height: 0.6rem;
                        background: url(~assets/img/compment/icon_about.png) no-repeat center;
                        background-size: 0.36rem;
                        cursor: pointer;
                    }

                    .supplierName {
                        font-size: 0.32rem;
                        color: @text-color;
                    }

                    .shortDescription {
                        padding-top: 0.1rem;
                        color: #999;
                        font-size: 0.26rem;
                    }
                }
            }

            .insurancetips {
                width: 2rem;
                font-size: 0.3rem;
                text-align: right;
            }
        }

        .insurance.active .insuranceIcon {
            background: url(~assets/img/orderDetail/check.png) no-repeat left 0.36rem center;
            background-size: 0.38rem;
        }

        .insurance.unable {
            color: #999;

            .insuranceIcon {
                background: url(~assets/img/orderDetail/unabelcheck.png) no-repeat left 0.36rem center;
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
                line-height: 0.7rem;
                padding-right: 0.35rem;
                font-size: 0.28rem;
                color: #999;
                background: url(~assets/img/compment/icon_more.png) no-repeat right;
                background-size: 0.21rem 0.12rem;

            }

            &:active {
                .moreInsurance {
                    color: #c2c2c2;
                    background: url(~assets/img/compment/icon_more_hov.png) no-repeat right;
                    background-size: 0.21rem 0.12rem;
                }

            }
        }
    }
</style>
