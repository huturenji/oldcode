/**
 * 获取需要打包的模块
 */
let result = {}
let requireAll = requireContext => requireContext.keys().map(requireContext)
let req = require.context('./', false, /^(((?!\.\/index\.js).)*)$/);//排除index.js
requireAll(req).forEach(_module => {
    Object.assign(result, _module.default)
})
export default result;