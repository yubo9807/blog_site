
export const errorSet = new Set([]);

// 不能为空
export function isNotEmpty(describe: string, obj = {}) {
  return (target: any, key: string) => {
    const str = '请输入' + describe;
    if (['', undefined, null].includes(obj[key])) {
      errorSet.add(str);
    } else {
      errorSet.delete(str);
    }
  }
}

// 验证长度
export function limit(describe, obj = {}, min = 1, max = 20) {
  return (target: any, key: string) => {
    obj[key] ||= '';
    const len = obj[key].length;
    const str = `${describe}：请输入 ${min}-${max} 个字符`;
    if (len >= min && len <= max) errorSet.delete(str);
    else errorSet.add(str);
  }
}

