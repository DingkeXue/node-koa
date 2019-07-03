const validate = require('validator');
const isEmpty = require('./isEmpty');

module.exports = function validatePostInput(data) {
  let errors = {};

  if (!validate.isLength(data.text, {min: 10, max: 300})) {
      errors.text = '评论长度不能小于10个字且不能大于300个字';
  }

  return {
      errors,
      isValid: isEmpty(errors)
  }
};
