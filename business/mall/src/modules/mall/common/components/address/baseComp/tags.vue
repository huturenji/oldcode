<template>
<!---------------------------地址管理的标签模块需要抽成组件 -------------------------->
<div class="tag-container">
  <!-- 标签模块 -->
  <div class="address-tags"> 
    <div class="tags-title">标签</div>
    <div class="tags-details">
      <!-- 公司，家，学校固定的标签 -->
      <ul>
        <li @click="chooseTagFun(item)" v-for="(item, index) in tagDefaultList" :key="index" :class="{active: item.code==choosedTag.code}" class="li-item">{{item.name}}</li>
      </ul>
      <!-- 自定义的标签模块只能编辑 -->
      <div v-if="showCustomTag">
        <div @click="chooseTagFun(tagCustomObj)" class="custom-tag-wrapper" :class="{active: tagCustomObj.code == choosedTag.code}">
          <input class="custom-input" disabled type="text" v-model="tagCustomObj.name">
          <div @click.stop="editCustomFun(tagCustomObj)" class="btn">编辑</div>
        </div>
      </div>
      <!-- 新增的标签编辑模块 -->
      <div v-if="showEditTag" class="edit-tag-box">
        <input ref="tagInput" @input="tagInputFun" @focus="tagInputFun" v-model.trim="editTagValue" class="input-tag" type="text" placeholder="请输入标签名称，最多5个字">
        <div @click.stop="confrimTagFun" class="confirm-tag-btn" :class="{'linear-gra-mall-btn': !disableConfirmTag}">确定</div>
      </div>

      <!-- 新增标签按钮 -->
      <div v-if="showAddTag" @click="addTag" class="li-item add">
        <Icon type="icon_mall_add" size=".4"/>
      </div>

    </div>
  </div>
</div>
</template>
<script>
  import extendUtils from 'common/lib/utils';
  import Icon from 'common/components/base/Icon';
  export default {
    name:'swp-address-tag',
    props: {
      //新增的地址对象
      tagObj:{
        type:Object,
        default(){
          return {
              code: '',
              name: '',
              type: ''
          }
        }
      },
    },
    components: { Icon },
    data () {
        let that = this;
        let managerData = extendUtils.stateManager.setData([]);
        let data = {
            tagDefaultList:[ //标签默认的数组
              { 
                code: 'company',
                name: '公司',
                type: 'default' //default代表默认的，custom代表自定义的
              },
              { 
                code: 'home',
                name: '家',
                type: 'default'
              },
              { 
                code: 'school',
                name: '学校',
                type: 'default'
              },
            ],
            tagCustomObj:{},//自定义的标签对象
            choosedTag:{}, //选中的tag标签
            showAddTag: true, //标识是否显示新增标签按钮的变量
            showEditTag: false, //标识是否显示编辑标签的变量
            showCustomTag: false, //标识是否显示自定义的标签的变量
            editTagValue: '', //新增或者编辑的标签input绑定的值
            disableConfirmTag: true, //是否能输入新增的标签信息
        }
        data = Object.assign(managerData, data)
        return data;
    },
    computed:{},
    created: function () {},
    mounted: function () {},
    watch: {
      /**
       * 监听tagObj对象，更新choosedTag 和 tagCustomObj
       */
      tagObj: {
        handler(val){
          this.updateChoosedTag(val);
        },
        deep: true
      },

      /**
       * 监听choosedTag变化 并向外传递 
       */
      choosedTag: {
        handler(val){
          this.$emit('tagTransfer', val);
        },
        deep: true
      },
    },
    methods: {
      /**
       * 更新choosedTag 和 tagCustomObj
       */
      updateChoosedTag(item){
        this.init();
        let index = this.tagDefaultList.findIndex(temp=>{
          return item.name == temp.name
        })
        if(index > -1){ //说明该标签为默认的标签 更新choosedTag对象
          this.choosedTag = this.tagDefaultList[index];
        }else{ //不存在，或者未自定义的对象
          if(!!item.name){ //说明未自定义的tags存在
            this.showAddTag = false;
            this.showEditTag = false;
            this.showCustomTag = true;
            this.choosedTag = Object.assign({},{
              code:'newTag',
              name: item.name,
              type: 'custom',
            });
            this.tagCustomObj = JSON.parse(JSON.stringify(this.choosedTag));
          }
        }
      },

      /**
       * 先初始化相关的数据
       */
      init(){
        this.choosedTag = {};
        this.tagCustomObj = {}; 
        this.showAddTag = true;
        this.showEditTag = false;
        this.showCustomTag = false;
      },

      /**
       * 点击标签的回调
       * @param item 点击的标签对象
       */
      chooseTagFun(item){
        if(this.choosedTag.code == item.code){
          this.$set(this.choosedTag, 'code', '')
        }else{
          this.choosedTag = JSON.parse(JSON.stringify(item));
          this.showEditTag= false;
          //切换标签tab的时候如果有自定义的标签，则不显示新增的按钮 如果没有则显示
          if(Object.keys(this.tagCustomObj).length > 0){
            this.showAddTag = false;
            this.showCustomTag = true;
          }else{
            this.showAddTag = true;
          }
          this.editTagValue = '';
        }
      },

      /**
       * 新增标签，一个地址只能新增一个标签。
       */
      addTag(){
        this.showAddTag = false;
        this.showEditTag = true;
        this.editTagValue = '';
        this.$nextTick(()=>{
          this.$refs.tagInput.focus();
        })
      },

      /**
       * 监听新增标签tag的输入框的变化
       */
      tagInputFun(){  
        if(!!this.editTagValue && this.editTagValue.length<=5){
          this.disableConfirmTag = false;
        }else{
          this.disableConfirmTag = true;
        }
      },

      /**
       * 点击新增标签的,并更新页面
       */
      confrimTagFun(){
        //当标签的格式有问题的时候直接return掉
        if(!!this.disableConfirmTag){return};
        this.choosedTag = Object.assign({},{
          code:'newTag',
          name: this.editTagValue,
          type: 'custom',
        });
        this.tagCustomObj = JSON.parse(JSON.stringify(this.choosedTag));
        this.showEditTag = false;
        this.showCustomTag = true;
      },

      /**
       * 点击编辑自定义标签的按钮
       * @param item 自定义标签的对象
       */
      editCustomFun(item){
        let that = this;
        //显示编辑的弹窗
        that.showEditTag = true;
        that.showCustomTag = false;
        that.editTagValue = item.name;
        that.$nextTick(()=>{
          that.$refs.tagInput.focus();
        })
      },
    }
  }

