/**
 * 连接 class
 * @param args 剩余参数
 * @returns 
 */
export function joinClass(...args: string[]) {
  return args.join(' ').trim().replace(/\s+/, ' ');
}
