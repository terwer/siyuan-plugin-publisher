import express, {Request, Response} from "express";
import fetch from 'node-fetch';

const app = require('express')();
const {v4} = require('uuid');

// 解决req.body undefined
app.use(express.json());

app.get('/api', (req: Request, res: Response) => {
    const path = `/api/item/${v4()}`;
    res.setHeader('Content-Type', 'text/html');
    res.setHeader('Cache-Control', 's-max-age=1, stale-while-revalidate');
    res.end(`Hello! Go to item: <a href="${path}">${path}</a>
        <br /> or visit xmlrpc middleware <br />
        <a href="/api/middleware/xmlrpc">/api/middleware/xmlrpc</a>
    `);
});

app.get('/api/item/:slug', (req: Request, res: Response) => {
    const {slug} = req.params;
    res.end(`Item: ${slug}`);
});

/**
 * xmlrpc请求中间代理层
 */
app.post('/api/middleware/xmlrpc', async (req: Request, res: Response) => {
    const headers = req.headers;
    // console.log(headers)
    const body = req.body
    // console.log(body)

    // 获取代理参数
    console.log("body.fetchParams.apiUrl=>")
    console.log(body.fetchParams.apiUrl)
    console.log("body.fetchParams.fetchOption=>")
    console.log(body.fetchParams.fetchOption)

    // 发送真实请求并获取结果
    console.log("开的发送真实请求并获取结果")
    const rres = await fetch(body.fetchParams.apiUrl, body.fetchParams.fetchOption)
    const rresult = await rres.text()
    console.log("请求完成，准备返回真实结果")

    res.end(rresult);
});

// module.exports = app;
export default app;