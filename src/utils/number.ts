/**
 * 数字生成器
 * @call const iter = createNum(); iter.next();
 */
export function *createNum() {  // 生成器函数传参毫无意义
  let n = 0
  while (true) {
    yield n;
    n++;
  }
}

/**
 * 生成随机数
 * @param max 最大值（取不到）
 * @param min 最小值
 */
export function randomNum(max: number, min: number = 0) {
  return Math.floor(Math.random() * (max - min) + min);
}
