/**
 * 截取 location.pathname 参数
 * @param src 
 * @returns 
 */
export function pathNameSplit(src: string) {
  const arr = src && src.split(/\//);
  return arr;
}

// 滚动条滚动到某个位置
export const scrollTo = (num = 0) => {
  window.scrollTo({
    top: num,
    behavior: "smooth" 
  });
}

// 判断客户端环境
export function isClient() {
  return typeof window === 'object';
}

/**
 * 客户端打印
 * @param value 
 */
 export function client_log(...value: any[]) {
  isClient() && console.log(...value);
}

declare const cookieStore: any;
/**
 * 获取 cookie 指定参数
 * @param {*} key 要获取的 key
 * @returns 
 */
export function getCookie(key: string) {
  // if (typeof cookieStore === 'object') {
  //   const obj = await cookieStore.get(key)
  //   return obj?.value;
  // }
  const cookie = document.cookie;
  const str = cookie.replace(/\s/g, '');
  const obj = {}
  str.split(';').forEach((val: string) => {
    obj[val.split('=')[0]] = val.split('=')[1]
  })
  return obj[key];
}

interface SetCookieObj {
  name: string
  value: string
  path?: string
  expires?: number
  maxAge?: number
  domain?: string
}

/**
 * 设置 cookie
 * @param params 
 * @returns 
 */
export async function setCookie(params: SetCookieObj) {
  if (!params.name || !params.value) return;
  if (typeof cookieStore === 'object') {
    await cookieStore.set(params);
  } else {
    const obj: any = Object.assign({}, params);
    obj.value = `=${obj.value};`;
    obj.path &&= `path=${obj.path};`;
    obj.domain &&= `domain=${obj.domain};`;
    obj.maxAge &&= `maxAge=${obj.maxAge};`;
    obj.expires &&= `expires=${obj.expires};`;
    let str = '';
    for (const prop in obj) {
      str += obj[prop];
    }
    document.cookie = str;
  }
}


interface DeleteCookie {
  name: string
  path?: string
  url?: string
}
/**
 * 删除 cookie
 * @param params 
 */
export async function deleteCookie(params: DeleteCookie) {
  if (typeof cookieStore === 'object') {
    await cookieStore.delete(params);
  } else {
    document.cookie = `${params.name}=;path=${params.path};maxAge=-1;`;
  }
}

/**
 * 从一段字符中获取 innerText
 * @param str 一段可转为 html 的文本
 * @param label 标签类型
 * @returns 
 */
export function getLabelTextList(str: string, label: string) {
  if (!str) return [];
  const reg = eval('/<'+label+'(.+)?>.+<\u005c\u002f'+label+'>/g');
  const match = str.match(reg);
  if (!match) return [];
  const arr = [];
  match.forEach(val => {
    const startIndex = val.search('>');
    const endIndex = val.search('</');
    const text = val.slice(startIndex + 1, endIndex);
    arr.push(text.replace(/<.+>.+<\/.+>/, ''));
  })
  return arr;
}

/**
 * 获取当前系统环境
 */
export function getSystemEnvironment() {
  if (navigator.platform.indexOf("Win") != -1) {
    return 'windows'
  } else if (navigator.platform.indexOf("Mac") != -1) {
    return 'darwin';
  } else if (navigator.platform.indexOf("Linux") != -1) {
    return 'linux';
  } else {
    return 'unknown';
  }
}