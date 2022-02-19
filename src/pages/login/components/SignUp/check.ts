import { dataCheck, isType, errorSet, isNotEmpty, isMail, Constructor } from '@/utils/decorate';

// 验证字符长度
function limit(min = 1, max = 20) {
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

    static newPassword = data.newPassword;

    @isMail
    @isType('string')
    static mail = data.mail;

    static mailCode = data.mailCode

    // 其他验证
    static verification() {
      if (this.password !== this.newPassword) errorSet.add('两次密码不一致');
      if (this.mail && !this.mailCode) errorSet.add('请输入邮箱验证码');
    }

    static modifyTips() {
      this.verification();
      const arr = Array.from(errorSet);
      const newArr = arr.map((val: string) => {
        return val.replace('username ', '账号')
                  .replace('password ', '密码');
      })
      return newArr;
    }

  }

  return User.modifyTips();
}