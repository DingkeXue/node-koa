const validator = require('validator');
const isEmpty = require('./isEmpty');

module.exports = function validateExperienceInput(data) {
  const errors = {};

  // 验证公司
    if (isEmpty(data.company)) {
        errors.company = '公司名称不能为空';
    }
    // 验证职位
    if (isEmpty(data.status)) {
        errors.status = '职位不能为空';
    }
    // 验证title
    if (isEmpty(data.title)) {
        errors.title = '标题不能为空';
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
