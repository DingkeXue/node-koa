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

/*
* @route POST api/posts/like?id=id
* @desc 用户点赞接口
* @access 接口私有的
* */
router.post('/like', passport.authenticate('jwt', { session: false }), async ctx => {
    const like_id = ctx.query.id;
    const user_id = ctx.state.user.id;

    // 查询用户是否有个人信息
    const profile = await Profile.find({user: user_id});
    if (profile.length > 0) {
        // 查询该用户评论
        const post = await Post.findById(like_id);
        console.log(post);

        // 查看是否已点赞
        const liked = post.likes.filter(item => item.user.toString() === user_id).length > 0;
        if (liked) {
            ctx.body = {alreadyLiked: '您已点过赞'};
            ctx.status = 200;
        } else {
            post.likes.push({user: user_id});
            const likeUpdate = await Post.findOneAndUpdate({_id: like_id}, {$set: post}, {new: true});
            ctx.body = likeUpdate;
            ctx.status = 200;
        }
    } else {
        ctx.status = 404;
        ctx.body = '没有该用户详情';
    }
});

/*
* @route POST api/posts/unlike?id=id
* @desc 用户取消点赞接口
* @access 接口私有的
* */
router.post('/unlike', passport.authenticate('jwt', { session: false }), async ctx => {
   const unlike_id = ctx.query.id;
   const user_id = ctx.state.user.id;

   // 查询该用户是否有个人信息
    const profile = await Profile.find({user: user_id});
    if (profile.length > 0) {
        const post = await Post.findById(unlike_id);

        // 查询是否点过赞
        const liked = post.likes.filter(item => item.user.toString() === user_id).length > 0;
        if (liked) {
            const removeIndex = post.likes.map(item => item.user.toString()).indexOf(unlike_id);
            post.likes.splice(removeIndex, 1);
            const unlikeUpdate = await Post.findOneAndUpdate({_id: unlike_id}, {$set: post}, {new: true});
            ctx.body = unlikeUpdate;
            ctx.status = 200;
        } else {
            ctx.status = 200;
            ctx.body = {alreadyLiked: '您还没有点过赞'};
        }
    }
});

/*
* @route POST api/posts/comment?id=id
* @desc 添加单个评论接口
* @access 接口私有的
* */
router.post('/comment', passport.authenticate('jwt', { session: false }), async ctx => {
   const comment_id = ctx.query.id;
   const body = ctx.request.body;
   const user_id = ctx.state.user.id;

   // 对输入进行验证
    const { errors, isValid } = validatePostInput(body);
    if (!isValid) {
        ctx.body = errors;
        ctx.status = 400;
        return;
    }

   const newComment = {
       text: body.text,
       name: body.name,
       avatar: body.avatar,
       user: user_id
   };

   const post = await Post.findById(comment_id);
   post.comments.unshift(newComment);
   const commentUpdate = await Post.findOneAndUpdate({_id: comment_id}, {$set: post}, {new: true});
   ctx.body = commentUpdate;
   ctx.status = 200;
});

/*
* @route DELETE api/posts/comment?id=id&comment_id=id
* @desc 删除单个评论接口
* @access 接口私有的
* */
router.delete('/comment',  passport.authenticate('jwt', { session: false }), async ctx => {
   const user_id = ctx.state.user.id;
   const comment_id = ctx.query.comment_id;
   const id = ctx.query.id;

   // 查看是否评论
   const post = await Post.findById(id);
   const commented = post.comments.map(item => item.toString()).length > 0;
   if (commented) {
       const removeIndex = post.comments.map(item => item._id.toString()).indexOf(comment_id);
       post.comments.splice(removeIndex, 1);
       const commentUpdate = await Post.findOneAndUpdate({_id: id}, {$set: post}, {new: true});
       ctx.body = commentUpdate;
       ctx.status = 200;
   } else {
       ctx.body = {errors: '您还没有评论'};
       ctx.status = 404;
   }
});

module.exports = router.routes();
