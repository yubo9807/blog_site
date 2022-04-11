
import request from './request';

/**
 * 获取文件内容或子目录
 * @param filename
 */
export function api_getFileContentOrChildDirectory(filename: string) {
  return request({
    url: '/file',
    method: 'get',
    params: { path: filename }
  })
}