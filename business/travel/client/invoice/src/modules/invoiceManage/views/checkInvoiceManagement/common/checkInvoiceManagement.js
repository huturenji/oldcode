//发票的类型 目前用于查验记录的筛选
export const invoiceTypeList = [
    {
        code:'',//空字符串代表全部
        name:'全部'
    },
    {
        code:'1,8,3,15,91',
        name:'增值税专票'
    },  
    {
        code:'4,10,11,14',
        name:'增值税普票'
    }, 
    {
        code:'21',
        name:'区块链发票'
    }, 
    {
        code:'9,83',
        name:'电子发票'
    },
    {
        code:'92',
        name:'全电纸票 (普票)'
    },
    {
        code:'36',
        name:'通用电子发票'
    }
];
//发票的查验结果 查验通过和查验一场 目前用于查验记录的筛选
export const checkStatus = [
    {
        code:0,
        name:'全部'
    },
    {
        code:1,
        name:'查验通过'
    },
    {
        code:2,
        name:'查验异常'
    }
];

//发票类型Map
export const invoiceTypeMap = { //发票类型map
    0: {name:'增值税专票',needParams:['invoiceCode','invoiceNumber','billingDate','totalAmount'],totalAmountName:'合计金额',totalAmountNameTips:'（不含税）',totalAmountPlaceholder:'请输入合计金额'},
    1: {name:'增值税普票',needParams:['invoiceCode','invoiceNumber','billingDate','checkCode'],checkCodeName:'校验码',checkCodeNameTips:'（后6位）',checkCodePlaceholder:'请输入后6位校验码'},
    2: {name:'区块链发票',needParams:['invoiceCode','invoiceNumber','checkCode','salesTaxNo'],checkCodeName:'校验码',checkCodePlaceholder:'请输入校验码'},
    3: {name:'电子发票',needParams:['invoiceNumber','billingDate','totalAmount'],totalAmountName:'价税合计',totalAmountPlaceholder:'请输入价税合计金额'},
    4: {name:'全电纸票 (普票)',needParams:['invoiceCode','invoiceNumber','billingDate','checkCode'],checkCodeName:'全电号码',checkCodeNameTips:'（后6位）',checkCodePlaceholder:'请输入全电号码后6位'},
    5: {name:'通用电子发票',needParams:['invoiceCode','invoiceNumber','orderNo']}
}

/**
 * 发票代码的正则表达式10或12位数字
 * @param {Object} InvoiceCode
 */
export function isInvoiceCode(InvoiceCode){
    let regTen = /^[0-9]{10}$/;
    let regTwelve = /^[0-9]{12}$/;
    return regTen.test(InvoiceCode) || regTwelve.test(InvoiceCode);
}
/**
 * 发票号码的正则表达式8或20位数字
 * @param {Object} InvoiceNumber
 */
export function isInvoiceNumber(InvoiceNumber){
    let reg8 = /^[0-9]{8}$/;
    let reg20 = /^[0-9]{20}$/;
    return reg8.test(InvoiceNumber) || reg20.test(InvoiceNumber);
}


