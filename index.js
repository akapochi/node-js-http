'use strict';
const now = new Date();

const http = require('http');
const server = http
  .createServer((req, res) => {
    console.info(`[${now}] Requested by ${req.connection.remoteAddress}`)
    res.writeHead(200, {
      'Content-Type': 'text/html; charset=utf-8'
    });

    switch (req.method) {
      case 'GET':
        const fs = require('fs');
        const rs = fs.createReadStream('./form.html');
        rs.pipe(res);
        break;
      case 'POST':
        let rawData = '';
        req.on('data', (chunk) => {
          rawData += chunk;
        }).on('end', () => {
          const decoded = decodeURIComponent(rawData);
          console.info(`${now} 投稿: ${decoded}`);
          res.write(`<h1>${decoded}が投稿されました。</h1>`)
          res.end();
        });
        break;
      default:
        break;
    }
  })
  .on('error', e => {
    console.error(`[${now}] Server Error`, e);
  })
  .on('clientError', e => {
    console.error(`[${now}] Client Error`, e);
  });
const port = 8000;
server.listen(port, () => {
  console.info(`[${now}] ポート ${port} 番でサーバー起動しました`);
});