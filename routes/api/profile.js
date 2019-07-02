const Router = require('koa-router');
const passport = require('koa-passport');
const mongoose = require('mongoose');
const Profile = require('../../models/Profile');
const router = new Router();

/*
* @routes GET api/profile/test
* @desc 个人详情接口测试
* @access 接口私有
* */
router.get('/test', getProfile);
async function getProfile(ctx) {
    ctx.body = 'Profile is working...'
}

/*
* @route GET api/users/current
* @desc 当前用户接口
* @access 接口是私密的
* */
router.get('/', passport.authenticate('jwt', { session: false }), async ctx => {
    const user = ctx.state.user;
    const profile = await Profile.find({user: user.id}).populate('user', ['name', 'avatar']);

    if (profile.length > 0) {
        ctx.status = 200;
        ctx.body = profile;
    } else {
        ctx.status = 404;
        ctx.body = {noprofile: '暂无该用户信息'};
        return;
    }
});

module.exports = router.routes();
