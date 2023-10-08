/**
 * 全局权限校验的配置
 * 日期：2020年9月9日
*/

export const globalAuthData = {
    hasSeeOffShelfAuth: { name: "查看下架列表", needAuthList: ["49003001"] },
    hasAddOffShelfAuth: { name: "新增下架规则", needAuthList: ["49003002"] },
    hasEditOffShelfAuth: { name: "编辑下架规则", needAuthList: ["49003003"] },
    hasStopUsingOffShelfAuth: { name: "停/启用上下架规则", needAuthList: ["49003004"] },
    hasSeePriceRuleAuth: { name: "查看定价规则列表", needAuthList: ["49004001"] },
    hasAddPriceRuleAuth: { name: "新增定价规则权限", needAuthList: ["49004002"] },
    hasEditPriceRuleAuth: { name: "编辑定价规则权限", needAuthList: ["49004003"] },
    hasStopUsingPriceRuleAuth: { name: "启用/停用定价规则权限", needAuthList: ["49004004"] },
    hasSetcookiefAuth: { name: "设置cookie", needAuthList: ["49010001"] },

    seeSupplier: { name: "查看供应商", needAuthList: ["49001001"] },
    updateSupplier: { name: "编辑供应商", needAuthList: ["49001002"] },
    setSupplierState: { name: "启用/停用供应商", needAuthList: ["49001003"] },

    seeChannel: { name: "查看渠道", needAuthList: ["49002001"] },
    updateChannel: { name: "编辑渠道", needAuthList: ["49002002"] },
    setChannelState: { name: "启用/停用渠道", needAuthList: ["49002003"] },

    showServiceListAuth: { name: "查看服务单", needAuthList: ["49006001"] },
    serviceOrderRefundAuth: { name: "服务单退款", needAuthList: ["49006002"] },
    serviceOrderupdateAuth: { name: "领取服务单", needAuthList: ["49006003"] },

    showSaleAuth: { name: "查看订单", needAuthList: ["49005001"] },
    showSaleExportAuth: { name: "导出销售订单", needAuthList: ["49005002"] },
    showSaleLogAuth: { name: "添加订单备注", needAuthList: ["49005003"] },

    seePriceComparison: { name: "查看比价标签管理", needAuthList: ["49008001"] },
    addPriceComparison: { name: "新增比价标签管理", needAuthList: ["49008002"] },
    updatePriceComparison: { name: "编辑比价标签管理", needAuthList: ["49008003"] },
    delPriceComparison: { name: "删除比价标签管理", needAuthList: ["49008004"] },

    seeAutoPriceComparison: { name: "查看比价标签管理", needAuthList: ["49008001"] },
    updateAutoPriceComparison: { name: "编辑比价标签管理", needAuthList: ["49008002"] },
    delAutoPriceComparison: { name: "删除比价标签管理", needAuthList: ["49008003"] },
    comfirmAutoPriceComparison: { name: "确认比价标签管理", needAuthList: ["49008004"] },

    JDVirtualsuppliers: { name: "京东虚拟供应商", needAuthList: ["49009001"] },
    XYVirtualsuppliers: { name: "西域虚拟供应商", needAuthList: ["49009002"] },
    // SearchCanPurchase: { name: "查询可售性小工具", needAuthList: ["49009003"] },
    UrlMasking: { name: "联盟链接生成器", needAuthList: ["49009004"] },
    JDVPOrderInfo: { name: "京东供应商资金明细", needAuthList: ["49009005"] },
    SearchPriceTask: { name: "京东售价/优惠工具", needAuthList: ["49009006"] },
    selectionTools: { name: "选品工具", needAuthList: ["49009007"] },

    seeUserInfos: { name: "查看用户信息", needAuthList: ["99901001"] },
    addUser: { name: "添加人员", needAuthList: ["99901002"] },
    delUser: { name: "删除人员", needAuthList: ["99901003"] },
    editUser: { name: "编辑人员", needAuthList: ["99901004"] },
    seeRoleInfo: { name: "查看角色", needAuthList: ["99901005"] },
    addRole: { name: "添加角色", needAuthList: ["99901006"] },
    editRole: { name: "编辑角色", needAuthList: ["99901007"] },
    delRole: { name: "删除角色", needAuthList: ["99901008"] },
    seeAuthList: { name: "查看权限列表", needAuthList: ["99901009"] }    

}