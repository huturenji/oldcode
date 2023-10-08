export default {
    //keycloak配置
    KEYCLOAK: {
        //静态资源保护的配置
        RESOURCE_PROTECT: {
            //realm的名字
            REALM: 'mall_dev',
            //keycloak服务器地址
            URL: 'https://bplusdev.sinosun.com:18180/auth'
        },
        LOGIN: {
            clientId: 'mall_H5'
        }
    }
}