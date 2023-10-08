<template>
  <div class="inputComp">
    <div class="row">
      <div class="left required">{{addressTypeDefaul.nameDefault}}</div>
      <div class="right">
        <input
          v-if="inputable"
          type="text"
          :placeholder="addressTypeDefaul.namePlaceholder"
          v-model.trim="formDataValue.address.name" 
          maxLength="20"
        >
        <input
          v-else
          type="text"
          :placeholder="addressTypeDefaul.namePlaceholder"
          maxLength="20"
          v-model.trim="formDataValue.address.name" readonly="readonly"
        >        
        <div
          class="error-msg"
          v-if="formDataValue.validateMsg.contactNameErrorMsg"
        >{{formDataValue.validateMsg.contactNameErrorMsg}}</div>
      </div>
    </div>

    <div class="row">
      <div class="left required">{{addressTypeDefaul.phoneDefault}}</div>
      <div class="right">
        <input
          v-if="inputable"
          type="tel"
          :placeholder="addressTypeDefaul.phonePlaceholder"
          maxLength="20"
          v-model.trim="formDataValue.address.phone"
        >
        <input
          v-else
          type="tel"
          :placeholder="addressTypeDefaul.phonePlaceholder"
          maxLength="20"
          v-model.trim="formDataValue.address.phone" readonly="readonly"
        >        
        <div
          class="error-msg"
          v-if="formDataValue.validateMsg.contactPhoneErrorMsg"
        >{{formDataValue.validateMsg.contactPhoneErrorMsg}}</div>
      </div>
    </div>
    <div class="row" v-if="showComp">
      <div class="left required">{{addressTypeDefaul.simpleAddrDefault}}</div>
      <div class="right">
        <Cascader
          :data="selectAddressData"
          v-model="formDataValue.address.areaArray"
          :placeholder="addressTypeDefaul.simpleAddrPlaceholder"
          :render-format="formatResult"
          :load-data="loadData"
          v-if="inputable"
        ></Cascader>
        <Cascader
          :data="selectAddressData"
          v-model="formDataValue.address.areaArray"
          :placeholder="addressTypeDefaul.simpleAddrPlaceholder"
          :render-format="formatResult" 
          :load-data="loadData"
          disabled
          v-else=""
        ></Cascader>        
        <div
          class="error-msg"
          v-if="formDataValue.validateMsg.simpleAddrErrorMsg"
        >{{formDataValue.validateMsg.simpleAddrErrorMsg}}</div>
      </div>
    </div>
    <div class="row">
      <div class="left required">{{addressTypeDefaul.detailAddrDefault}}</div>
      <div class="right">
        <input
          v-if="inputable"
          type="text"
          :placeholder="addressTypeDefaul.detailAddrPlaceholder"
          v-model.trim="formDataValue.address.address"
          maxLength="50"
        >
        <input
          v-else
          type="tel"
          :placeholder="addressTypeDefaul.detailAddrPlaceholder"
          maxLength="50"
          v-model.trim="formDataValue.address.address" readonly="readonly"
        >          
        <div
          class="error-msg"
          v-if="formDataValue.validateMsg.detailAddrErrorMsg"
        >{{formDataValue.validateMsg.detailAddrErrorMsg}}</div>
      </div>
    </div>
  </div>
</template>

