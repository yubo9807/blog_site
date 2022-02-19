import { Typography, Divider } from 'antd';
const { Title, Paragraph, Text, Link } = Typography;

const AboutPage = () => {
  return (<div className='leayer'>
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

export default AboutPage;