import request from './request';

/**
 * 获取友情链接
 * @returns 
 */
 export function api_getFriendLinkList() {
  return request({
    url: '/friendLink',
    method: 'get',
  });
}