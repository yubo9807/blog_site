import request from './request';

/**
 * 获取笔记列表
 * @returns 
 */
export function api_getNoteLabel() {
  return request.get('/note/label');
}

/**
 * 获取指定笔记文件内容
 * @returns 
 */
export function api_getNoteFile(url: string) {
  return request.get('/note/getfile', {
    params: {
      url,
    }
  })
}
