const mongoose = require('mongoose');
const schema = mongoose.Schema;

// 实例化数据模板
const ProfileSchema = new schema({
   user: {
       type: String,
       // 关联数据表
        ref: 'users',
       required: true
   },
    handle: {
        type: String,
        required: true
    },
    company: {
        type: String
    },
    website: {
        type: String
    },
    location: {
        type: String
    },
    status: {
        type: String,
        required: true
    },
    skills: {
        type: [String],
        required: true
    },
    bio: {
        type: String
    },
    experience: [
        {
            current: {
                type: Boolean
            },
            company: {
                type: String
            },
            location: {
                type: String
            },
            title: {
                type: String
            },
            from: {
                type: String
            },
            to: {
                type: String
            },
            desc: {
                type: String
            }
        }],
    education: [
        {
            current: {
                type: Boolean
            },
            school: {
                type: String
            },
            degree: {
                type: String
            },
            fieldofstudy: {
                type: String
            },
            from: {
                type: String
            },
            to: {
                type: String
            },
            desc: {
                type: String
            }
        }],
    social: {
      QQ: {
          type: Number
      },
      wechat: {
          type: String
      }
    },
    date: {
        type: Date,
        default: Date.now
    },
});

module.exports = Profile = mongoose.model('profile', ProfileSchema);
