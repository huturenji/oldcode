/**
 * 单批次整体状态
 */
const BATCH_STATE = {
    TO_IDENTIFY:1,//待识别
    IDENTIFY_FAILED:2,//识别失败
    TO_CHECK:3,//待审核
    INVALID:4,//已作废
    TO_UPLOAD:5,//待上传
    UPLOADED:6//上传完成

}
/**
 * 审核页面状态对应关系   
 * 待审核对应1,2,3
 * 已审核对应5,6
 */
const BATCH_BIZ_STATE = {
    TO_CHECK:[BATCH_STATE.TO_IDENTIFY,BATCH_STATE.IDENTIFY_FAILED,BATCH_STATE.TO_CHECK],//待审核
    TO_CHECK_INDEX:0,//待审核 索引
    CHECKED:[BATCH_STATE.TO_UPLOAD,BATCH_STATE.UPLOADED],//已审核
    CHECKED_INDEX:1//已审核 索引
}

/**
 * 状态对应的文本信息
 */
const BATCH_BIZ_STATE_TEXT = {
    [BATCH_STATE.TO_UPLOAD]:'注册失败',//注册失败
    [BATCH_STATE.UPLOADED]:'注册成功'//注册成功
}
/**
 * 单批次单个标签状态
 */
const LABEL_STATE = {
    TO_INDENTIFY:1,//待识别
    IDENTIFY_FAILED:2,//识别失败
    TO_UPLOAD:3,//待上传
    UPLOAD_COMPLETED:4//上传完成
}

/**
 * 操作状态
 */
const OPERATION_STATE = {
    INVALID:1,//作废
    CHECK:2//确认审核
}

export {
    BATCH_STATE,BATCH_BIZ_STATE,LABEL_STATE,OPERATION_STATE,BATCH_BIZ_STATE_TEXT
}