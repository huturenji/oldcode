import InfiniteScroll from './directive';
import Vue from 'vue';

const install = function(Vues) {
    Vues.directive('InfiniteScroll', InfiniteScroll);
};

if (!Vue.prototype.$isServer && window.Vue) {
    window.infiniteScroll = InfiniteScroll;
  Vue.use(install); // eslint-disable-line
}

InfiniteScroll.install = install;
export default InfiniteScroll;
