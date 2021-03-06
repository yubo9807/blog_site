import { dynamic } from 'umi';
import { Skeleton } from 'antd';

const Loading = dynamic({
  loader: async function() {
    const { default: Skeleton } = await import(/* webpackChunkName: "loading" */'antd/es/skeleton') 
    return Skeleton;
  }
})

export default dynamic({
  loader: async function() {
    const { default: AsyncMarkdown } = await import(/* webpackChunkName: "markdown" */ './index');
    return AsyncMarkdown;
  },
  loading: Skeleton
});