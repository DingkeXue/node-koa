const Router = require('koa-router');
const passport = require('koa-passport');
const Profile = require('../../models/Profile');
const validateProfileInput = require('../../validation/profile');
const validateEducationInput = require('../../validation/education');
const validateExperienceInput = require('../../validation/experience');
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

/*
* @route GET api/profile/handle?handle=test
* @desc 通过handle 获取个人信息
* @access 接口是公开的
* */
router.get('/handle', async ctx => {
   const handle = ctx.query.handle;
   const errors = {};
   const profile = await Profile.find({handle: handle}).populate('user', ['name', 'avatar']);
   if (profile.length > 0) {
       ctx.body = profile[0];
   } else {
       errors.noprofile = '没有该用户的详细信息';
       ctx.status = 404;
       ctx.body = errors;
   }
});

/*
* @route GET api/profile/user?user_id=id
* @desc 通过handle 获取个人信息
* @access 接口是公开的
* */
router.get('/user', async ctx => {
    const user_id = ctx.query.user_id;
    const errors = {};
    const profile = await Profile.find({user: user_id}).populate('user', ['name', 'avatar']);
    if (profile.length > 0) {
        ctx.body = profile[0];
    } else {
        errors.noprofile = '没有该用户的详细信息';
        ctx.status = 404;
        ctx.body = errors;
    }
});

/*
* @route GET api/profile/all
* @desc 获取所有人信息
* @access 接口是公开的
* */
router.get('/all', async ctx => {
   const errors = {};
   const profile = await Profile.find({}).populate('user', ['name', 'avatar']);

   if (profile.length > 0) {
       ctx.body = profile;
   } else {
       errors.noprofiles = '没有任何详情';
       ctx.status = 404;
       ctx.body = errors;
   }
});

/*
* @route POST api/profile/experience
* @desc 添加工作经历
* @access 方法私有
* */
router.post('/experience', passport.authenticate('jwt', { session: false }), async ctx => {
   const profileFields = {};
   profileFields.experience = [];
   const body = ctx.request.body;
   const user_id = ctx.state.user.id;
   console.log(user_id);

   // 验证输入是否合法
    const {errors, isValid} = validateExperienceInput(body);
    if (!isValid) {
        ctx.status = 400;
        ctx.body = errors;
        return;
    }

    // 添加和更新数据
    const profile = await Profile.find({user: user_id});
    console.log(profile);
    if (profile.length > 0) {
        const newExp = {
            title: body.title,
            company: body.company,
            from: body.from,
            to: body.to,
            location: body.location,
            bio: body.bio,
            description: body.description,
            current: body.current
        };

        console.log(1);
        profileFields.experience.unshift(newExp);
        const experienceUpdate = await Profile.findOneAndUpdate({user: user_id}, {$set: profileFields}, {new: true});
        ctx.body = experienceUpdate;
    } else {
        errors.noprofile = '没有该用户信息';
        ctx.body = errors;
        ctx.status = 404;
    }
});

/*
* @route POST api/profile/education
* @desc 添加学习经历
* @access 方法私有
* */
router.post('/education', passport.authenticate('jwt', { session: false }), async ctx => {
    const profileFields = {};
    profileFields.education = [];
    const body = ctx.request.body;
    const user_id = ctx.state.user.id;

    // 验证输入是否合法
    const {errors, isValid} = validateEducationInput(body);
    if (!isValid) {
        ctx.status = 400;
        ctx.body = errors;
        return;
    }

    // 添加和更新数据
    const profile = await Profile.find({user: user_id});

    if (profile.length > 0) {
        const newEdu = {
            school: body.school,
            degree: body.degree,
            from: body.from,
            to: body.to,
            fieldofstudy: body.fieldofstudy,
            bio: body.bio,
            description: body.description,
            current: body.current
        };

        console.log(1);
        profileFields.education.unshift(newEdu);
        const experienceUpdate = await Profile.findOneAndUpdate({user: user_id}, {$set: profileFields}, {new: true});
        ctx.body = experienceUpdate;
    } else {
        errors.noprofile = '没有该用户信息';
        ctx.body = errors;
        ctx.status = 404;
    }
});

module.exports = router.routes();
