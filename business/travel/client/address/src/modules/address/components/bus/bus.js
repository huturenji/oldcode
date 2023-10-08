import Vue from 'vue'
if (!window.globalBus){
    window.globalBus = new Vue();
}
export default window.globalBus;