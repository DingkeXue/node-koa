const validate = require('validator');
const isEmpty = require('./isEmpty');

module.exports = function validateLoginInput(data) {
    let errors = {};

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


    return {
        errors,
        isValid: isEmpty(errors)
    }
};
