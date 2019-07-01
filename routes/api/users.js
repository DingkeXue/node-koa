const Router = require('koa-router');
const bcrypt = require('bcryptjs');
const gravatar = require('gravatar');
const tools = require('../../config/tools');
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
* @desc 测试接口地址
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
        const avatar = gravatar.url(ctx.request.body.email, {s: '200', r: 'pg', d: 'mm'});
        const newUser = new User({
            name: ctx.request.body.name,
            password: tools.enbcypt(ctx.request.body.password),
            avatar,
            email: ctx.request.body.email,
            date: ctx.request.body.date
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

module.exports = router.routes();
