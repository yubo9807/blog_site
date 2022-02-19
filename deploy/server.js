const express = require('express');
const app = new express();

app.use(express.static('./dist'));

app.use(async (req, res) => {
  const render = require('./dist/umi.server');
  res.setHeader('Content-Type', 'text/html');
  
  const context = {};
  const { html, error, rootContainer } = await render({
    path: req.url,
    context,
  });
  
  res.send(html);
});

const port = 20000
app.listen(port, (err) => {
  err && console.log(err);
  console.log(`服务已启动... http://localhost:${port}`);
});
