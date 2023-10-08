import Vue from 'vue';
import directve from './directive';
import {TransferDom} from 'vux';

// TransferDom指令，使dom元素能脱离child-view渲染
Vue.directive('transfer-dom', TransferDom);
//用于判断当前图片是否能够加载成功，可以加载成功则赋值为img的src属性，否则使用默认图片
Vue.directive('real-img', directve.realImg);