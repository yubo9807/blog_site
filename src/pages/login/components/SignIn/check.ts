import { dataCheck, isType, errorSet, isNotEmpty } from '@/utils/decorate';

// 验证长度
export function limit(min = 1, max = 20) {
  return (target: any, key: string) => {
    target[key] ||= '';
    const len = target[key].length;
    const str = `${key} 请输入 ${min}~${max} 个字符`;
    if (len >= min && len <= max) return;
    else errorSet.add(str);
  }
}

export default (data: any) => {
  errorSet.clear();

  @dataCheck(data)
  class User {
    @limit()
    @isType('string')
    @isNotEmpty
    static username = data.username;

    @limit(6, 20)
    @isType('string')
    @isNotEmpty
    static password = data.password;

    static modifyTips() {
      const arr = Array.from(errorSet);
      arr.forEach((val: string, index: number) => {
        arr[index] = val.replace('username ', '账号')
                        .replace('password ', '密码');
      })
      return arr;
    }

  }

  return User.modifyTips();
}