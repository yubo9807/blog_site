// styles
import style from './module.less';

// api
import { api_getFriendLinkList } from '@/api/home';

// component
import Header from './components/header';
import SkillItem from './components/skill-item';
import ToolsItem from './components/tools-item';
import TitleLevel from './components/title-level';
import FriendLink from './components/friend-link';

// utils
import { joinClass } from '@/utils/array';

// env
import env from '~/config/env';



function HomePage({ data }) {
  return (
    <div className={joinClass(style.homePage, 'clearfix')}>

      <Header />

      <div className='leayer'>
        <TitleLevel text='技术分享' />
        <div className={style.grid}>
          <SkillItem
            title='运行中的 Redis'
            introduce='一个运行在 JavaScript 中的缓存数据方式，他包含了一些关于著名的 Redis 的特点：数据存储、获取、缓存时间、数据覆盖...'
            link='https://github.com/yubo9807/runing-redis'
          />
          <SkillItem
            title='Go 版 koa.js 中间件'
            introduce='模仿 NodeJS Koa 框架所写的 Go 语言服务器。'
            link='https://github.com/yubo9807/go_koa'
          />
          <SkillItem
            title='自定义语言代码高亮'
            introduce='一个不断对字符进行截断并匹配正则的函数，可以对一些自定义语言代码进行高亮。'
            link=''
          />
          <SkillItem
            title='重写 koa-router'
            introduce='对 koa-router 进行重写，重点解决获取路由，企业级管理端不同角色配置菜单/接口的痛点。'
            link='https://github.com/yubo9807/koa-router'
          />
          <SkillItem
            title='axios-retry'
            introduce='Axios 请求拦截重试，解决网络慢、卡顿、上传数据丢失的问题。'
            link='https://github.com/yubo9807/axios-retry'
          />
          <SkillItem
            title='无规则毛玻璃实现'
            introduce='使用 canvas 对图片做处理，将模糊后的图片嵌入到无规则边框内。'
            link=''
          />
        </div>

        <TitleLevel text='Golang 小工具' />
        <div className={style.grid}>
          <ToolsItem
            title='静态资源服务器'
            introduce='更好的兼容了前端框架打包项目，并支持多页面应用配置。可复现部署包生产环境问题'
            filename='static'
            size='6.9MB'
            preview={<video className={style.preview} src={env.BASE_RESOURCE_URL+'/video/static.mp4'} autoPlay controls></video>}
          />
          <ToolsItem
            title='反向代理'
            introduce='启动一个反向代理服务器，并支持 https 配置。'
            filename='proxy'
            size='7.7MB'
            preview={<video className={style.preview} src={env.BASE_RESOURCE_URL+'/video/static.mp4'} autoPlay controls></video>}
          />
          <ToolsItem
            title='打卡时间提醒'
            introduce='什么时间做什么事，不要过度劳累，从此生活机械化。'
            filename='notify'
            size='2.3MB'
            preview={<img className={style.preview} src={env.BASE_RESOURCE_URL+'/imgs/notify.jpg'}></img>}
          />
          <ToolsItem
            title='获取 IP 地址'
            introduce='自己设置下环境变量，获取 IP 更加方便'
            size='2.3MB'
            filename='ip'
            preview={<video className={style.preview} src={env.BASE_RESOURCE_URL+'/video/ip.mp4'} autoPlay controls></video>}
          />
        </div>

        <TitleLevel text='友情链接' />
        {data && <FriendLink list={data.friendLinkList} />}

      </div>
    </div>
  );
}

HomePage.getInitialProps = async function() {
  const [ err, res ] = await api_getFriendLinkList();
  if (err) return Promise.reject({
    data: {
      friendLinkList: []
    }
  })

  return Promise.resolve({
    data: {
      friendLinkList: res.data
    }
  })
}

export default HomePage;
