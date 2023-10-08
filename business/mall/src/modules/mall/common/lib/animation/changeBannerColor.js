/*
 * 首页banner随swiper的图片滚动而改变颜色。颜色使用图片的平均色（即主色）
 * TODO 暂时放这里，这个功能只做了一半（获取主色，可根据图片滑动的进度改变颜色），由于需求暂停，以后有需要再继续开发
 * TODO 是用mixins还是用Class都可以。但按目前的架构来说，动画用Class比较合理。这段代码是直接从业务侧抽出来，还没进一步修改
 */

import GradientColor from 'common/lib/animation/utils/gradientColor.js'
var switchBannerColorMixin = {
  data(){
    return {
      imgDomArr: [],//图片dom的集合
      imgDomStartColor:[],//图片的dom每一张的固定颜色集合
      imgDomColorArr: [],//当前图片与下一张图片的渐变色集合。比如：[[img的主色-img2的主色]，[img2的主色-img3的主色]]...
      imgColorChangeStep: 100, //渐变色的份数，也可以认为是动画的帧数（两者的值是一样的）
      imgColorIndex:0,//渐变色的起始索引
    }
  },
  methods: {
    /**
     * 在swiper初始化完成后，立即获取所有图片的主色，并生成图片之间的颜色渐变数值集合
     */
    getImgDomArr(){
      let that = this;
      let readImgDomArr = this.$refs.swiperCompRef.$el.getElementsByTagName('img');
      this.imgColorChangeStep = readImgDomArr[0].offsetWidth;
      let canvas = document.getElementById('hiddenCanvas'); //利用canvas获取图片的主色
      //非loop模式下
      that.imgDomArr = that.arrayofNodes(readImgDomArr);
      console.log('that.imgDomArr', that.imgDomArr)
      for(let curr=0;curr<that.imgDomArr.length;curr++){
        // let next = curr+1 >= that.imgDomArr.length ? 0 : curr + 1;  
        let sColor = that.getImageColor(canvas, that.imgDomArr[curr]);//当前图片主色
        // let eColor = that.getImageColor(canvas, that.imgDomArr[next]);//下一张（正在滚动的）图片主色
        // that.imgDomColorArr.push(new GradientColor(sColor, eColor, that.imgColorChangeStep));//两张图片的渐变数值集合
        that.imgDomStartColor.push(sColor);//每一张图片固定的颜色集合
      }      
      
    },
    /**
     * 图片滑动时，同时改变背景色。背景色的取值已经在getImgDomArr()中得到了，根据滑动进度，根据下标取得当前色值
     */
    swiperProgress(obj){
      let that = this;
      let progress = obj.progress;
      let swiper = obj.swiper;
                    
      if(swiper.realIndex == null || that.imgDomStartColor.length<=0){
        return;
      }
      let index = swiper.realIndex;

      // if(this.imgColorIndex >= this.imgColorChangeStep){
      //   ++index;
      //   this.imgColorIndex = 0;
      // }
      //todo目前暂未实现根据动态效果动态变更背景色的功能  因为是loop模式 故此处的inde+1
      this.bgColor = that.imgDomStartColor[index];
    },
    /**
     * 利用canvas获取图片的平均色（主色）
     * @param {*} canvas 
     * @param {*} img 
     */
    getImageColor(canvas, img) {
      let r=0,g=0,b=0;
      canvas.width = img.width;
      canvas.height = img.height;
  
      var context = canvas.getContext("2d");
  
      context.drawImage(img, 0, 0);
  
      // 获取像素数据
      var data = context.getImageData(0, 0, img.width, img.height).data;
      // 取所有像素的平均值
      for (var row = 0; row < img.height; row++) {
          for (var col = 0; col < img.width; col++) {
              r += data[((img.width * row) + col) * 4];
              g += data[((img.width * row) + col) * 4 + 1];
              b += data[((img.width * row) + col) * 4 + 2];
          }
      }
  
      // 求取平均值
      r /= (img.width * img.height);
      g /= (img.width * img.height);
      b /= (img.width * img.height);

      // 将最终的值取整
      r = Math.round(r);
      g = Math.round(g);
      b = Math.round(b);
      console.log(`rgb(${r},${g},${b})`)
      return `rgb(${r},${g},${b})`;
    },

    //将nodeList转为真数组
    arrayofNodes(nodes){
      var arr = null;
      try{
          arr = Array.prototype.slice.call(nodes,0);
      }catch(ex){
          arr = new Array();
          for(var i=0,len=nodes.length; i < len; i++){
              arr.push(nodes[i]);
          }
      }
      return arr;
    }
  },
}

export default switchBannerColorMixin;

   

    
    

