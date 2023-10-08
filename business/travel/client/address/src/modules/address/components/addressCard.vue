<template>
  <div class="editDetail">
    <div v-if="loading" class="loadingMask" >
      <snLoading tip='页面加载中...' :spinning="true" :turn="true"/>
    </div>
    <EmptyX class="empty_wrap" type="noaddress" v-else-if='!loading && 0 == addressList.length' tipsText='暂无配送地址' />
    <div v-else class="showReceiptList">
      <div class="item-wrap"  v-for='(item,index) in addressMaskInsList' :key="index">      
        <swipeout>
          <swipeout-item :disabled='isPC' :sensitivity="10" :ref='"swipeoutItem"+index' @on-open="handleSwipeoutOpen(index)" @on-close="openedIndex = -1" :class="{openedClass:index==openedIndex}">
            <div slot="right-menu">
              <swipeout-button v-if='!item.defaultFlag' class="default_swipe" @click.native="editItem(index,'default')" background-color="#262DD9">设为默认</swipeout-button>
              <swipeout-button v-else class="default_swipe" background-color="#d3d3d3">设为默认</swipeout-button>
              <swipeout-button class="delete_swipe" @click.native="deleteAddress(index)" background-color="#FF4E3A">删除</swipeout-button>
            </div>
            <div slot="content">
              <div class="receiptList" @click="chooseItem(item, index)">
                <div class="detail">
                  <div v-if='showCheck' class="checker cursorp">
                    <icon :type="checkChoose(item)?'btn_common_checkbox_sel':'btn_common_checkbox_nor'" size='.4' />
                  </div>
                  <div class='list'>
                    <div class="item">
                      <div class="main" :class="{noPC: !isPC}">
                        <span class='title cursorp' :title="item.name">{{item.name}}</span>
                        <span class='content cursorp'>{{item.phone}}</span>
                        <span class='default-img' v-if='item.defaultFlag'>
                          <img src="./img/default.png">
                        </span>
                      </div>
       
                      <div class="buttonGroup cursorp" v-if='isPC' @click=stopProp>
                        <span @click='editItem(index,"address")'>编辑</span>
                        <span @click='deleteAddress(index)'>删除</span>
                        <span v-if='!item.defaultFlag' @click="editItem(index,'default')">设为默认</span>
                        <span v-else class="disable">默认地址</span>
                      </div>
                      <div class="edit" style="z-index:100" v-else>
                        <div @click.stop="editItem(index,'address')"><icon type="btn_common_edit" size='.32'/></div>
                      </div>
                    </div>
                    <div class="full-address">
                      <icon type="location" size='.28'/>
                      <span class="address">{{item.area}} {{item.address}}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </swipeout-item>
        </swipeout>      
      </div>
    </div>

    <!-- 新增和编辑地址dom部分 -->
    <div v-transfer-dom>
        <popup v-model="showAddAddress" :popup-style="{zIndex: 550}" height="100%" width="100%" position="right" class="popBox" :hide-on-blur="false" :show-mask="false">
            <div class="addEdit addEdit-address">
                <SnText 
                    class="weui-cell" 
                    isMustFill
                    isRightAlign
                    :maxlength="15" 
                    :label="nameTitle" 
                    placeholder="请输入收件人姓名"
                    :value="addAddressContent.name" 
                    v-model="addAddressContent.name" 
                ></SnText>
                <SnText 
                    class="weui-cell" 
                    isMustFill
                    isRightAlign
                    :maxlength="11" 
                    label="手机号码" 
                    placeholder="请输入收件人手机号"
                    :value="addAddressContent.phone" 
                    v-model="addAddressContent.phone"
                    @focus="setObj(addAddressContent,'phone')"
                ></SnText>
                <!-- 您可以一键导入公司共享地址 -->
                <div class="import-adddress">
                  <span>您可以一键导入公司共享地址</span>
                  <span @click="showShareList=true" class="btn">导入地址</span>
                </div>

                <div class="chooseArea weui-cell hasStar cursorp" @click="chooseAreaShowFun(addAddressContent.areaCode || '')">
                  <div class="title">所在地区</div>
                  <div class="option" :class="{placeholder: !addAddressContent.area || addAddressContent.area==''}">
                      <span>{{addAddressContent.area || '请选择省/市/区'}}</span>
                      <icon type="icon_common_rightarrow" size='.24' />
                  </div>
                </div>
                <SnText 
                    class="weui-cell" 
                    isMustFill
                    isRightAlign
                    :maxlength="100" 
                    label="详细地址" 
                    placeholder="请输入详细地址"
                    :value="addAddressContent.address" 
                    v-model="addAddressContent.address"
                ></SnText>

                <!-- 共享到公司共享地址 -->
                <div class="share-address-tips">
                  <div @click="addCompanyShareList=!addCompanyShareList" class="icon"><icon :type="addCompanyShareList?'btn_common_checkbox_sel':'btn_common_checkbox_nor'" size=".4"/></div>
                  <div class="content">
                    <p class="title">共享到公司共享地址</p>
                    <p class="tips">公司所有同事都可使用该地址</p>
                  </div>
                </div>

                <div class="top-line"></div>

                <div class="setDefault">
                  <div class="titleName">设为默认地址</div>
                  <snSwitch class='cursorp' slot="right-icon" v-model="addAddressContent.defaultFlag" />
                </div>
                
                <div class='save cursorp' @click='saveAddress'>保存</div>
                
            </div>
        </popup>
    </div>

    <div v-transfer-dom>
      <popup v-model="chooseAreaShow" :popup-style="{zIndex: 650}" height="60%" :show-mask="false">
        <addressComp
          @selectAddress="selectAddress"
          @closePop="closePopFun"
        ></addressComp>
      </popup>
    </div>

    <!-- mask自定义遮罩层 -->
    <div v-transfer-dom>
        <div v-if="showMask" class="mask" @click="closePopFun"></div>
    </div>

      <div class="addNewWrap noPadding">
        <div class="addNewWrapIn">
            <div class='addNew cursorp' @click='showReceipt'>
              <span>新增配送地址</span>
            </div>
        </div>
      </div>
        <div v-transfer-dom>
            <Loading :show="saveing" text='保存中...'/>
        </div> 
        

    <!-- 共享公司地址列表 -->
    <div v-transfer-dom>
      <popup v-model="showShareList" :popup-style="{zIndex: 750}" height="100%" width="100%" position="right" class="shareAddressListPop" :show-mask="false">
        <shareAddressList 
          v-if="showShareList"
          ref='shareListComp' 
          v-model="shareAddressObj"
          @closeShareList="showShareList=false"
        />
      </popup>
    </div>


