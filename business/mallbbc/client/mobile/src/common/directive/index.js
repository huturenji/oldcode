import Vue from 'vue';

export function install(){
    let requireAll = requireContext => requireContext.keys().filter(name => name != './index.js').map(requireContext);
    let req = require.context('/', false, /\.js$/);
    requireAll(req).forEach(_module => {
        Vue.directive(_module.default.name, _module.default.directive);
    })

}