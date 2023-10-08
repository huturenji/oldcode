/**
 * 全局权限校验的配置
 * 日期：2020年9月9日
*/

export const globalAuthData = {
    // updateSupplier: { name: "编辑供应商", needAuthList: [85001002] },
    // seteSupplierState: { name: "启用/停用供应商", needAuthList: [85001003] },
    
    // addChannel: { name: "新建渠道", needAuthList: ["85002002"] },
    // updateChannel: { name: "编辑渠道", needAuthList: ["85002003"] },
    // setChannelState: { name: "启用/停用渠道", needAuthList: ["85002004"] },

    seeUserInfos: { name: "查看用户信息", needAuthList: ["99901001"] },
    addUser: { name: "添加人员", needAuthList: ["99901002"] },
    delUser: { name: "删除人员", needAuthList: ["99901003"] },
    editUser: { name: "编辑人员", needAuthList: ["99901004"] },
    seeRoleInfo: { name: "查看角色", needAuthList: ["99901005"] },
    addRole: { name: "添加角色", needAuthList: ["99901006"] },
    editRole: { name: "编辑角色", needAuthList: ["99901007"] },
    delRole: { name: "删除角色", needAuthList: ["99901008"] },
    seeAuthList: { name: "查看权限列表", needAuthList: ["99901009"] },


}