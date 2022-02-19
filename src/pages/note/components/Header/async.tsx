import { dynamic } from 'umi';

export default dynamic({
  loader: async function() {
    const { default: AsyncHeader } = await import(/* webpackChunkName: "note_header" */ './index');
    return AsyncHeader;
  },
});