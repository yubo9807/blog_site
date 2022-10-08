import { api_getFriendLinkList } from '@/api/home';
import SkillItem from './components/skill-item';
import style from './module.less';
import { joinClass } from '@/utils/array';
import FriendLink from './components/friend-link';

function HomePage({ data }) {
  return (
    <div className={joinClass(style.homePage, 'clearfix')}>
      <div className={style.header}>
        <div className={joinClass('leayer', style.boundary)}>
          <div className={style.content}>
            <strong className={style.title}>Personal Technology Blog</strong>
            <p>再长的绿灯，也等不来一个不想过马路的人</p>
          </div>
        </div>
      </div>
      <div className='leayer'>
        <div className={style.skill}>
          <SkillItem
            title='运行中的 Redis'
            introduce='一个运行在 JavaScript 中的缓存数据方式，他包含了一些关于著名的 Redis 的特点：数据存储、获取、缓存时间、数据覆盖...'
            link='https://github.com/yubo9807/runing-redis'
          />
          <SkillItem
            title='Go 版 Koa 中间件'
            introduce='模仿 NodeJS Koa 框架所写的 Go 语言服务器。'
            link='https://github.com/yubo9807/go_koa'
          />
          <SkillItem
            title='自定义语言代码高亮'
            introduce='一个不断对字符进行截断并匹配正则的函数，可以对一些自定义语言代码进行高亮。'
            link=''
          />
        </div>
        {data && <FriendLink list={data.friendLinkList} />}

      </div>
    </div>
  );
}

HomePage.getInitialProps = async function() {
  const [ err, res ] = await api_getFriendLinkList();
  if (err) return;

  return {
    data: {
      friendLinkList: res.data
    }
  }
}

export default HomePage;
