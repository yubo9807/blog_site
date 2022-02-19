export const reg_mial = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;

/**
 * 验证正则是否通过
 * @param reg 正则
 * @param str 要验证的字符串
 * @returns 
 */
export function isRegular(reg: RegExp, str: string) {
  return reg.test(str);
}