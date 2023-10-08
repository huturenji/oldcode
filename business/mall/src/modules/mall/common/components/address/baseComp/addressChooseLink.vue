

<template>
 <!---------------------------地址管理三级联动选择组件 -------------------------->
<div class="areaDom">
  <div class="mask cursorp" @click='closePop'></div>
  <div class="main">
    <div class="header">
      <div class="cancel icon-btn cursorp" @click='cancel'>取消</div>
      <div>选择城市</div>
      <div class="confirm icon-btn cursorp" @click='confirmChoose'>确定</div>
    </div>
    <div style="display:flex">
      <picker 
        :data='cityAreas' 
        :columns=3 
        v-model='choosenCity' 
        @on-change='areaChange' 
        ref="picker1"
        :fixed-columns=3 
        style="flex:2">
      </picker>

      <picker 
        :data='areas' 
        :columns=1 
        v-model='choosenArea' 
        ref="picker2" 
        :fixed-columns=1 
        style="flex:1">
      </picker>
    </div>
  </div>
</div>
</template>
<script>
  import {
    Picker
  } from 'vux';
  import requestHandler from 'common/lib/requestHandler/addressHandler.js';
  import extendUtils from 'common/lib/utils';
  export default {
    name:'swp-address-chooseLink',
    props: {

      //显示新增和编辑的变量
      chooseAreaShow:{
        type:Boolean,
        type:false
      },
    },
    components: {
      Picker
    },
    data () {
        let that = this;
        let managerData = extendUtils.stateManager.setData([]);
        let data = {
            isPC: extendUtils.isPC(), //pc端还是移动端
            cityAreas: [], //省市数据
            areas: [], //区的数据
            areasData: [], //接收的区原始数据
            choosenArea: [],
            choosenCity: [],            
        }
        data = Object.assign(managerData, data)
        return data;
    },
    
    created: function () {
      //获取省市区联动的数据
      this.getArea();
    },
    mounted: function () {
     

    },
    watch: {
      
    },
    methods: {
      
      /***
       * 获取省市区联动的数据
       */
      getArea() {
        let that = this;
        requestHandler.getProvinceCityCounty({}).then((res) => {
          if (!!res.data) {
            let arr = [];
            res.data.forEach((val, index) => {
              arr.push({
                name: val.name,
                value: val.name,
                parent: 0
              })
              if (!!val.city) {
                //对于直辖市当做省份来处理
                if (val.city.length == 1) {
                  val.city[0].area.map((val2) => {
                    if (val2.name != val.name) {
                      arr.push({
                        name: val2,
                        value: val2,
                        parent: val.name,
                      })
                    };

                  })
                } else {
                  val.city.map((val2) => {
                    if (val2.name != val.name) {
                      arr.push({
                        name: val2.name,
                        value: val2.name,
                        parent: val.name,
                      })
                    };
                    if (!!val2.area) {
                      val2.area.map((val3) => {
                        that.areasData.push({
                          name: val3 + '',
                          value: val3 + '',
                          parent: val2.name,
                        })
                      })
                    }
                  })
                }
              }
            });
            that.cityAreas = arr;
          }
        }).catch((err) => {
          console.log(err);
        });
      },

      /***
       * 点击地址三级联动弹窗取消按钮的回调
       */
      cancel() {
        const that = this;
        that.choosenArea = [];
        that.choosenCity = [];
        that.closePop();
      },

      /***
       * 点击地址的三级联动弹窗确定按钮的回调
       */
      confirmChoose() {
        const that = this;
        let content = '';
        if (that.choosenArea.length > 0) {
          content = '/' + that.choosenArea[0]
        };

        //触发父组件的更新回调
        let addressStr = that.choosenCity.join('/') + content;
        that.$emit('getAddress', addressStr);
        that.closePop();
      },

      /**
       * 区域变化触发的回调 数据整合
       */
      areaChange(val) {
        const that = this;
        let arr = that.areasData.filter(city => {
          return city.parent == val[1];
        })
        that.areas = arr.map(val => {
          return {
            name: val.name,
            value: val.value
          }
        })
        if (that.areas.length == 0) {
          that.choosenArea = [];
        }
      },

       /**
       * 关闭三级联动的弹窗
       */
      closePop(){
        this.$emit('close');
      }
    }
  }

</script>
<style scoped lang="less">
@import '~themes/default/styles/common/variable.less';
@import '~mallStyles/mixins/mixinsStyle.less';
.areaDom {
  display: flex;
  height: 100%;
  flex-direction: column;
  background: rgba(0, 0, 0, 0.2);
  .mask {
    background: rgba(0, 0, 0, 0.2);
    width: 100%;
    flex: 1;
  }

  .main {
    padding: .3rem;
    background: #fff;
  }

  .vux-picker {
    background: #fff;
  }

  .main {
    .header {
      display: flex;
      justify-content: space-around;
      .cancel {
        color: @theme-color;
        text-align: left;
      }
      .confirm {
        color: @theme-color;
        text-align: right;
      }
      
    }
    .scroller-content {
      z-index: 1 !important
    }
  }
}

</style>
