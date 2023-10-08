/*
 功能：证件类型相关数据
author：yg
date：2018年11月21日
 */
/**
 * 证件类型Arr
 */
export const IDTypeArr = [
	{key: 0, value: '身份证'},
	{key: 1, value: '护照'},
	{key: 4, value: '港澳通行证'},
	{key: 5, value: '台胞证（台湾居民往来大陆通行证）'},
	{key: 6, value: '台湾通行证'},
	{key: 7, value: '回乡证（港澳居民往来内地通行证）'},
	{key: 8, value: '外国人永久居留身份证'},
	{key: 9, value: '其他'}
];
    
/**
 * 英文名显示证件类型
 */
export const surnameIDMap = {
	"1":'护照'
};
/**
 * 显示英文名
 * IDCode  证件类型
 */
export function showSurname(IDCode){
	if(IDCode == null || IDCode == undefined){return false}
	return !!surnameIDMap[IDCode.toString()];
};

