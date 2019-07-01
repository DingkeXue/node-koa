const Koa = require('koa');
const path = require('path');
const Router = require('koa-router');
const render = require('koa-ejs');
const app = new Koa();
const router = new Router();

// 配置模板引擎
render(app, {
    root: path.join(__dirname, 'views'),
    layout: 'layout',
    viewExt: 'html',
    cache: false,
    debug: false
});

// 路由跳转
router.get('/', async ctx => {
   await ctx.render('index', {
       title: 'HELLO'
   })
});

// 配置路由
app.use(router.routes());
app.use(router.allowedMethods());

app.listen(3000);
