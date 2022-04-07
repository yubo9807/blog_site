import request from './request';

/**
 * 上传头像
 */
export function api_uploadPortrait(file: File){
  const formData = new FormData();
  formData.append('file', file);
  return request({
    url: '/upload/portrait',
    method: 'post',
    data: formData,
  });
}