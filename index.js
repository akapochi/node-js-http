'use strict';
const now = new Date();

const http = require('http');
const pug = require('pug');
const server = http
  .createServer((req, res) => {
    console.info(`[${now}] Requested by ${req.connection.remoteAddress}`)
    res.writeHead(200, {
      'Content-Type': 'text/html; charset=utf-8'
    });

    switch (req.method) {
      case 'GET':
        if (req.url === '/enquetes/yaki-shabu') {
          res.write(pug.renderFile('./form.pug', {
            path: req.url,
            firstItem: "焼き肉",
            secondItem: "しゃぶしゃぶ"
          }));
        } else if (req.url === '/enquetes/rice-bread') {
          res.write(pug.renderFile('./form.pug', {
            path: req.url,
            firstItem: "ごはん",
            secondItem: "パン"
          }));
        }
        res.end();
        break;
      case 'POST':
        let rawData = '';
        req.on('data', (chunk) => {
          rawData += chunk;
        }).on('end', () => {
          const qs = require('querystring');
          const answer = qs.parse(rawData);
          const body = `${answer['name']}さんは${answer['favorite']}に投票しました。`;
          console.info(`[${now}] ${body}`);
          res.write(`<h1>${body}</h1>`)
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
const port = process.env.PORT || 8000;
server.listen(port, () => {
  console.info(`[${now}] ポート ${port} 番でサーバー起動しました`);
});