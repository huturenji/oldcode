<template>
  <div id="mailSetAddrBox">
    <div id="mailSetAddrbg"></div>
    <div id="mailSetAddress">
        <div class="title">
        <div class="closeBtnRT" @click.stop="close"></div>
        <div>{{title}}</div>
        </div>
        <div class="inputview">
        <addressInputView ref="addrcomp" :addressType="1" :addressData="addressData" :proviceCityCounty="proviceCityCounty"
        :showComp="showComp"></addressInputView>
        </div>
        <div class="bottombtn">
        <span class="btn" @click.stop="saveAddress()">保存并使用该地址</span>
        </div>
    </div>
  </div>
</template>

<script>
import addressInputView from "biscomponents/mail/addressinput/addressinput.vue";
import tmHandler from 'bislibs/requesthandler/traveloperationhandler.js';
export default {
  props: ["address","proviceCityCounty","showComp"],
  components: {
    addressInputView
  },
  data() {
    return {
        addressData:{},
    };
  },
  computed: {
    title: function() {
        // console.log("setAddr.this.address=" + this.address);
        if (this.isNoEmptyAddress(this.address)) {
            this.addressData = JSON.parse(JSON.stringify(this.address));
            return "编辑";
        } else {
            return "新增寄件地址";
        }
    }
  },
  watch:{
    /**
     * 监听地址数据的更新
     */
    address: function(val, oldVal) {
        // console.log("setAddr.watch.address=" + val);
        let that = this;
        if (val != oldVal) {
            that.addressData = !!val ? JSON.parse(JSON.stringify(val)) : {};
        }
    },
  },
  created() {
    //    console.log("setAddr.created.address=" + this.address);
  },
  methods: {
    /**
     * 判断是新增还是编辑
     */
    isNoEmptyAddress(value){
        return !!value && JSON.stringify(value)!="{}";
    },
    /**
     * 输入结果传出来
     */
    exportAddressData(data) {
      this.$emit("getInputAddr", data);
      this.close();
    },
    /**
     * 同步方法，获取地址输入信息
     */
    getAddressData() {
      return this.$refs.addrcomp.getInputVaule();
    },
    /**
     * 关闭当前页面
     */
    close() {
      this.$emit("closeSetAddress");
    },
    /**
     * 提交地址信息
     */
    saveAddress() {
        let _this = this;
        //参数校验
        let data = _this.getAddressData();
        if (!data) {
            console.log("saveAddress.input check error");
            return;
        }
        if (_this.isNoEmptyAddress(_this.address)) {
            //编辑地址
            _this.updateAddress(data);
        } else {
            //新增地址
            _this.addAddress(data);
        }
    },
    /**
     * 编辑地址
     */
    updateAddress(data) {
      let _this = this;
      let request = {
          name: data.name,
          phone: data.phone,
          area: _this.getArrayToArea(data.areaArray),
          address: data.address,
          sendInfoNo: _this.address.sendInfoNo,
          addressId: _this.address.addressId,
          userId: tmHandler.userInfo && tmHandler.userInfo.userId
      };
    tmHandler.modifySenderInfo(request)
      .then(
        function(res) {
          if (0 == res.resultCode) {
            // utils.showToast("保存成功");
            _this.exportAddressData(request);
          } else {
            console.info(res);
            utils.showToast("保存失败");
          }
        },
        function(error) {
          console.info(error);
        }
      );
    },
    /**
     * 新增地址
     */
    addAddress(data) {
      let _this = this;
      let request = {
          name: data.name,
          phone: data.phone,
          area: _this.getArrayToArea(data.areaArray),
          address: data.address,
          userId: tmHandler.userInfo && tmHandler.userInfo.userId
      };
      tmHandler.addSenderInfo(request)
      .then(
        function(res) {
          if (0 == res.resultCode) {
            // utils.showToast("保存成功");
            _this.exportAddressData(request);
          } else {
            console.info(res);
            utils.showToast("保存失败");
          }
        },
        function(error) {
          console.info(error);
        }
      );
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
#mailSetAddrBox {
  background: transparent;
  z-index: 209;
}
#mailSetAddrbg {
  position: fixed;
  left: 0px;
  top: 0px;
  bottom: 0px;
  background-color: #ffffff;
  width: 100%;
  /*宽度设置为100%，这样才能使隐藏背景层覆盖原页面*/
  height: 100%;
  filter: alpha(opacity=60);
  /*设置透明度为60%*/
  opacity: 0.6;
  /*非IE浏览器下设置透明度为60%*/
  z-index: 210;
}

#mailSetAddress {
    position: fixed;
    _position: absolute;
    margin: 0;
    width: -webkit-fit-content;
    width: 400px;
    height: -webkit-fit-content;
    height: 300px;
    top: 30%;
    // overflow-y: scroll;
    left: 42%;
    background-color: #fff;
    cursor: pointer;
    z-index: 211;
    text-align: center;
    border: 1px solid #e2e2e2;
  .title {
    font-size: 14px;
    font-weight: bold;
    margin-bottom: 20px;
    .closeBtnRT {
      background: url(~assets//icon_close_simple.png) no-repeat right
        #fff;
      height: 20px;
      margin: 10px 10px 0 0;
      background-size: contain;
    }
  }
  .inputview{
      padding: 0px 25px;
  }
  .bottombtn {
    margin: 20px 0px;
    .btn {
      background: #47a8ee;
      color: white;
      margin: 0px auto;
      padding: 5px 15px;
    }
  }
}
</style>




