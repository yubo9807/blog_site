import http from 'http';
import Koa from 'koa';
import koaStatic from 'koa-static';
import intercept from './middleware/intercept';
import render from './middleware/render';
import access from './middleware/access';
import env from './env';

const app = new Koa();
const server = http.createServer(app.callback());

// 请求拦截
app.use(intercept);

// 服务端渲染
app.use(render);

// 访问记录
app.use(access);

// 静态文件
app.use(koaStatic(env.BASE_WWW_URL));


const port = 20000;
server.listen(port, () => {
  console.log(`服务已启动... http://localhost:${port}`);
})
