import style from './module.less';

// npm
import { KeepAlive } from 'umi';
import { Typography } from 'antd';
import { useEffect, useState } from 'react';
import { joinClass } from '@/utils/array';


const { Title, Paragraph, Text, Link } = Typography;

const AboutPage = () => {
  return (<div className={joinClass('leayer', style.aboutPage)}>
    <Typography>

      <Title level={3}>你好，我叫杨宇波！</Title>
      <Paragraph>
        <ul>
          <li>2 年前端开发工作经验</li>
          <li>98 年的老虎</li>
          <li>山西 长治，现居北京</li>
          <li>wx：weixinvip00000</li>
        </ul>
      </Paragraph>

      <Title level={3}>博客链接：</Title>
      <Paragraph>
        <ul>
          <li>
            博客站点：
            <Link href='/'>http://hpyyb.cn/</Link>
            <Link href='https://github.com/yubo9807/blog_site' target="_blank">代码地址</Link>  
            <ul>
              <li>
                <Text code>Umi</Text>，
                <Text code>Ant Design</Text>，
                <Text code>TypeScript</Text>
              </li>
            </ul>
          </li>
          <li>
            后台管理：
            <Link href='/vise'>http://hpyyb.cn/vise</Link>
            <Link href='https://github.com/yubo9807/blog_vise' target="_blank">代码地址</Link>
            <ul>
              <li>
                <Text code>Vue3</Text>，
                <Text code>Element-Plus</Text>，
                <Text code>Echarts</Text>，
                <Text code>TypeScript</Text>
              </li>
            </ul>
          </li>
          <li>
            后端服务：
            <Link href='/api'>http://hpyyb.cn/api</Link>
            <Link href='https://github.com/yubo9807/blog_server' target="_blank">代码地址</Link>
            <ul>
              <li>
                <Text code>Koa</Text>，
                <Text code>TypeScript</Text>
              </li>
            </ul>
          </li>
        </ul>
      </Paragraph>
    </Typography>
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