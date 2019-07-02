const validator = require('validator');
const isEmpty = require('./isEmpty');

module.exports = function validateEducationInput(data) {
    const errors = {};

    // 验证学校
    if (isEmpty(data.school)) {
        errors.school = '学校不能为空';
    }
    // 验证学位
    if (isEmpty(data.degree)) {
        errors.degree = '学历不能为空';
    }
    // 验证专业
    if (isEmpty(data.fieldofstudy)) {
        errors.fieldofstudy = '专业不能为空';
    }
    // 验证开始时间
    if (isEmpty(data.from)) {
        errors.from = '开始时间不能为空';
    }

    return {
        errors,
        isValid: isEmpty(errors)
    }
};
