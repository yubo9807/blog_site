const http = require('http');
const Koa = require('koa');
const koaStatic = require('koa-static');
const { extname, resolve } = require('path');
const axios = require('axios');

const app = new Koa();
const server = http.createServer(app.callback());

let render = null;
app.use(async (ctx, next) => {

  const ext = extname(ctx.request.path);
  const staticExt = ['.css', '.js', '.ico', '.txt', '.png', '.jpg', '.gif', '.ttf', '.woff', '.worf2'];
  if (staticExt.includes(ext)) {
    await next(); // 走静态文件
    return;
  }
  
  if (!render) {
    render = require('./dist/umi.server');
  }

  ctx.type = 'text/html';
  ctx.status = 200;

  const path = ctx.url;
  
  const { html, error, rootContainer } = await render({ path });

  ctx.body = html;

  if (error) {
    console.log(error);
    ctx.throw(500, error);
  }

  // 访问信息发送给后端
  if (path.startsWith('/api')) return;

  const data = ctx.headers;
  for (const key in data) {
    data[key] = data[key].replace(/\"/g, '');
  }

  axios({
    method: 'post',
    url: 'http://127.0.0.1:20010/api/access',
    data: {
      info: Object.assign(data, {
        accessTime: Math.floor(Date.now() / 1000),
        url: path,
      }),
    },
  })

})

// 静态资源
app.use(koaStatic(resolve(__dirname + '/dist')));


const port = 20000;
server.listen(port, () => {
  console.log(`服务已启动... http://localhost:${port}`);
})
