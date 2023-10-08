import { adapter, polyfill } from "sino/adapter";
import bridgeMethods from 'sino/bridge/base'

//代理sdk函数，方便对渠道做定制
let bridgeProxy = adapter(bridgeMethods);
bridgeProxy = polyfill(bridgeProxy);

export default bridgeProxy