import { randomNum } from "./number";

/**
 * 生成一个随机字符串，充当id用
 */
export function createRandomString() {
  const time = Date.now();
  const num = 100000;
  const random = randomNum(num * 10);
  const str = (BigInt(time * num) + BigInt(random)).toString(32);
  return str.split('').sort(() => Math.random() - .5).join('');
}

/**
 * 生成随机颜色
 */
export function createColor(min = '000000', max = 'ffffff') {
  const minNumber = parseInt(min, 16), maxNumber = parseInt(max, 16);
  return '#' + randomNum(maxNumber, minNumber).toString(16);
}
