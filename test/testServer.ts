import express, * as express_test from "express"
import {Request, Response} from "express";
import fetch from 'node-fetch';

// Create a new express application instance
const app: express.Application = express();

//设置CORS
app.all('*', function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*'); //当允许携带cookies此处的白名单不能写’*’
    res.header('Access-Control-Allow-Headers', 'content-type,Content-Length,Authorization,Origin,Accept,X-Requested-With'); //允许的请求头
    res.header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, PUT, DELETE'); //允许的请求方法
    res.header('Access-Control-Allow-Credentials', 'true');  //允许携带cookies
    next();
});
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
    res.send('Hello World!');
});

app.get('/api', (req: Request, res: Response) => {
    res.setHeader('Content-Type', 'text/html');
    res.setHeader('Cache-Control', 's-max-age=1, stale-while-revalidate');
    res.end(`visit xmlrpc middleware <br />
        <a href="/api/middleware/xmlrpc">/api/middleware/xmlrpc</a>
    `);
});

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

app.listen(3000, () => {
    console.log('Example app listening on port 3000!');
});

export default {}