<template>
  <div id="commonAddrbox">
    <div id="commonAddrbg"></div>
    <div id="mailCommonAddress">
        <div class="title">
            <div class="imgbtn"><img @click.stop="close" src="~assets//icon_close_simple.png"></div>            
            <div class="utag" @click.stop="toNewAddress">新增邮寄地址</div>
        </div>
        <div class="content">
        <div v-if="!!commonAddressList && commonAddressList.length>0" class="listbox">
            <div v-for="item in commonAddressList" :key="item.no" class="listItem" @click.stop="onItemClick(item)">
                <div class="leftText">
                    <div><span>{{item.name}}</span><span>{{item.phone}}</span></div>
                    <div><span>{{item.area}}</span><span>{{item.address}}</span></div>
                </div>
                <div class="rightIcon"  @click.stop="onEditClick(item)">
                    <span>编辑</span>
                </div>
            </div>
        </div>
        <div v-else class="emptybox">
            <img src="~assets///icon_empty_address.png">
            <div>暂无常用寄件地址</div>
        </div>
        </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["addressList"],
  components: {},
  data() {
    return {};
  },
  computed: {
      /**
       * 页面显示的地址列表
       */
      commonAddressList:function(){
          return JSON.parse(JSON.stringify(this.addressList||[]));
      },
  },
  created() {},
  methods: {
    /**
     * 跳转新建地址
     */
    toNewAddress(){
        this.$emit("setAddress");
    },
    /**
     * 列表点击事件，将数据传出去
     */    
    onItemClick(item){
        this.$emit("onItemClick", item);
    },
     /**
     * 跳转编辑地址
     */   
    onEditClick(item){
        this.$emit("setAddress", item);
    },
    close(){
        this.$emit("closeComonAdress");
    },
  }
};
</script>
<style lang="less">
@import "~styles/common.less";
@import "~styles/variables.less";
@import "~styles/mixins/mixins.less";
#commonAddrbox {
  background: transparent;
  z-index: 209;
}
#commonAddrbg {
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

#mailCommonAddress {
    position: fixed;
    padding: 5px;
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
    .title{
        // display: flex;
        // justify-content: space-between;
        .imgbtn{
            display: flex;
        justify-content: flex-end;
        }
            img{
        width: 20px;
    height: 20px;

    }   
          .utag {
    margin-left: 20px;
    text-align: left;
    color: #478aee;
      }
    }
    .content{
        padding: 20px 0px 20px 20px;
        .listbox{
            height: 203px;
            padding-right: 20px;
    overflow-y: scroll;       
            .listItem{
            border: 1px solid #e2e2e2;
            border-radius: 2px;
            background: #e2e2e2;
            color: #333333;
            display: -webkit-box;
            display: -webkit-flex;
            display: flex;
            -webkit-box-pack: justify;
            -webkit-justify-content: space-between;
            justify-content: space-between;
            padding: 10px;
            margin: 5px 0px;
            }
            .leftText{
                    text-align: left;
                    span{
                        margin-right: 20px;                        
                    }
                    >div:first-child{
                        margin-bottom: 5px;
                    }
            }
            .rightIcon{
                flex: 0 0 40px;
                span{
                    color: #478aee;
                }
            }
        }
        .emptybox{
                margin-top: 15%;
        }
    }
}
</style>



