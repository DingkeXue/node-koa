const validate = require('validator');
const isEmpty = require('./isEmpty');

module.exports = function validateRegisterInput(data) {
    let errors = {};

    if (!validate.isLength(data.name, {min: 2, max: 30})) {
         errors.name = '名字的长度不能少于2位且不能大于30位';
    }

    return {
        errors,
        isValid: isEmpty(errors)
    }
};
