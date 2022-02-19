import { api_getFriendLinkList } from '@/api/home';
import TitleLevel from '@/components/TitleLevel';
import FriendLink from './components/FriendLink';
import SkillShare from './components/SkillShare';
import * as staticData from './static-data';

function HomePage({ data }) {
  return (
    <div className='leayer'>
      {data && <>
        {/* <TitleLevel text='技术分享' />
        <SkillShare list={staticData.skillShareList} /> */}
        
        {/* <TitleLevel text='关于我' /> */}
        
        <TitleLevel text='友情链接' />
        <FriendLink list={data.friendLinkList} />
      </>}

    </div>
  );
}

HomePage.getInitialProps = async function() {
  const friendLinkList = await getFriendLinkList();

  return {
    data: {
      friendLinkList
    }
  }

}

export default HomePage;

// 获取友情链接
async function getFriendLinkList() {
  const response: any = await api_getFriendLinkList();
  if (response.code === 200) {
    return response.data;
  }
}