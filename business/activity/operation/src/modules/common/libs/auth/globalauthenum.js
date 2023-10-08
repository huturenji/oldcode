/**
 * 全局权限校验的配置
 * 日期：2020年9月9日
*/

export const globalAuthData = {
    seeCustomerListAuth: { name: "查看客户信息", needAuthList: ["51001001"] },
    hasAddCountAuth: { name: "新增客户", needAuthList: ["51001002"] },
    hasEditCountAuth: { name: "编辑客户", needAuthList: ["51001003"] },

    seeOrder: { name: "查看订单", needAuthList: ["51002001"] },
    auditOrder: { name: "审核订单", needAuthList: ["51002002"] },

    seeProductPool: { name: "查看商品池", needAuthList: ["51003001"] },
    associateProductPool: { name: "关联商品池", needAuthList: ["51003002"] },

    seePromotiomList: { name: "查看活动列表", needAuthList: ["51004001"] },


    seeUserInfos: { name: "查看用户信息", needAuthList: [99901001] },
    addUser: { name: "添加人员", needAuthList: [99901002] },
    delUser: { name: "删除人员", needAuthList: [99901003] },
    editUser: { name: "编辑人员", needAuthList: [99901004] },
    seeRoleInfo: { name: "查看角色", needAuthList: [99901005] },
    addRole: { name: "添加角色", needAuthList: [99901006] },
    editRole: { name: "编辑角色", needAuthList: [99901007] },
    delRole: { name: "删除角色", needAuthList: [99901008] },
    seeAuthList: { name: "查看权限列表", needAuthList: [99901009] },

    authmgr: { name: "权限配置", needAuthList: ["99902001"] },
}