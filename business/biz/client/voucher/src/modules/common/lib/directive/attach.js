import Vue from 'vue';
import {TransferDom} from 'vux';

// TransferDom指令，使dom元素能脱离child-view渲染
Vue.directive('transfer-dom', TransferDom);