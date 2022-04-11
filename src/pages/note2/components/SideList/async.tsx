import { dynamic } from 'umi';

export default dynamic({
  loader: async function() {
    const { default: AsyncNavTabs } = await import(/* webpackChunkName: "note_nav" */ './index');
    return AsyncNavTabs;
  },
});