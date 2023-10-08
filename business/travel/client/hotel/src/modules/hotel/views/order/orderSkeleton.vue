<template>
  <div class="orderSkeleton-container">
      <div class="card">
          <div class="cardbox">
                <h3 class="animated-background"></h3>
                <div class="middle">
                    <div class="today ">
                        <p class="animated-background"></p>
                        <span class="animated-background"></span>
                    </div>
                    <div class="time animated-background"></div>
                    <div class="nextday">
                        <p class="animated-background"></p>
                        <span class="animated-background"></span>
                    </div>
                </div>
                <div class="buttom">
                    <div class="left ">
                        <p class="animated-background"></p>
                        <span class="animated-background"></span>
                    </div>
                    <div class="right animated-background"></div>
                </div>
          </div>
      </div>
        <div class="roomNum">
            <div  class="connector">
                <div  class="animated-background"></div>
            </div>
            <div  class="connector">
                <div  class="animated-background"></div>
            </div>
            <div  class="connector">
                <div  class="animated-background"></div>
            </div>
        </div>
        <div class="credit">
            <div  class="creditBox">
                <div  class="left animated-background"></div>
                <div  class="right animated-background"></div>
            </div>
            <div  class="creditBox">
                <div  class="left animated-background"></div>
                <div  class="right animated-background"></div>
            </div>
            <div  class="creditBox">
                <div  class="left animated-background"></div>
                <div  class="right animated-background"></div>
            </div>
        </div>
       <div class="bottomButWrap"></div>
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
<style scoped lang="less" >
@import "~styles/mixins/mixins.less";

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

.orderSkeleton-container{
    .card{
        margin: 0.3rem;
        border-radius: 0.2rem;
        padding: 0.3rem 0;
        background: #ffffff;
        .cardbox{
         padding: 0 .3rem;
        h3{
            width: 3rem;
            height: .34rem;
            margin-bottom: .2rem;
            
        }
        .middle{
            padding: .2rem 0 .4rem;
            height: .72rem;
            border-bottom: 1px dashed #c2c2c2;
            display: flex;
            justify-content: space-between;
            align-items: center;
            .today{
                width: 2rem;
                height: .7rem;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                p{
                    width: 2rem;
                    height: .28rem;
                }
                span{
                    margin-top: .06rem;
                    width: 1.5rem;
                    height: .26rem;
                }
            }
            .time{
                width: 1rem;
                height:.4rem
            }
            .nextday{
                width: 2rem;
                height: .7rem;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                align-items: flex-end;
                p{
                    width: 2rem;
                    height: .28rem;
                }
                span{
                    margin-top: .06rem;
                    width: 1.5rem;
                    height: .26rem;
                }
            }
        }
        .buttom{
            padding-top: .2rem;
            height: .6rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
            .left{
                height: .6rem;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                p{
                    width: 3rem;
                    height: .28rem;
                }
                span{
                    margin-top: .06rem;
                    width: 2rem;
                    height: .26rem;
                }
            }
            .right{
                width: 2.5rem;
                height:.28rem
            }
        }
        }
    }
    // .roomNum{
    //     padding-top:0.2rem ;
    // }
    .connector {
  padding: 0.2rem 0.3rem;
  background: #ffffff;
  height: 0.32rem;
  border-bottom: 1px solid #ededed;
  div {
    height: 0.32rem;
  }
}
.credit{
    margin-top: .3rem;
    background-color: #fff;
    .creditBox{
        padding: 0.2rem 0.3rem;
        border-bottom: 1px solid #ededed;
        display: flex;
        justify-content: space-between;
        .left{
            width: 2rem;
            height: 0.45rem; 
            margin-right: 1rem;
        }
        .right{
            flex: 1;
            height: 0.45rem; 
        }
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
}


</style>