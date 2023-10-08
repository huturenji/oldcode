/**
 * 全局权限校验的配置
 * 日期：2020年9月9日
*/

export const globalAuthData = {

    channelmgr: { name: "运维渠道管理", needAuthList: ["49007001"] },
    suppliermgr: { name: "供应商配置", needAuthList: ["49008001"] },
    authmgr: { name: "权限配置", needAuthList: ["99902001"] }
}