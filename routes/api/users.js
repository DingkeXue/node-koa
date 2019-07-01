const Router = require('koa-router');
const router = new Router();

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

module.exports = router.routes();
