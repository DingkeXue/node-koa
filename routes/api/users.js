const Router = require('koa-router');
const bcrypt = require('bcryptjs');
const gravatar = require('gravatar');
const tools = require('../../config/tools');
const keys = require('../../config/keys');
const jwt = require('jsonwebtoken');
const passport = require('koa-passport');
const router = new Router();

// 引入 User
const User = require('../../models/User');

/*
* @route GET /api/users/test
* @desc 测试接口地址
* @access 接口是公开的
* */
router.get('/test', test);
async function test(ctx) {
    ctx.status = 200;
    ctx.body = 'I start working ...';
}

/*
* @route POST /api/users/register
* @desc 注册接口地址
* @access 接口是公开的
* */
router.post('/register', register);
async function register(ctx) {
   // 存储到数据库
    const findResult = await User.find({email: ctx.request.body.email});
    if (findResult.length > 0) {
        ctx.status = 500;
        ctx.body = {email: '邮箱已经被占用'};
    } else {
        const body = ctx.request.body;
        const avatar = gravatar.url(body.email, {s: '200', r: 'pg', d: 'mm'});
        const newUser = new User({
            name: body.name,
            password: tools.enbcrypt(body.password),
            avatar,
            email: body.email,
            date: body.date
        });

        // 存储到数据库
        await newUser.save().then(user => {
            ctx.body = user;
        })
            .catch(err => {
                console.log(err);
            })
    }
}

/*
* @route POST /api/users/login
* @desc 登录接口地址
* @access 接口是公开的
* */
router.post('/login', login);
async function login(ctx) {
    // 首先查找数据库中是否有登录邮箱
    const body = ctx.request.body;
    const password = body.password;
    const findResult = await User.find({email: body.email});
    const user = findResult[0];

    // 如果没有查到直接返回，如果查到则对比密码是否正确
    if (findResult.length === 0) {
        ctx.status = 404;
        ctx.body = {email: '用户不存在'};
    } else {
        const result = await bcrypt.compareSync(password, user.password);

        // 如果通过
        if (result) {
            // 生成 token
            const payload = {id: user.id, name: user.name, avatar: user.avatar};
            const token = jwt.sign(payload, keys.secretOrSign, {expiresIn: '1h'});

            ctx.status = 200;
            ctx.body = {success: true, token: 'Bearer ' + token};
        } else {
            ctx.status = 404;
            ctx.body = {error: '密码错误'};
        }
    }
}

/*
* @route GET api/users/current
* @desc 当前用户接口
* @access 接口是私密的
* */
router.get('/current', passport.authenticate('jwt', { session: false }), async ctx => {
   const user = ctx.state.user;
   ctx.body = {
       id: user.id,
       name: user.name,
       avatar: user.avatar,
       email: user.email
   }
});


module.exports = router.routes();
