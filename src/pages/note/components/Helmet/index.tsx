import { getLabelTextList } from "@/utils/browser";
import { Helmet } from "umi";


export default ({ html }) => {
  // 爬虫喜欢的东西
  const title = getLabelTextList(html, 'h1')[0];
  const keywords = getLabelTextList(html, 'h2')
                   .concat(getLabelTextList(html, 'h3'))
                   .concat(getLabelTextList(html, 'h4'))
                   .toString();
  const description = getLabelTextList(html, 'p').toString();

  return <Helmet>
    <title>{title}</title>
    {keywords && <meta name='keywords' content={keywords} />}
    {description && <meta name='description' content={description} />}

    <meta name='twitter:title' content={title} />
    <meta name='twitter:description' content={description} />
  </Helmet>
}