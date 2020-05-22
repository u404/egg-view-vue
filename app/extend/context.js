"use strict"

module.exports = {
  /**
     * render vue bundle file
     * @function Context#render
     * @param {String} name filename
     * @param {Object} [locals] template data
     * @param {Object} options custom params
     * @return {Object} Promise
     */
  render(name, locals, options = {}) {
    options.env = this.env
    return this.app.vue.render(name, locals, options).then(html => {
      this.type = "text/html; charset=utf-8"
      this.body = html
    }).catch(() => {
      return this.app.vue.render(name, locals, { ...options, openSSR: false }).then(html => {
        this.type = "text/html; charset=utf-8"
        this.body = html
      }).catch(err => {
        throw err
      })
    })
  },

  renderString(name, locals, options = {}) {
    return this.app.vue.render(name, locals, options)
  },
}
