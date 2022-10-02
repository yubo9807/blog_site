import { api_getFriendLinkList } from '@/api/home';
import TitleLevel from './components/TitleLevel';
import FriendLink from './components/FriendLink';

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
  const [ err, res ] = await api_getFriendLinkList();
  if (err) return;

  return {
    data: {
      friendLinkList: res.data
    }
  }
}

export default HomePage;