<script>
import utils from "bislibs/utils";
export default {
  props: {
    //填充的地址信息
    addressData: {
        type: Object,
        required: false,
    },
    //组件的类型信息：寄件人还是收件人
    addressType: {
        type: Number,
        required: false,
        default:1,
    },      
    //组件是否可输入的
    inputable: {
        type: Boolean,
        required: false,
        default:true,
    },
    //省市区信息
    proviceCityCounty: {
        type: Array,
        required: false,
    },   
    //是否显示组件 
    showComp:{
        type: Boolean,
        required: false,
        default:false,        
    },
  },
  components: {
    // Cascader
  },
  data() {
    return {
      formDataValue: {
        address: {
          //表单输入的地址
          name: "",
          phone: "",
          area: "",
          areaArray: "",
          address: ""
        },
        validateMsg: {}
      },
      addressTypeDefaultArr: [
        {
          addressType: 1, //1是寄件人，2是收件人提示语
          nameDefault: "寄件人：",
          namePlaceholder: "请填写寄件人姓名",
          phoneDefault: "联系电话：",
          phonePlaceholder: "请填写寄件人联系电话",
          simpleAddrDefault: "省市区：",
          simpleAddrPlaceholder: "请选择所在地区，例如广东省 深圳市 福田区",
          detailAddrDefault: "详细地址：",
          detailAddrPlaceholder: "请填写所在街道及详细地址"
        },
        {
          addressType: 2, //1是寄件人，2是收件人提示语
          nameDefault: "收件人：",
          namePlaceholder: "请填写收件人姓名",
          phoneDefault: "联系电话：",
          phonePlaceholder: "请填写收件人联系电话",
          simpleAddrDefault: "省市区：",
          simpleAddrPlaceholder: "请选择所在地区，例如广东省 深圳市 福田区",
          detailAddrDefault: "详细地址：",
          detailAddrPlaceholder: "请填写所在街道及详细地址"
        }
      ],
    };
  },
  watch: {
    /**
     * 监听simpleAddrArray用户输入，动态更新simpleAddr
     */
    "formDataValue.address.areaArray": function(val, oldVal) {
      let that = this;
      that.formDataValue.address.area = that.getArrayToArea(val);
    },
    /**
     * 监听prop动态更新，刷新当前页面数据
     */
    addressData: function(val, oldVal) {
      let that = this;
      if (val != oldVal && !!val) {
        that.formDataValue.address = JSON.parse(JSON.stringify(val));
      }
    },
    proviceCityCounty: function(val, oldVal) {
      let that = this;
      if (val != oldVal && !!val) {
        that.selectAddressData = that.getSelectAddressDataSync();
      }
    },
  },
  computed: {
    addressTypeDefaul: function() {
      let result;
      for (let i = 0; i < this.addressTypeDefaultArr.length; i++) {
        if (this.addressType == this.addressTypeDefaultArr[i].addressType) {
          result = this.addressTypeDefaultArr[i];
          break;
        }
      }
      return result || this.addressTypeDefaultArr[0];
    },
    /**
     * 获取省市区数据
     */
    selectAddressData:function() {
       return this.getSelectAddressDataSync();
    },
  },
  created() {
    const that = this;
    //编辑会有参数带进来
    if (!!that.addressData) {
      let address = JSON.parse(JSON.stringify(that.addressData));
      that.formDataValue.address.name = address.name;
      that.formDataValue.address.phone = address.phone;
      that.formDataValue.address.areaArray = address.areaArray;
      that.formDataValue.address.address = address.address;
    }
  },
  methods: {
      
      /**
       * 解析省市区数据
       */
      getSelectAddressData(){
        let result=!!utils.getStorage("proviceCityCountyList") ? JSON.parse(utils.getStorage("proviceCityCountyList")) : [];
        if(!!result && result.length>0){
            return result;
        }
        let proviceCityCountyList = !!utils.getStorage("proviceCityCounty") ? JSON.parse(utils.getStorage("proviceCityCounty")) : []
        if(!!proviceCityCountyList && proviceCityCountyList.length > 0){
            for(let i=0;i<proviceCityCountyList.length;i++){
                let provice = {};
                let proi = proviceCityCountyList[i];
                provice.label = proi.name;
                provice.value = proi.name;
                provice.children = [];
                for(let j=0;j<proi.city.length;j++){
                let city={};
                let CityI = proi.city[j];
                city.label = CityI.name;
                city.value = CityI.name;  
                city.children = [];
                for(let k=0;k<CityI.area.length;k++){
                    let qu = {}
                    let county = CityI.area[k];
                    qu.label = county;
                    qu.value = county; 
                    
                    city.children.push(qu);
                }            
                provice.children.push(city);
                }            
                result.push(provice);
            }
           
            //直辖市，将三级降为两级
            for(let i=0;i<result.length;i++){
                if(this.isProviceCitySame(result[i].value)){                   
                    let tChild = JSON.parse(JSON.stringify(result[i].children[0].children));
                    result[i].children = '';
                    result[i].children = tChild;
                }
            }
            utils.setStorage("proviceCityCountyList",JSON.stringify(result));
        }
        return result;
      },
      /**
       * 异步加载数据，默认数据只有省级数据，余下的异步加载loadData
       */
      getSelectAddressDataSync(){
        let result=[]
        let defaultArea = this.formDataValue.address.areaArray;
        let proviceCityCountyList = !!utils.getStorage("proviceCityCounty") ? JSON.parse(utils.getStorage("proviceCityCounty")) : []
        if(!!proviceCityCountyList && proviceCityCountyList.length > 0){
            for(let i=0;i<proviceCityCountyList.length;i++){
                let provice = {};
                let proi = proviceCityCountyList[i];
                provice.label = proi.name;
                provice.value = proi.name;
                provice.loading = false;
                provice.children = [];
                //如果有默认值传入的话，我们需要将默认值对应的数据都加载出来。
                if(!!defaultArea && defaultArea[0]==proi.name){
                    if(this.isProviceCitySame(proi.name) && !!proi.city && proi.city.length > 0){
                        let itemChild = proi.city[0].area;
                        if(!!itemChild){
                            //默认的第三级行政区数据是否存在于我们的省市区数据源里面
                            let defaultAreaIsExsit = false;
                            for(let j=0;j<itemChild.length;j++){
                                let qu={};
                                qu.label = itemChild[j];
                                qu.value = itemChild[j];  
                                provice.children.push(qu)
                                if(defaultArea[1] == itemChild[j]){
                                    defaultAreaIsExsit = true;
                                }
                            }
                            //如果数据不在数据源里面，默认加上去，这样UI才能显示出来。
                            if(!defaultAreaIsExsit){
                                let qu={};
                                qu.label = defaultArea[1];
                                qu.value = defaultArea[1];  
                                provice.children.push(qu)
                            }
                        }
                    }else{
                        let itemChild = proi.city;
                        if(!!itemChild){
                            for(let k=0;k<itemChild.length;k++){   
                               let child={};
                               child.label = itemChild[k].name;
                               child.value = itemChild[k].name;  
                               child.loading = false;
                               child.children = [];
                               //将默认值的市区对应的第三级数据加载出来。
                               if(!!defaultArea && defaultArea[1]==itemChild[k].name){
                                    //默认的第三级行政区数据是否存在于我们的省市区数据源里面
                                    let defaultAreaIsExsit = false;                                   
                                   for(let j=0;j<itemChild[k].area.length;j++){
                                       let qu={};
                                       qu.label = itemChild[k].area[j];
                                       qu.value = itemChild[k].area[j];  
                                       child.children.push(qu);
                                        if(defaultArea[2] == itemChild[k].area[j]){
                                            defaultAreaIsExsit = true;
                                        }                                       
                                   }
                                    //如果数据不在数据源里面，默认加上去，这样UI才能显示出来。
                                    if(!defaultAreaIsExsit){
                                        let qu={};
                                        qu.label = defaultArea[2];
                                        qu.value = defaultArea[2];  
                                        child.children.push(qu)
                                    }                                   
                               }
                               provice.children.push(child)
                            }                  
                        }
                    }
                }

                result.push(provice);
            }
        }
        return result;
      },
      /**
       * 异步加载数据
       */
      loadData(item, callback){
        const that = this;
        item.loading = true;
        setTimeout(() => {
            let proviceCityCountyList = !!utils.getStorage("proviceCityCounty") ? JSON.parse(utils.getStorage("proviceCityCounty")) : []
            if(!!proviceCityCountyList && proviceCityCountyList.length > 0){
                item.children =[]
                let itemChild = [];
                for(let i=0;i<proviceCityCountyList.length;i++){
                    //地级市全国范围内是不重名的，所以直接使用name判断即可。
                    if(proviceCityCountyList[i].name==item.value && !that.isProviceCitySame(item.value)){
                        itemChild = proviceCityCountyList[i].city;
                        if(!!itemChild){
                            for(let k=0;k<itemChild.length;k++){   
                              let child={};
                              child.label = itemChild[k].name;
                              child.value = itemChild[k].name;  
                              child.loading = false;
                              child.children = [];
  
                              item.children.push(child)
                            }
                        }
                        break;
                    }else{      
                        //有的数据没有city，比如香港
                        if(!!proviceCityCountyList[i].city){
                            for(let j=0;j<proviceCityCountyList[i].city.length;j++){
                                //地级市全国范围内是不重名的，所以直接使用name判断即可。
                                if(proviceCityCountyList[i].city[j].name==item.value){
                                    itemChild = proviceCityCountyList[i].city[j].area;
                                      for(let k=0;k<itemChild.length;k++){   
                                        let child={};
                                        child.label = itemChild[k];
                                        child.value = itemChild[k];  
                                                                          
                                        item.children.push(child)
                                    }                        
                                    break;
                                }
                            }
                        }
                    }
                }  
            }       
            item.loading = false;
            callback();
        }, 500);          
      },
      /**
       * 省市同名，就是直辖市
       */
      isProviceCitySame(name){
          return name=="北京市"||name=="天津市"||name=="上海市"||name=="重庆市"||name=="澳门特别行政区"||name=="香港特别行政区";
      },
    /**
     * 输入结果传出来
     */
    getInputVaule() {
      if (this.checkInput()) {
        return this.formDataValue.address;
      } else {
        return null;
      }
    },
    /**
     * 省市区的选择结果显示内容和方式
     */
    formatResult(labels, selectedData) {
      let result = "";
      for (let i = 0; i < labels.length; i++) {
        result += labels[i] + " ";
      }
      return result;
    },
    /**
     * 清空校验错误提示
     */
    clearCheckError() {
      const that = this;
      //清空上一次的校验
      that.formDataValue.validateMsg = {};
    },
    /**
     * 清空所有的输入
     */
    clearInputData() {
      const that = this;
      that.formDataValue.address.name = "";
      that.formDataValue.address.phone = "";
      that.formDataValue.address.area = "";
      that.formDataValue.address.areaArray = "";
      that.formDataValue.address.address = "";
      that.clearCheckError();
    },    
    /**
     * 校验输入项，没有的话，给出提示语
     */
    checkInput() {
      const that = this;
      let result = true;
      //清空上一次的校验
      that.formDataValue.validateMsg = {};
      if(that.addressType==1){
      //名字的校验
        if (!this.formDataValue.address.name) {
        that.$set(
          that.formDataValue.validateMsg,
          "contactNameErrorMsg",
          this.addressTypeDefaul.namePlaceholder
        );
        result = false;
      }
      else if(this.formDataValue.address.name.indexOf(" ")!=-1){
        that.$set(
          that.formDataValue.validateMsg,
          "contactNameErrorMsg",
          "用户名不能包含空格"
        );
        return false;
      }
      //电话的校验
      if (!this.formDataValue.address.phone) {
        that.$set(
          that.formDataValue.validateMsg,
          "contactPhoneErrorMsg",
          this.addressTypeDefaul.phonePlaceholder
        );
        result = false;
      }
      else if(this.formDataValue.address.phone.indexOf(" ")!=-1){
        that.$set(
          that.formDataValue.validateMsg,
          "contactPhoneErrorMsg",
          "手机号不能包含空格"
        );
        return false;
      }
      //省市区的校验
      if (!this.formDataValue.address.area) {
        that.$set(
          that.formDataValue.validateMsg,
          "simpleAddrErrorMsg",
          this.addressTypeDefaul.simpleAddrPlaceholder
        );
        result = false;
      }
      //详细地址的校验
      if (!this.formDataValue.address.address) {
        that.$set(
          that.formDataValue.validateMsg,
          "detailAddrErrorMsg",
          this.addressTypeDefaul.detailAddrPlaceholder
        );
        result = false;
      }
      else if(this.formDataValue.address.address.length<4){
        that.$set(
          that.formDataValue.validateMsg,
          "detailAddrErrorMsg",
          "请输入至少四个汉字"
        );
        result = false;
      }
      }
      
      return result;
    },
    /**
    *将数组省市区拼装成 字符串
    */
    getArrayToArea(source) {
        let result = "";
        if(!!source){
            for (let i = 0; i < source.length; i++) {
                result += source[i];
                if(i != source.length-1){
                    result+="/";
                }
            }
        }
        return result;
    }    
  }
};
</script>
<style lang="less">
@import "~styles/common.less";
@import "~styles/variables.less";
@import "~styles/mixins/mixins.less";

