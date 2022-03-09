/**
 * 深度克隆对象
 * @param origin 
 * @param target 
 * @returns 
 */
export function deepCloneObj(origin: any, target: any = {}) {
  const toStr = Object.prototype.toString;
  for (const prop in origin) {
    if (origin.hasOwnProperty(prop)) {  // 查看自身属性是否存在
      // 判断是数组还是对象
      if (origin[prop] !== null && typeof (origin[prop]) === 'object') {
        target[prop] = toStr.call(origin[prop]) == '[object Array]' ? [] : {};
        deepCloneObj(origin[prop], target[prop]);  // 重新克隆子级
      } else {
        target[prop] = origin[prop];
      }
    }
  }
  return target;
}

/**
 * 去除没用的字段（纯函数）
 * @param obj 扁平对象
 */
export function removeUseLessKey(obj: any) {
  const params = Object.assign({}, obj);
  for (const prop in params) {
    const flag = ['', undefined, null].includes(params[prop]);
    flag && delete params[prop];
  }
  return params;
}

/**
 * 对象是否为空
 * @param obj 
 * @returns 
 */
 export function isEmptyObject(obj = {}) {
  if (Object.keys(obj).length === 0) return true;
  else return false;
}