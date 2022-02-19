import { dynamic } from 'umi';

// 将 Spin 组件变为异步组件，分包时 antd 不会打包到 umi 中
const Loading = dynamic({
  loader: async function() {
    const { default: Spin } = await import(/* webpackChunkName: "loading" */'antd/es/spin') 
    return Spin;
  },
  loading: () => <></>
})

export default () => {
  return <div>
    <Loading delay={300} />
  </div>
}