.inputComp {
  .row {
    // margin-bottom: 10px;
    font-size: 12px;
    color: #333;
    display: flex;
    // border-bottom: 1px dashed @border;

    .info-label {
      color: @label-color;
    }

    .required:before {
      content: "*";
      color: #f83939;
      font-size: 12px;
      margin-right: 2px;
    }

    .error-msg {
      color: @font-red-color;
      padding-left: 10px;
      //   margin-top: 6px;
      font-size: 12px;
      line-height: initial;
    }

    .left {
      flex: 0 0 70px;
      height: 32px;
      line-height: 32px;
      text-align: right;
      /* padding-right: 10px; */
    }

    .right {
      @width: 480px;
      height: fit-content;
      line-height: 32px;
      float: left;
      text-align: left;
      width: 100%;
      .protocol {
        width: @width;
      }

      .check-icon {
        display: inline-block;
        height: 16px;
        line-height: 16px;
        margin: 8px 0;
        text-indent: 26px;
        text-align: left;
        cursor: pointer;

        &.uncheck {
          background: url(~assets//icon_uncheck.png)
            0 center no-repeat transparent;
        }

        &.check {
          background: url(~assets//icon_check.png)
            0 center no-repeat transparent;
        }

        &:first-of-type {
          margin-left: 12px;
        }
      }

      .pay-type-container {
        .flex-box;
        .justify-content(space-between);
      }

      input {
        border: 1px solid @border;
        border-radius: 2px;
        height: 24px;
        line-height: 24px;
        padding-left: 10px;
        // font-size: 14px;
        color: #333;
        /* 使用webkit内核的浏览器 */
        &::-webkit-input-placeholder {
          font-size: 12px;
          color: #999;
        }
        /* Firefox版本4-18 */
        &:-moz-placeholder {
          font-size: 12px;
        }
        /* Firefox版本19+ */
        &::-moz-placeholder {
          font-size: 12px;
          color: #999;
        }
        /* IE浏览器 */
        &:-ms-input-placeholder {
          font-size: 12px;
          color: #999;
        }
      }
    }
  }
}
</style>




