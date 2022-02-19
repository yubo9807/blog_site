/**
 * @description: 检查对象类型
 * @param {any} o 任意值
 * @return 返回一个实际类型
 */
export function isType(o: any): string {
  return Object.prototype.toString.call(o).slice(8, -1).toLowerCase()
}
