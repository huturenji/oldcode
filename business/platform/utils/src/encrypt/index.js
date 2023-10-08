/*
 * @Author: your name
 * @Date: 2020-11-12 15:28:44
 * @LastEditTime: 2020-11-13 10:56:32
 * @LastEditors: Please set LastEditors
 * @Description: 加解密
 * @FilePath: \utils\src\.\encrypt.js
 */
import {
    b64_md5
  } from 'src/encrypt/crypt/md5.js';
  import {
    hex_sha1
  } from 'src/encrypt/crypt/sha1';
/**
 * hash加密方法
 * @param type:加密类型1是MD5，2是SHA1。
 * 
 * 
 */
export function hashEncrypt(type, source) {
    var result = "";
    switch (type) {
      case 1:
        result = b64_md5(source);
        break;
      case 2:
        result = hex_sha1(source);
        break;
      default:
        break;
    }
    return result;
  }