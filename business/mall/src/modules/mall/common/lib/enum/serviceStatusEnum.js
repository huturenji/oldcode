/**
 * 售后服务状态枚举，所有状态在这里声明和转换
 * 拒绝在业务代码中硬编码状态值。所有状态都应使用这个枚举中的对象属性
 */

export const ServiceStatusEnum = {
    APPLYING: 1,//申请中
    COMPLETE: 2,//已完成
}
