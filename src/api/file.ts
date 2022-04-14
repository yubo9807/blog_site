
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