</div>
</template>
<script>
import icon from "components/icon/index.vue";
import addressHandler from './addressHandler.js';
import snLoading from "components/loading/index";
import EmptyX from "components/empty/EmptyX.vue";
import snSwitch from "components/switch"
import shareAddressList from './shareAddressList'
import addressComp from './addressComp'; //三级联动的组件
import Bus from './bus/bus.js';
//编辑时脱敏字段输入框获取焦点次数
import {
    TransferDom,
    Popup,
    Swipeout,
    SwipeoutItem,
    SwipeoutButton,
    Loading
} from 'vux';
import SnText from 'components/text/TextX'
const MASKING_TYPE = SnUtils.DataMasking.MASKING_TYPE;
const maskingText = SnUtils.DataMasking.maskingText;
const ISDECORATE = SnTravel.functional.ISDECORATE;//是否脱敏
let flagNum = {
    phone:1
}
let titleType = 'add'
export default {
    name:'swp-address',
    directives: {
        TransferDom
    },
    props: {
        showCheck: {
            type: Boolean,
            default: true
        },
        value: {
            type: Object,
            default(){
                return {}
            }
        },
        nameTitle:{
            type: String,
            default: '收件人'
        },
        firstToDefault:{//无默认地址时是否将第一个当做默认
            type: Boolean,
            default: false
        },
        perAddAddressInfo:{//新增地址时的地址信息
            type: Object,
            default(){
                return {}
            }
        },
        usedPerAddInfo:{//新增地址时是否使用默认的地址信息
            type: Boolean,
            default: false
        }
    },
    components: {
        Swipeout,
        SwipeoutItem,
        SwipeoutButton,
        Popup,
        snLoading,
        EmptyX,
        Loading,
        icon,
        snSwitch,
        shareAddressList,
        addressComp,
        SnText
    },
    data: function () {
        let that = this;
        let baseTitle = document.title
        let managerData = addressHandler.stateManager.setData([
            {
                name: 'showAddAddress',
                parent: '$refs.addressCard',
                type:'page',
                show: {
                    callback: function () {
                        if (titleType === 'add') {
                            document.title = '新增配送地址'
                            that.addAddressContent = {
                                name: '',
                                phone: '',
                                area: '',
                                areaCode: '',
                                address: '',
                                tags:'',
                                defaultFlag: false
                            }
                            //无地址信息需要新增时，如业务侧传递了预新增信息，则使用业务侧传递的
                            try {
                                if (that.usedPerAddInfo && 0==that.addressList.length){
                                    if (!!that.perAddAddressInfo.name && '' !=that.perAddAddressInfo.name){
                                        that.$set(that.addAddressContent,'name',that.perAddAddressInfo.name)
                                    }
                                    if (!!that.perAddAddressInfo.phone && '' !=that.perAddAddressInfo.phone){
                                        that.$set(that.addAddressContent,'phone',that.perAddAddressInfo.phone)
                                    }
                                }
                            } catch (error) {
                            }
                        } else {
                            document.title = '地址编辑'
                        }
                    }
                },
                hide: {
                    callback: function () {
                        flagNum["phone"] = 1//编辑弹窗隐藏时重置点击次数
                    },
                    title: '配送地址'
                }
            },
            {
                name: 'chooseAreaShow',
                parent: '$refs.addressCard',
                hide:{
                    callback: function () {
                        that.showMask = false;//关闭mask遮罩层
                    }
                }
            },

            {
                name:'showShareList', //控制显示共享地址列表弹窗的变量
                parent: '$refs.addressCard',
                show:{
                    callback(){
                        baseTitle = document.title
                        document.title = '公司共享地址';
                    }
                },
                hide: {
                    callback(){
                        document.title = baseTitle;
                    }
                }
            }

        ]);
        let data = {
            loading: true, //页面进入时加载效果
            isPC: addressHandler.isPC(),
            addressDetail: {},
            addAddressContent: {
                name: '',
                phone: '',
                area: '',
                areaCode:'',
                address: '',
                tags:'',
                defaultFlag: false
            },
            mphone:'',//脱敏字段
            addressList: [],
            addressMaskInsList:[],
            saveing:false,//保存中
            addCompanyShareList: false, //是否共享地址的开关
            shareAddressObj:{}, //共享地址的三级联动和详细地址
            openedIndex:-1 //记录每条swipeout的状态 1打开 -1关闭
        }
        data = Object.assign(managerData, data)
        return data
    },
    beforeRouteLeave(to, from, next) {
        const that = this;
        if (that.chooseAreaShow) {
            that.chooseAreaShow = false;
        } else {
            next();
        }
    },
    created: function () {

    },
    mounted: function () {
        let that = this;
        that.getAddressList(); //实现第一次拉数据时提交默认选项
    },
    watch: {
        showAddAddress: function (newVal) {
            let that = this;
            if (!newVal) {
                document.title = '配送地址';
                that.clearObj(that.addAddressContent);
            }
        },
        shareAddressObj(val){
            this.$set(this.addAddressContent, 'area', val.area);
            this.$set(this.addAddressContent, 'areaCode', val.areaCode);
            this.$set(this.addAddressContent, 'address', val.address);
        }
    },
    methods: {
        //处理s实现一个swiperout打开其他的会关闭
        /*
      @chooseIndex被操作的swipe
      */
        handleSwipeoutOpen(chooseIndex) {
            const that = this;
            that.openedIndex = chooseIndex
            if (chooseIndex > -1) {
                that.addressList.forEach((val, index) => {
                    if (index != chooseIndex && that.$refs['swipeoutItem' + index][0].isOpen == true) {
                        that.$refs['swipeoutItem' + index][0].close();
                    }
                })
            }
        },

      
        checkChoose(item){
            return item.id == this.value.id;
        },

        /**
       * 接受三级联动返回的数据
       */
        selectAddress(addressIdList, addressNameList){
            if (addressNameList.length > 0 && addressIdList.length > 0){
                this.addAddressContent.area = addressNameList.join('/');
                this.addAddressContent.areaCode = addressIdList.join('/');
                this.closePopFun(); //关闭三级联动的弹窗
            } else {
                console.log('地址三级联动选择有误！')
            }
        },

        /**
       * 显示三级联动的弹窗
       */
        chooseAreaShowFun(code){
            Bus.$emit('AUTO_SELECT_CITYS', code);
            this.chooseAreaShow = true;
            this.showMask = true;
        },

        /**
       * 关闭三级联动的弹窗
       */
        closePopFun(){
            this.chooseAreaShow = false;
        },

        //阻止冒泡导致滑动出发点击
        stopProp(event) {
            event.stopPropagation();
            event.preventDefault();
        },


        showReceipt() {
            const that = this;
            titleType = 'add';
            that.showAddAddress = true;
            document.title = '新增配送地址';
        },

        clearObj(obj) {
            for (let item in obj) {
                obj[item] = ''
            }
            this.addAddressContent.defaultFlag = false;
            return obj;
        },
        //获取焦点时清空数据
        setObj(obj,key){
            if (flagNum[key] == 1||obj[key].indexOf("*")!=-1){
                obj[key] = ""
            }
            flagNum[key] ++;
        },


        editItem(index, type) {
            const that = this;
            that.addAddressContent = JSON.parse(JSON.stringify(that.addressList[index]));
            that.mphone = that.addAddressContent.phone;
            if (ISDECORATE){
                that.addAddressContent['phone'] = maskingText(MASKING_TYPE.TEL,that.addAddressContent['phone']) ;//对需要脱敏字段进行脱敏
            }
        
            if (type == 'address') {
                titleType = 'edit'
                that.showAddAddress = true;
                document.title = '地址编辑';
            } else {
                that.addAddressContent.defaultFlag = true;
                that.saveAddress();
            }
        },


        deleteAddress(index) {
            let that = this;
            addressHandler.showConfirm( '确定要删除该地址吗？', function(){
                let operateId = that.addressList[index].id;
                let data = {id: operateId};

                let param = {
                    ids: [operateId]
                };

                addressHandler.deleteDeliveryAddress(param).then((res) => {
                    if (res.resultCode == '0') {
                        addressHandler.showToast('删除成功');
                        that.showAddAddress = false;
                        that.getAddressList();
                        that.$emit('update', {type: 'delete', value: data})
                    }
                }).catch((err) => {
                    console.log(err);
                    addressHandler.showToast('删除失败');
                });
            }, 2, '取消', '确定', null, null, true);
        },


        getAddressList() {
            const that = this;
            that.loading = true;
            let param = {}
            addressHandler.getDeliveryAddress(param).then((res) => {
                if (res.resultCode == '0' && res.result.list) {
                    //修改为传参firstToDefault为true时如无默认地址则将第一个地址当做默认地址
                    let defaultAddress = {};
                    let haveDefault = false;
                    that.addressList = res.result.list
                    that.addressMaskInsList = that.addressList.map((item) => {
                        let json = JSON.parse(JSON.stringify(item));
                        if (ISDECORATE){
                            json.phone = maskingText(MASKING_TYPE.TEL,json.phone);
                        }
                        if (json.defaultFlag) {
                            defaultAddress = item;
                            haveDefault = true;
                        }
                        return json;
                    })
                    if (haveDefault){
                        that.$emit('input', defaultAddress); 
                    } else if (!!this.firstToDefault && 0 < that.addressList.length){
                        that.$emit('input', that.addressList[0]); 
                    }

                    that.loading = false;
                    that.showAddAddress = false; //等待列表更新了再关闭编辑窗
                }
            }).catch((err) => {
                console.log(err);
            });
        },

        chooseItem(item,index) {
            if (!this.showCheck){ return }
            this.$emit('input', this.addressList[index]);
            this.$emit('closeAddressList');
        },

        //校验相关必填字段
        checkParam(content){
            let check = true;
            if (!(!!content.area.trim() && !!content.phone.trim() && !!content.name.trim() && !!content.address.trim())) {
                addressHandler.showToast('请先填写完整相关信息');
                check = false;
            }
            //验证手机号
            if (flagNum["phone"] == 1||content.phone.indexOf("*")!=-1){
                content.phone = this.mphone
            }
            if (!addressHandler.isMobile(content.phone.trim())) {
                addressHandler.showToast('手机号码格式错误');
                check = false;
            }
            return check;
        },


        //保存地址的回调
        saveAddress() {
            const that = this;
            if (that.saveing){ return }
            const content = JSON.parse(JSON.stringify(that.addAddressContent));
            if (this.checkParam(content)) {
                let param = {
                    'name': content.name.trim(),
                    'phone': content.phone.trim(),
                    'area': content.area.trim(),
                    'areaCode': content.areaCode.trim(),
                    'tags': content.tags.trim(),
                    'address': content.address.trim(),
                    'defaultFlag': content.defaultFlag,
                    'share': this.addCompanyShareList //是否分享到共享池 true-分享 false-不分享
                }
                let flag = !!content.id; //true=编辑，false=新增
                let apiType = !!flag ? 'modifyDeliveryAddress' : 'addDeliveryAddress';
                if (!!flag){
                    param = Object.assign({}, param, {id: content.id});
                }
 
                that.saveing = true;
                addressHandler[apiType](param).then((res) => {
                    that.saveing = false;
                    if (res.resultCode == '0') {
                        addressHandler.showToast('保存成功');
                        that.getAddressList();
                    } else {
                        addressHandler.showToast('保存失败');
                    }
                }).catch((err) => {
                    that.saveing = false;
                    console.log(err);
                });
            } 
        }
    }
}

</script>
<style lang="less" scoped>
@import '~themes/default/styles/addressCard.less';
</style>
