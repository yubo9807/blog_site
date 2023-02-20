import style from './module.less';

// npm
import { KeepAlive } from 'umi';
import { useEffect, useState } from 'react';
import { joinClass } from '@/utils/array';
import { dateFormater, getTimeDistance } from '@/utils/date';
import env from '~/config/env';

const AboutPage = () => {

  const birthDate     = new Date('1998-07-22').getTime();
  const nowYear       = new Date(''+(new Date().getFullYear())).getTime();
  const workStartDate = new Date('2020-03-01').getTime();
  const workDuration  = (getTimeDistance((Date.now() - workStartDate) / 1000).day / 365).toFixed(2);
  const phone         = '15581766609';

  const meList = [
    { label: '姓名',    value: '杨宇波' },
    { label: '性别',    value: '男' },
    { label: '出生年月', value: dateFormater(birthDate, 'YYYY.MM') },
    { label: '年龄',    value: Math.ceil(getTimeDistance((nowYear - birthDate) / 1000).day / 365) },
    { label: '开发经验', value: workDuration+' 年' },
    { label: '联系方式', value: phone+'（微信同号）', link: 'tel:'+phone },
    { label: '籍贯',    value: '山西 长治' },
    // { label: '在线简历', value: '预览', link: '' },
  ]

  const AboutMe = () => (<div className={style.wrap}>
    <h2 className={style.title}>个人简介</h2>
    <ul>{meList.map((val, index) => <li key={index}>
      <strong>{val.label}</strong>：{val.link ? <a href={val.link}>{val.value}</a> : val.value}
    </li>)}</ul>
  </div>)

  const [blogAddress, setBlogAddress] = useState('');

  useEffect(() => {
    setBlogAddress(location.origin);
  }, [])

  const blogList = [
    {
      label: '站点',
      value: blogAddress,
      link: '/',
      codeAddr: 'blog_site',
      describe: 'Umi、Ant Design、TypeScript',
    },
    {
      label: '后台管理',
      value: blogAddress+'/wide',
      link: '/wide',
      codeAddr: 'blog_server',
      describe: 'Vue3、Element-Plus、Echarts、TypeScript',
    },
    {
      label: '接口服务',
      value: env.BASE_API,
      link: env.VISIT_ORIGIN,
      codeAddr: 'wide',
      describe: 'Koa、TypeScript',
    },
  ]

  const AboutBlog = () => (<div className={style.wrap}>
    <h2 className={style.title}>关于博客</h2>
    <ul>{blogList.map((val, index) => <li key={index}>
      <strong>{val.label}</strong>：
      <ul>
        <li>预览地址：
          <a href={val.link}>{val.value}</a>
        </li>
        <li>代码仓库：
          <a className={style.jump} href={'https://github.com/yubo9807/'+val.codeAddr} target='_blank'>GitHub</a>
        </li>
        <li>应用技术：{val.describe}</li>
      </ul>
    </li>)}</ul>
  </div>)

  return (<div className={joinClass('leayer', style.aboutPage)}>
    <AboutMe />
    <AboutBlog />
  </div>)
}

// export default AboutPage;

export default () => {
  const [ isRender, setIsRender ] = useState(false);
  useEffect(() => {
    setIsRender(true);
  }, [])
  return (<>{isRender
    ? <KeepAlive when={true}>
      <AboutPage />
    </KeepAlive>
    : <AboutPage />}
  </>)
};