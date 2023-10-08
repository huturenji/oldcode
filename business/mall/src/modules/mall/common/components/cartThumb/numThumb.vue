
<template>
    <div class="cart-num" :class='numSize'>{{number>99?'99+':number}}</div>
</template>
<script>
export default {
    props:["number"],
    computed:{
        numSize(){
            let num = Number(this.number);
            if(num<10){
                return ''
            }else if(num<=99){
                return 'middle';
            }else{
                return 'big';
            }
        }
    },
}
</script>
<style lang="less" scoped>
@import '~themes/default/styles/common/variable.less';
.cart-num{
    border: 1px solid #fff;
    box-sizing: content-box;
    width: 0.28rem;
    max-width: .54rem;
    height: 0.28rem;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    color: #fff;
    font-size: 0.2rem;
    background-color: @danger-color-light;
    border-radius: 0.28rem;
    position: absolute;
    top: 0;
    right: 0;
    white-space: nowrap;

    &.middle{
        width: .38rem;
        right: -.02rem;
    }

    &.big{
        width: .54rem;
        right: -.18rem;
    }
}
</style>