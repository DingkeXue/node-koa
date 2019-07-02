const mongoose = require('mongoose');
const schema = mongoose.Schema;

// 实例化数据模板
const ProfileSchema = new schema({
   user: {
       type: String,
       required: true
   },
    handle: {
        type: String,
        ref: 'users',
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
    experience: {
        current: {
            type: Boolean,
            default: true
        },
        company: {
            type: String
        },
        location: {
            type: String
        },
        title: {
            type: String,
            required: true
        },
        from: {
            type: String,
            required: true
        },
        to: {
            type: String
        },
        desc: {
            type: String
        }
    },
    education: {
        current: {
            type: Boolean,
            default: true
        },
        school: {
            type: String,
            required: true
        },
        degree: {
            type: String,
            required: true
        },
        fieldofstudy: {
            type: String,
            required: true
        },
        from: {
            type: String,
            required: true
        },
        to: {
            type: String
        },
        desc: {
            type: String
        }
    },
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
        required: Date.now
    },
});

module.exports = Profile = mongoose.model('profile', ProfileSchema);
