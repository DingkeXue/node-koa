/*
* 对输入的个人信息进行验证
* */
const validator = require('validator');
const isEmpty = require('./isEmpty');

module.exports = function validateProfileInput(data) {
    let errors = {};

    // profile handle 验证
    if (!validator.isLength(data.handle, {min: 2, max: 30})) {
        errors.handle = 'handle长度不能小于2位且不能大于30位';
    }
    // profile status 验证
    if (isEmpty(data.status)) {
        errors.status = '职位不能为空';
    }
    // profile skills 验证
    if (isEmpty(data.skills)) {
        errors.skills = '技能不能为空';
    }
    // profile email 验证
    if (!validator.isEmail(data.website)) {
        errors.website = '邮箱格式不合法';
    }

    return {
        errors,
        isValid: isEmpty(errors)
    }
};