</script>
<style scoped lang="less">
@import '~themes/default/styles/common/variable.less';
@import '~mallStyles/mixins/mixinsStyle.less';
// 标签模块的样式
.address-tags{
  background: #fff;
  padding: 0.3rem;
  display: flex;
  .tags-title{
    width: 2rem;
    font-size: 0.28rem;
    color: @secondary-text-color;
  }
  .tags-details{
    flex: 1; 
    .custom-tag-wrapper{
      &.active{
        .custom-input{
          background: @address-color;
          color: #fff;
        }
        .btn{
          background:linear-gradient(140deg,rgba(95,116,255,1) 0%,rgba(41,66,232,1) 100%);
        }
      }
      height: 0.48rem;
      line-height: 0.48rem;
      font-size: 0.26rem;
      display: flex;
      .custom-input{
        padding-left: 0.24rem;
        height: 100%;
        width: 1.7rem;
        background: #F6F9FD;
        border-radius: 0.24rem 0 0 0.24rem;
        padding-left: 0.24rem;
        transition: all 0.3s;
      }
      .btn{
        margin-left: 1px;
        width: 0.8rem;
        height: 100%;
        border-radius:0 0.24rem 0.24rem 0;
        background:linear-gradient(140deg,rgba(153,153,153,1) 0%,rgba(102,102,102,1) 100%);
        text-align: center;
        color: #fff;
      }
    }
    ul{
      .clear();
    }
    .li-item{
      cursor: pointer;
      width: 1.2rem;
      height: 0.48rem;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: .24rem;
      border: 1px solid @border-color-base;
      font-size: 0.26rem;
      color: @secondary-text-color;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      float: left;
      margin-right: 0.2rem;
      margin-bottom: 0.24rem;
      &.add{
        margin-bottom: 0rem;
        float: none;
      }
      &.active{
        color: #fff;
        background: @address-color;
        border-color: @address-color;
      }    
    }
  }
  .edit-tag-box{
    position: relative;
    width: 4.46rem;
    height: 0.48rem;
    line-height: 0.48rem;
    display: flex;
    font-size: 0.26rem;
    .input-tag{
      flex: 1;
      height: 100%;
      background: #F6F9FD;
      border-radius: 0.24rem 0 0 0.24rem;
      padding-left: 0.24rem;
    }
    .confirm-tag-btn{
      width: 0.8rem;
      height: 100%;
      border-radius:0 0.24rem 0.24rem 0;
      background-color: #DDE3E9;
      text-align: center;
      color: #fff;
    }
  }
}

// 底部的保存按钮
.save {
  z-index: 1000;
  position: absolute;
  bottom: 0.6rem;
  left: 0.3rem;
  right: 0.3rem;
  height: .88rem;
  line-height: .88rem;
  text-align: center;
  color: #fff;
  font-size: .32rem;
  border-radius: 0.44rem;
  background-color: @theme-color;
  box-shadow:0px -4px 56px 0px rgba(161,161,161,0.1);
}


//从T信选人的样式
.choose-Tchat-person{
  height: 0.88rem;
  // width: 1.2rem;
  display: flex;
  flex-direction:column; 
  justify-content: center;
  text-align: center;
  align-items: center;
  padding-top: 0.2rem;
  /deep/.icon-container{
    font-size: inherit;
  }
  .icon{
    width: 0.36rem;
    height: 0.36rem;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .lable{
    font-size: 0.16rem;
    line-height: 0.22rem;
    color: @third-text-color;
  }
}
</style>
