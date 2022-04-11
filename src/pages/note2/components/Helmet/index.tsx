import { getLabelTextList } from "@/utils/browser";
import { Helmet } from "umi";


export default ({ html, data }) => {
  // 爬虫喜欢的东西
  const lastCrumb = data && data.crumb[data.crumb.length - 1]?.folder;
  const h1Text = getLabelTextList(html, 'h1')[0] || getLabelTextList(html, 'h2')[0];
  const title = lastCrumb === h1Text ? lastCrumb : lastCrumb + ' | ' + h1Text;
  const keywords = h1Text + ',' + getLabelTextList(html, 'h2').toString();
  const description = getLabelTextList(html, 'p').toString();

  return <Helmet>
    <title>{title}</title>
    <meta name='keywords' content={keywords} />
    {description && <meta name='description' content={description} />}

    <meta name='twitter:title' content={title} />
    <meta name='twitter:description' content={description} />
  </Helmet>
}