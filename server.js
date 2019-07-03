const Router = require('koa-router');
const mongoose = require('mongoose');
const Koa = require('koa');
const passport = require('koa-passport');
const mongoURI = require('./config/keys').mongodbURI;
const bodyParser = require('koa-bodyparser');

// 引入api
const users = require('./routes/api/users');
const profile = require('./routes/api/profile');
const posts = require('./routes/api/posts');

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

// 解析 form
server.use(bodyParser());

// 使用passport
server.use(passport.initialize());
server.use(passport.session());
require('./config/passport')(passport);

//路由跳转
router.get('/', async ctx => {
    ctx.body = "hello"
});

// 路由分发
router.use('/api/users', users);
router.use('/api/profile', profile);
router.use('/api/posts', posts);


// 配置路由
server.use(router.routes());
server.use(router.allowedMethods());

const port = process.env.PORT || 5000;

server.listen(port, () => {
    console.log(`server started on ${port}`);
});
