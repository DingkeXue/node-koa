const Koa = require('koa');
const path = require('path');
const Router = require('koa-router');
const render = require('koa-ejs');
const app = new Koa();
const router = new Router();

let msg = [
    {
        name:'bar'
    },
    {
        name: 'foo'
    }
];

// 配置模板引擎
render(app, {
    root: path.join(__dirname, 'views'),
    layout: 'layout',
    viewExt: 'html',
    cache: false,
    debug: false
});

// 路由跳转
router.get('/', index);
router.get('/add', login);

async function index(ctx) {
    await ctx.render('index', {
        title: 'HELLO KOA',
        msg
    })
}

async function login(ctx) {
    await ctx.render('add')
}

// 配置路由
app.use(router.routes());
app.use(router.allowedMethods());

app.listen(3000);
