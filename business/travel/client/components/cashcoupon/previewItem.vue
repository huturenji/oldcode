<template>
  <div class="my_coupon">
        <div class="coupon_item">
            <div class="coupon_pre_left" :class="{grey:couponItem.useState == 3}">
                <div class="coupon_pre_price num-font" ref='fitFont'
                    v-if="couponItem.cashcouponType != 2">
                    <span class="text unit num-font">¥</span><span class="text price_int num-font">{{couponItem.amount}}</span>
                </div>
                <div class="coupon_pre_price"
                    v-if="couponItem.cashcouponType == 2">
                    <div class=""></div>
                    <div
                        class="price_int">{{toSplit(toFixNum(couponItem.amount,1))[0]}}</div>.
                    <div
                        class="price_decimal">{{toSplit(toFixNum(couponItem.amount,1))[1]}}</div>
                    <div class="price_decimal">折</div>
                </div>
                <div class="coupon_pre_active">
                    {{couponItem.cashcouponContent}}</div>
            </div>
            <div class="coupon_pre_cen" :class="{grey:couponItem.useState != '1'}">
                <div class="coupon_pre_title">{{couponItem.cashcouponName}}</div>
                <div class="coupon_pre_time">
                    <div>{{couponItem.effectiveStart}}</div>
                    <div>~</div>
                    <div>{{couponItem.effectiveEnd}}</div>
                </div>
                <div class="coupon_pre_rules" @click.stop="descriptionOpen(couponItem)">
                    <div class='text'>使用规则</div>
                    <span class='triangle' :class="{isOpen: couponItem.isOpen}" 
                    :style="{opacity:couponItem.useState != '1'?'0.4':'1'}"
                    ></span>
                </div>
            </div>
            <!-- 优惠券中间分割线 -->
            <div class="kacao kacao1" v-if="couponItem.useState == '1'"></div>
            <div class="kacao kacao3" v-else></div>
            <div class="coupon_pre_right">
                <div v-if="couponItem.useState == '1'" class="coupon_right haveNotUse">
                    <div class='content'>
                        <div>已领取</div>
                        <div class='btn' @click="useCoupon(couponItem)">去使用</div>
                    </div>
                </div>
                <div v-else-if="couponItem.useState == '2'" class="coupon_right haveUse"></div>
                <div v-else-if="couponItem.useState == '3'" class="coupon_right haveExpired"></div>
                <div v-else class="coupon_right disabled"></div>
            </div>
        </div>
        <div class="coupon_rules" v-if="couponItem.isOpen == true">
            <div class="coupon_rules_title"><div>{{couponItem.description}}</div></div>
        </div>

        <div v-transfer-dom>
            <popup v-model="showBussinessType" width="100%" position='bottom' class="bussiness-type">
                <ul>
                    <li @click='openApplet("flight")'>订机票</li>
                    <li @click='openApplet("hotel")'>订酒店</li>
                </ul>
                <div class='btn' @click='closeBussinessType()'>取消</div>
            </popup>
        </div> 
    </div>
</template>

<script>
import {
    TransferDom,
    Popup
} from 'vux';
var extendUtils = SnTravel.functional;
export default {
    directives: {
        TransferDom
    },
    components: {
        Popup,
    },
    props: {
        couponItem: {
            type: Object,
            require: true
        },
        isMobileModuleEnabled: {
            type: Boolean,
            default: false
        },
    },
    data(){
        return {
            currCoupon: null,
            showBussinessType: false,
        }
    },
    mounted(){
        this.$nextTick(()=>{
            this.fitFontSize(this.$refs.fitFont)
        })
    },
    watch: {
        couponItem: {
            handler(_new){
                if(extendUtils.isNotEmpty(_new)){
                    this.$nextTick(()=>{
                        this.fitFontSize(this.$refs.fitFont)
                    })
                }
            },
            deep: true
        }
    },
    methods: {
        descriptionOpen(coupon){
            this.$set(coupon, 'isOpen', !!!coupon.isOpen)
        },
        fitFontSize(domObj, minSize=12) {
            if(extendUtils.isEmpty(domObj)){
                return;
            }
            let that = this;
            let zoom = false;
            const fontOverFlow = dom => {
                let parent = dom.parentElement;
                let parentStyle = extendUtils.getStyle(parent);
                if(!dom.offsetWidth || !dom.parentElement.offsetWidth){
                    return false;
                }
                return dom.offsetWidth >= dom.parentElement.offsetWidth - parseFloat(parentStyle.paddingLeft) - parseFloat(parentStyle.paddingRight);
            }
            const isAllEqual = array => {
                if (array.length > 0) {
                    return !array.some(function(value) {
                        return value !== array[0];
                    });
                }
                return true;
            }
            var children=domObj.childNodes;
            let breakLoop=false;
            let list;
            while (!!fontOverFlow(domObj) && !breakLoop){
                list = [];
                children.forEach((citem)=>{
                    if (citem.nodeType==1){
                        citem.style.fontSize = parseInt(extendUtils.getStyle(citem, 'fontSize')) - 1 + 'px';
                        if (parseInt(citem.style.fontSize) <= minSize){
                            citem.style.whiteSpace = 'normal';
                            citem.style.lineHeight = 'initial';
                            citem.style.fontSize = minSize+'px';
                        }
                        list.push(parseInt(extendUtils.getStyle(citem, 'fontSize')));
                        if (list.length>1 && isAllEqual(list)){
                            breakLoop = true;
                        } else {
                            breakLoop = false;
                        }
                    }
                })
            }
        },
        useCoupon(couponItem){
            if(this.isMobileModuleEnabled){
                this.openApplet('mobile')
            }else{
                this.showBussinessType = true;
                this.currCoupon = couponItem
            }
        },
        closeBussinessType(){
            this.showBussinessType = false;
            this.currCoupon = null
        },
        //去使用代金券
        openApplet(appletName){
            this.closeBussinessType()
            let newUrl = appletName + '/index.html#/';
            let tomorrow = 24*60*60*1000;//一天的毫秒数
            newUrl = `${newUrl}?departTime=${new Date().getTime() + tomorrow}&pageFrom=entryList`
            this.openPageLib(newUrl)
        },
        openPageLib(url){
            let newUrl = '';
            let preUrl = null;
            for (const key in extendUtils.OPENPAGE_MAP) {
                if (url.indexOf(key) > -1) {
                    preUrl = extendUtils.OPENPAGE_MAP[key];
                    break;
                }
            }
            newUrl = preUrl ? (extendUtils.HTTP_CONT.ORIGIN + preUrl + url) : url;
            extendUtils.openPage(newUrl);   
        },
        toSplit(value) {
            return value.toString().split('.');
        },
        toFixNum(value, num){
            return Number(value).toFixed(num); //将字符串转成纯数字，保留几位小数
        },
    }
}
</script>

<style scoped lang="less" type="text/less">
@import './previewItem.less';
</style>
