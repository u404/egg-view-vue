"use strict"

const path = require("path")
/**
 * egg-view-vue default config
 * @member Config#viewVue
 * @property {String} SOME_KEY - some description
 */
exports.viewVue = {
  renderOptions: {
    template: require(path.resolve(__dirname, "../lib/template.js")),
  },
}
