const Router = require('koa-router');
const bcrypt = require('bcryptjs');
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
    if (findResult > 0) {
        ctx.status = 500;
        ctx.body = {email: '邮箱已经被占用'};
    } else {
        const newUser = new User({
            name: ctx.request.body.name,
            password: ctx.request.body.password,
            avatar: ctx.request.body.avatar,
            email: ctx.request.body.email,
            date: ctx.request.body.date
        });

        // 对密码进行加密
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
                // Store hash in your password DB.
                if (err) throw err;
                newUser.password = hash;
            });
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
