const Router = require('koa-router');
const passport = require('koa-passport');
const Post = require('../../models/Post');
const Profile = require('../../models/Profile');
const validatePostInput = require('../../validation/post');
const router = new Router();

/*
* @route GET api/posts/test
* @desc 用户评论和点赞接口测试
* @access 接口公开的
* */
router.get('/test', async ctx => {
   ctx.body = 'POST started working...'
});

/*
* @route POST api/posts
* @desc 用户评论接口
* @access 接口私有的
* */
router.post('/', passport.authenticate('jwt', { session: false }), async ctx => {
   const user = ctx.state.user;
   const body = ctx.request.body;

   // 输入验证
    const { errors, isValid } = validatePostInput(body);
    if (!isValid) {
        ctx.body = errors;
        ctx.status = 400;
        return;
    }

   const newPost = new Post({
       text: body.text,
       name: body.name,
       avatar: body.avatar,
       user: user.id
   });

   await newPost.save().then(post => ctx.body = post).catch(err => ctx.body = err);
   ctx.status = 200;
});

/*
* @route GET api/posts/all
* @desc 获取用户评论接口
* @access 接口公开的
* */
router.get('/all', async ctx => {
    const posts = await Post.find({}).sort({date: -1});
    if (posts.length > 0) {
        ctx.body = posts;
        ctx.status = 200;
    } else {
        ctx.body = "暂无任何评论";
        ctx.status = 200;
    }
});

/*
* @route GET api/posts?id=id
* @desc 获取单个评论接口
* @access 接口公开的
* */
router.get('/', async ctx => {
    const post_id = ctx.query.id;

    await Post.findById(post_id)
        .then(post => {
            ctx.body = post;
            ctx.status = 200;
        })
        .catch(err => {
        err.nopost = '暂无任何评论';
        ctx.body = nopost;
        ctx.status = 200;
    })
});

/*
* @route DELETE api/posts?id=id
* @desc 删除单个评论接口
* @access 接口私有的
* */
router.delete('/',passport.authenticate('jwt', { session: false }), async ctx => {
   const del_id = ctx.query.id;
   const user_id = ctx.state.user.id;

   // 查看该用户是否有详情
    const profile = await Profile.find({user: user_id});

    if (profile.length > 0) {
        // 查找该用户留言
        const post = await Post.findById(del_id);

        // 判断是否本人操作
        if (post.user.toString() !== user_id) {
            ctx.status = 401;
            ctx.body = '未授权';
            return;
        } else {
            await Post.deleteOne({_id: del_id})
                .then(() => {
                ctx.status = 200;
                ctx.body = {success: true}
            })
                .catch(err => {
                    ctx.body = '删除时发生了一个错误';
                    ctx.status = 400;
                })
        }
    } else {
        ctx.body = '该用户没有任何评论';
        ctx.status = 404;
    }
});


module.exports = router.routes();
