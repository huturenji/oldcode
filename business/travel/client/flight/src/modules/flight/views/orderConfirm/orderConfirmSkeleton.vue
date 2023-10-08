<template>
  <div>
    <div  class="child-view">
      <!---->
      <div   class="body">
         
        <div  class="main">
             <!-- -1 -->
          <div  class="newMain">
              <div class="left animated-background"></div>
              <div class="middle animated-background"></div>
              <div class="right animated-background"></div>
          </div>
           <!-- -1 -->
          <!---->
           <!-- -2 -->
          <div  class="newPrice">
            <div  class="carbin animated-background">
            </div>
            <div  class="detail animated-background"></div>
          </div>
           <!-- -2 -->
           
          <!---->
          <div  class="customerList">
            <div  class="customer lineBorderB">
              <div  class="customerLineWrap lineBorderB">
                <div  class="delBut animated-background"></div>
                <div  class="textLineWrap">
                  <div  class="textName animated-background"></div>
                  <div  class="textIdWrap animated-background"></div>
                </div>
              </div>
            </div>
            <div  class="addCustomer">
              <span  class="animated-background"></span>
            </div>
          </div>
          <div  class="connector">
            <div  class="animated-background"></div>
          </div>
          <div  class="reimburse">
            <div class="title animated-background"></div>
            <div class="ttips animated-background"></div>
          </div>
            <div class="bottomButWrap">
        </div>
          <div class="insurance">
              <ul>
                  <li>
                      <div class="left animated-background"></div>
                      <div class="middle ">
                          <p class="animated-background"></p>
                          <span class="animated-background"></span>
                      </div>
                      <div class="right animated-background"></div>
                  </li>
                  <li>
                      <div class="left animated-background"></div>
                      <div class="middle ">
                          <p class="animated-background"></p>
                          <span class="animated-background"></span>
                      </div>
                      <div class="right animated-background"></div>
                  </li>
                  <li>
                      <div class="left animated-background"></div>
                      <div class="middle ">
                          <p class="animated-background"></p>
                          <span class="animated-background"></span>
                      </div>
                      <div class="right animated-background"></div>
                  </li>
              </ul>

          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
    data: function() {
        return {};
    },
    mounted() {},
    methods: {}
};
</script>
<style lang="less" scoped>
@import '~themes/default/styles/common/index.less';    
@import "~styles/mixins/mixinsStyle.less";
 .animated-background {
            animation-name: placeHolderShimmer;
            animation-duration: 0.75s;
            animation-iteration-count: infinite;
            animation-direction: alternate;
            animation-timing-function: ease;
            background: #f2f3f5;
            position: relative;
        }
        @keyframes placeHolderShimmer {
            0% {
                opacity:1;
            }
            100% {
                opacity:0.14;
            }
        }


html {
  font-size: 10000/750vw;
}

body {
  background: #f2f3f5;
}

.body {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  position: relative;
    z-index: 503;

  .main {
    display: block;
    // padding-bottom: 1.1rem;
    overflow-x: scroll;
    max-height: 90%;
  }
}
// -1
.newMain {
  display: flex;
  margin: .1rem 0;
  padding: .1rem;
  justify-content: space-around;
  align-items: center;
  background: #ffffff;
height: .6rem;
    div{
        height:.3rem ;
    }
    .left{
        width: 3rem;
    }
    .middle{
        width: 1rem ;
    }
    .right{
        width: 5rem;
    }
}
// -1


// -2
.newPrice {
  padding: .2rem .3rem;
  margin: .1rem 0;
  background: #ffffff;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  div {
   height: .32rem;
  }
  .carbin {
    width:2rem;
    margin-bottom: .04rem;
  }
  .detail{
      width: 5rem;
  }
}
// -2
.customerList {
  border-bottom: 1px solid #f2f3f5;
  background: #ffffff;
  margin-bottom: 0.2rem;
  .inline-loading {
    color: #c2c2c2;
    line-height: 0.8rem;
    text-align: center;
  }
  .customer {
    .customerLineWrap {
      padding: 0.15rem 0.3rem;
      display: flex;
      .align-items(center);
      .delBut {
        width: 0.85rem;
        height: 0.85rem;
      }
      .textLineWrap {
        height: 0.85rem;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        padding-right: 0.46rem;
        padding-left: 0.4rem;
        .textName {
          height: 0.28rem;
          width: 1.5rem;
        }
        .textIdWrap {
          margin-top: 0.04rem;
          height: 0.28rem;
          width: 3.2rem;
        }
      }
    }
  }
}
.addCustomer {
  display: flex;
  .justify-content(center);
  .align-items(center);
  color: @theme-color;
  height: 0.8rem;
  span {
    width: 2rem;
    height: 0.5rem;
  }
}
.connector {
  margin-bottom: 0.2rem;
  padding: 0.2rem 0.3rem;
  background: #ffffff;
  height: 0.32rem;
  div {
    height: 0.32rem;
  }
}
.bottomButWrap {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  box-shadow: 0 -0.05rem 0.1rem #e9e9eb;
  height:1.1rem;
  z-index: 502;
  background: #fff;
  
}

.reimburse {
  background: #ffffff;
  padding: 0.2rem .3rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
   .title{
       width: 3rem;
       height:.4rem;
       margin-bottom: .02rem;
   }
   .ttips{
       width: 6rem;
       height:.32rem;
   }
}

.insurance{
    padding: 0 .3rem;
    background: #fff;
    ul{
        li{
            padding: 0.25rem .3rem 0.25rem 0;
            border-bottom: 1px solid #ededed;
            display: flex;
            justify-content: space-between;
            align-items: center;
            .left{
                width: 0.38rem;
                height: 0.38rem;
                margin-right: .5rem;
            }
            .middle{
                height: .58rem;
                flex:1;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                p{
                    width: 2rem;
                    height: .32rem;
                }
                span{
                    margin-top: .04rem;
                    width: 3rem;
                    height: .26rem;
                }
            }
            .right{
                width: 2rem;
                height: 0.3rem;
            }
        }
    }
}
</style>