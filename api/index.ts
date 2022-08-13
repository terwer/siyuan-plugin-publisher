const app = require('express')();
const {v4} = require('uuid');

app.get('/api', (req: any, res: any) => {
    const path = `/api/item/${v4()}`;
    res.setHeader('Content-Type', 'text/html');
    res.setHeader('Cache-Control', 's-max-age=1, stale-while-revalidate');
    res.end(`Hello! Go to item: <a href="${path}">${path}</a>`);
});

app.get('/api/item/:slug', (req: any, res: any) => {
    const {slug} = req.params;
    res.end(`Item: ${slug}`);
});

app.get('/api/middleware/xmlrpc/:type', (req: any, res: any) => {
    const {type} = req.params;
    res.end(`type: ${type}`);
});

// module.exports = app;
export default app;