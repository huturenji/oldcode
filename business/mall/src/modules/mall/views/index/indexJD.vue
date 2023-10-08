<template>
  <div class="index-container" ref='indexContainer'>
    <canvas id="hiddenCanvas"  width="200" height="100" style="display:none;"></canvas>
    <mescrollVue ref="mescroll" :down="mescrollDown" :up="mescrollUp" @init="mescrollInit">
      <div class="content-box">

        <!-- 顶部的tips部分 无需垫付 发票保障  合规透明 -->
        <topTips class="top-tips-wrap"></topTips>

        <!-- 搜索/分类/banner部分 -->
        <div ref='searchBannerContent' class='search-banner-content' :class="{noSwiper: !isRecommendIndex}">
          <div v-show="isRecommendIndex && showGraBg" class="change_bg" :style="{backgroundColor: bgColor}"></div>
          <div class='sub-banner-content'>
              <!-- 顶部的搜索栏 -->
              <searchComp  
                @click.native="gotoSearch"  
                ref='searchDom' 
                class='search-content float' 
                :theme='searchTheme' 
                :isDisabled="true" 
                @search="searchFun" />
    
              <!-- 产品分类筛选区域 -->
              <div ref='categories' v-show="productCategories.length > 0"  class="goods-categories">
                <div class="tab-box">
                  <tab ref='tabBox'
                    v-if="productCategories.length" 
                    :list='productCategories'
                    v-model='activeIndex'
                    @click='clickTab'
                  >

                  </tab>
                </div>
                 <div class='view-more'  @click="viewMoreFun">
                    <Icon type='icon_mall_gengduo' size=".36" />
                </div>
              </div>
          </div>

          <!-- 上拉刷新插入的dom -->
          <div id='upRefresh'></div>
          <!-- banner区域 -->
          <div v-if="isRecommendIndex" class="swiper-content">
            <swiperComp ref='swiperCompRef' :list="bannerList" :swiperOptipns="swiperOptipns"/>
          </div>
        </div>
        <!-- 底部的商品列表区域 -->
        <div v-if="!isRecommendIndex" id='dataList' ref='listPart' class="list-part">
            <ul class="goods-list" v-if='productCategoryId && goodsList && goodsList.length>0'>
              <li @click="gotoGoodsDetails(item, index)" class="goods-item" v-for="(item, index) in goodsList" :key="index">
                <thumb01 :img='item.imageUrl'
                  :title='item.wareName'
                  :price='item.price'
                  :oldPrice='item.price'
                  :status='judgeStatus(item)'
                  :hideAddCart='isguest'
                  @addCart='addCart($event, item, index)'
                />
              </li>
            </ul>
        </div>
        <!-- 首页底部的商品推荐和品牌分类 -->
        <template v-if="isRecommendIndex && loadedRecommendList">
          <!-- 推荐分类 -->
          <div class="recommend-part">
            <div class="goods_recommend_title">好物推荐</div>
            <div class="item one">
              <div class="half">
                <recommendThumb :recommendItem="recommendList[0]"></recommendThumb>
              </div>
              <div class="colounm half">
                <recommendThumb :recommendItem="recommendList[1]"></recommendThumb>
                <recommendThumb :recommendItem="recommendList[2]" class="top"></recommendThumb>
              </div> 
            </div>

            <div class="item two">
              <div class="third">
                <recommendThumb :recommendItem="recommendList[3]"></recommendThumb>
              </div>
              <div  class="third">
                <recommendThumb :recommendItem="recommendList[4]"></recommendThumb>
              </div>
              <div  class="third">
                <recommendThumb :recommendItem="recommendList[5]"></recommendThumb>
              </div>
            </div>
          </div>

          <!-- 品牌精选 -->
          <div class="brand-part">
            <brand :recommendBrandList="recommendBrandList"></brand>
          </div>
        </template>

      </div>
    </mescrollVue>
  </div>
</template>

<script>
  import indexMixin from './components/indexMixin.vue'; 
  import {bannerList} from 'common/lib/enum/JDBannerEnum';
  export default {
    mixins: [indexMixin],
    data() {
      let that = this;
      return {
        bannerList: bannerList, //首页banner的枚举 
      }
    },
    components: {
      
    },
    created() {
       
    },  

    destroyed(){
      
    },
    mounted() {
      
    },
    activated(){
      
    },
    watch:{
      
    },
    computed:{
     
    },
    methods: {
      
    }
  }
</script>
<style scoped lang="less">
@import '~themes/default/styles/index/indexJD.less';
</style>
<style lang='less'>
@import '~themes/default/styles/components/mescroll.less';
</style>
