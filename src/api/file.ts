
import request from './request';

/**
 * 获取文件内容或子目录
 * @param filename
 */
export function api_getFileContentOrChildDirectory(filename: string) {
  return request({
    url: '/file/read',
    method: 'get',
    params: { path: filename }
  })
}

/**
 * 文件搜索
 * @param basePath 基本路径
 * @param keyword 关键字
 */
 export function api_fileContentSearch(basePath: string, text: string) {
  return request({
    url: '/file/search',
    method: 'get',
    params: { basePath, text }
  })
}

/**
 * 上传头像
 */
export function api_uploadPortrait(file: File){
  const formData = new FormData();
  formData.append('file', file);
  return request({
    url: '/file/upload/portrait',
    method: 'post',
    data: formData,
  });
}