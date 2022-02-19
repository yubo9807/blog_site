import { dataCheck, isNotEmpty, numberRange, isType, arrayItemType, errorSet, Constructor } from '@/utils/decorate';

export default (data: any) => {
  errorSet.clear();  // 先把 Set 数据清空下，防止多次调用

  // 后端数据不规范，在这里处理
  // data.remark ??= ''

  @dataCheck(data)
  class UserInfo {
    @isType('string')
    @isNotEmpty
    static username = data.name;  // 数据中有 name 时，换个名字

    @isType('string')
    @isNotEmpty
    static role = data.role;

    @isType('string')
    static remark = data.remark;

    @isType('number')
    static is_receive = data.is_receive;

  }

  return UserInfo
}