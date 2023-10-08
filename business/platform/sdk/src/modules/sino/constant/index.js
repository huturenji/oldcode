import commonConstant from 'src/lib/constant'

export default{
    ...commonConstant,
    NO_BRIDGE_ERROR: {
        RET: 404,
        NAME: 'noBridge'
    },
    BRIDGE_TYPE: {
        SINO: 'sino',
        MPAAS: 'mpaas',
        TMF: 'tmf',
        CHERRY: 'cherry',
        WEBOA: 'weboa',
        WEBSINO: 'weboa_sino'
    },
    RUN_ENV: {
        BIZMATE: 'bizmate',
        TCHAT: 'tchat',
        BROWSER: 'browser',
        WEBOA: 'webOA',
        WEBSINO: 'weboa_sino',
        WECHAT_H5: 'wechat_h5',
        WECHAT_MINI_APP: 'wechat_mini_app',
    },
}