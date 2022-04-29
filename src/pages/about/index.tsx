// npm
import { KeepAlive } from 'umi';
import { Typography } from 'antd';
import { useEffect, useState } from 'react';


const { Title, Paragraph, Text, Link } = Typography;

const AboutPage = () => {
  const [count, setCount] = useState(0);
  return (<div className='leayer'>
    <button onClick={() => setCount(count + 1)}>{ count }</button>
    <Typography>
      <Title level={3}>开发日志</Title>
      <Title level={4}>博客改版：</Title>
      <Paragraph>2021/06</Paragraph>
      <Paragraph><Link href='/'>博客站点：</Link><Text code>umi</Text></Paragraph>
      <Paragraph><Link href='http://hpyyb.cn/vise'>后台管理：</Link><Text code>Vue3</Text></Paragraph>
      <Paragraph><Link href='http://hpyyb.cn/api'>后端：</Link><Text code>Koa</Text></Paragraph>
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