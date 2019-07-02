const Router = require('koa-router');
const passport = require('koa-passport');
const Profile = require('../../models/Profile');
const validateProfileInput = require('../../validation/profile');
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
* @route GET api/profile
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

/*
* @route POST api/profile
* @desc 更新个人信息接口
* @access 接口是私密的
* */
router.post('/', passport.authenticate('jwt', { session: false }), async ctx => {
    // 首先验证输入内容
    const { errors, isValid } = validateProfileInput(ctx.request.body);
    if (!isValid) {
         ctx.status = 400;
         ctx.body = errors;
         return;
    }

    const profileFields = {};
    const user = ctx.state.user;
    profileFields.social = {};
    const body = ctx.request.body;

    // 对输入信息进行录入
    profileFields.user = user.id;
    if (body.handle) {
        profileFields.handle = body.handle;
    }
    if (body.location) {
        profileFields.handle = body.location;
    }
    if (body.company) {
        profileFields.company = body.company;
    }
    if (body.status) {
        profileFields.status = body.status;
    }
    if (body.website) {
        profileFields.website = body.website;
    }
    if (body.bio) {
        profileFields.bio = body.bio;
    }
    if (typeof body.skills !== "undefined") {
        profileFields.skills = body.skills.split(',');
    }
    if (body.QQ) {
        profileFields.social.QQ = body.QQ;
    }
    if (body.wechat) {
        profileFields.social.wechat = body.wechat;
    }

    // 查询数据库
    const profile = await Profile.find({user: user.id});
    if (profile.length > 0) {
        const profileUpdate = await Profile.findOneAndUpdate({user: user.id},
            {$set: profileFields},
            {new: true});
        ctx.body = profileUpdate;
    } else {
        await new Profile(profileFields).save();
        ctx.status = 200;
        ctx.body = profile;
    }
});

module.exports = router.routes();
