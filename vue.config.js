
const V = require('./webpack/index')

module.exports = {
  lintOnSave: false,
  configureWebpack: {
    plugins: [
      new V()
    ],
  },
};
