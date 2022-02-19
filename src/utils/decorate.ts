import { isType as inspectType } from './validate';
import { reg_mial, isRegular } from './regular';

export type Constructor = new () => object
export const errorSet = new Set();

/**
 * @description: 数据校验不通过，打印错误信息（类装饰器）
 * @param {any} data 要校验的数据
 * @returns
 */
export function dataCheck(data: any) {
  return (target: Constructor) => {
    if (errorSet.size > 0) {
      console.log('数据校验: 原数据 >> ', data);
      console.table(Array.from(errorSet));
    }
  }
}

// 值是否为空
export function isNotEmpty(target: Constructor, key: string) {
  const value = target[key]
  if (['', undefined, null].includes(value)) {
    errorSet.add(`${key} 不能为空`);
  }
}

/**
 * @description: 类型校验
 * @param {string} type 实际类型
 * @returns
 */
export function isType(type: string) {
  return (target: Constructor, key: string) => {
    const targetType = inspectType(target[key])
    if (targetType !== type) {
      errorSet.add(`${key} 类型应为 ${type}，实际收到类型为 ${targetType}`);
    }
  }
}

/**
 * @description: 校验数值范围
 * @param {number} min 最小值
 * @param {number} max 最大值
 * @returns
 */
export function numberRange(min = 0, max = 120) {
  return (target: Constructor, key: string) => {
    const value = target[key]
    if (value <= min || value > max) { errorSet.add(`${key} 取值 ${min}～${max}，实际收到值为 ${value}`) }
  }
}

/**
 * @description: 校验数组每一项类型
 * @param {string} type 实际类型
 * @returns
 */
export function arrayItemType(type: string | string[]) {
  return (target: Constructor, key: string) => {
    const arr = target[key];
    if (inspectType(arr) !== 'array') {
      errorSet.add(`${key} 类型应为 array，实际收到类型为 ${inspectType(arr)}`);
      return;
    }
    arr.forEach((val: any, index: number) => {
      const originType = inspectType(val);
      if (inspectType(type) === 'string' && type !== originType) {
        errorSet.add(`${key}[${index}] 类型应为 ${type} 类型，实际收到类型为 ${originType}`);
      } else if (inspectType(type) === 'array' && !type.includes(originType)) {
        errorSet.add(`${key}[${index}] 类型应为 ${type.toString().replaceAll(',', '|')} 类型，实际收到类型为 ${originType}`);
      }
    })
  }
}

// 验证邮箱格式是否正确
export function isMail(target: Constructor, key: string) {
  const value = target[key];
  if (value === '') return;
  if (!isRegular(reg_mial, value)) {
    errorSet.add(`邮箱格式错误`);
  }
}

// 将对象改为可枚举
export function enumerable(target: Constructor, key: string, descriptor: PropertyDescriptor) {
  // console.log(target, key, descriptor)
  descriptor.enumerable = true;
}

/**
 * 方法过期提示
 * @param newMethod 新方法名
 * @returns 
 */
export function useless(newMethod: string) {
  return (target: Constructor, key: string, descriptor: PropertyDescriptor) => {
    descriptor.value = () => {
      console.log(`${key} 方法已弃用，取代它的是 ${newMethod}`);
    }
  }
}
