/*
* 点赞和评论
* */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// 实例化数据模板
const PostSchema = new Schema({
   user: {
       type: String,
       required: true,
       //  关联表
       ref: 'users',
   } ,
    text: {
       type: String,
        required: true
    },
    date: {
       type: Date,
        default: Date.now
    },
    name: {
        type: String
    },
    avatar: {
        type: String
    },
    likes: [
        {
            user: {
                type: Schema.Types.ObjectId,
                ref: 'users'
            }
        }
    ],
    comments: [
        {
            date: {
                type: Date,
                default: Date.now
            },
            user: {
                type: Schema.Types.ObjectId,
                ref: 'users'
            },
            text: {
                type: String,
                required: true
            },
            name: {
                type: String,
                required: true
            },
            avatar: {
                type: String,
                required: true
            }
        }
    ]
});

module.exports = Post = mongoose.model('post', PostSchema);
