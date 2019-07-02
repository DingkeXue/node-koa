const validate = require('validator');
const isEmpty = require('./isEmpty');

module.exports = function validateRegisterInput(data) {
    let errors = {};

    // 输入用户名验证
    if (!validate.isLength(data.name, {min: 2, max: 30})) {
         errors.name = '名字的长度不能少于2位且不能大于30位';
    }

    if (validate.isEmpty(data.name)) {
        errors.name = '名字不能为空';
    }

    // 邮箱验证
    if (validate.isEmpty(data.email)) {
        errors.email = '邮箱不能为空';
    }
    if (!validate.isEmail(data.email)) {
        errors.email = '邮箱格式不合法';
    }

    // 密码验证
    if (validate.isEmpty(data.password)) {
        errors.password = '密码不能为空';
    }
    if (!validate.isLength(data.password, {min: 6, max: 30})) {
        errors.password = '密码长度不能小于6位且不能大于30位';
    }

    // 两次密码验证
    if (!validate.equals(data.password, data.password2)) {
        errors.password = '两次密码不一致';
    }

    return {
        errors,
        isValid: isEmpty(errors)
    }
};
