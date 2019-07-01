/*
* 解决密码加密的问题
* */
const bcrypt = require('bcryptjs');

const tools = {
  enbcypt(password) {
      var salt = bcrypt.genSaltSync(10);
      var hash = bcrypt.hashSync(password, salt);
      return hash;
  }
};

module.exports = tools;
