import { dynamic } from 'umi';
import Loading from '@/components/Loading'

export default dynamic({
  loader: async function() {
    const { default: AsyncAnchorLink } = await import(/* webpackChunkName: "note_anchor_link" */ './index');
    return AsyncAnchorLink;
  },
  loading: Loading,
});