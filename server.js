const Router = require('koa-router');
const mongoose = require('mongoose');
const Koa = require('koa');
const mongoURI = require('./config/keys').mongodbURI;

mongoose.connect(mongoURI, {
    useNewUrlParser: true })
    .then(() => {
        console.log('mongoose connected');
    })
    .catch(err => {
        console.log(err);
    });

const server = new Koa();
const router = new Router();

//路由跳转
router.get('/', async ctx => {
    ctx.body = "hello"
});

// 配置路由
server.use(router.routes());
server.use(router.allowedMethods());

const port = process.env.PORT || 5000;

server.listen(port, () => {
    console.log(`server started on ${port}`);
});
