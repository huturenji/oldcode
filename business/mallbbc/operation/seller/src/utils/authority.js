import {
    setStorage,
    getStorage
} from '@/utils/utils';
// use localStorage to store the authority info, which might be sent from server in actual project.
export function getAuthority(str) {
    // return getStorage('antd-pro-authority') || ['admin', 'user'];
    const authorityString =
    typeof str === 'undefined' ? getStorage('antd-pro-authority') : str;
    // authorityString could be admin, "admin", ["admin"]
    let authority;
    try {
        authority = JSON.parse(authorityString);
    } catch (e) {
        authority = authorityString;
    }
    if (typeof authority === 'string') {
        return [authority];
    }
    return authority || ['admin'];
}

export function setAuthority(authority) {
    const proAuthority = typeof authority === 'string' ? [authority] : authority;
    return setStorage('antd-pro-authority', JSON.stringify(proAuthority));
}
