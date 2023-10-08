/*
 * 屏蔽body的滚动条
 */
var scrollLockMixin = {
  created: function () {
    try{
        document.getElementsByTagName('html')[0].classList.add('body-noscroll')
    }catch (e) {}
  },
  beforeDestroy: function () {
    try{
        document.getElementsByTagName('html')[0].classList.remove('body-noscroll')
    }catch (e) {}
  },
}

export default scrollLockMixin;

   

    
    

