"use strict"

const vueServerRenderer = require("vue-server-renderer")

const sjs = require("egg-security/lib/helper/sjs")

const escapeHtml = require("escape-html")

const Vue = require("vue")

class Engine {
  constructor(app) {
    this.app = app
    this.config = app.config.viewVue
    this.vueServerRenderer = vueServerRenderer
    this.renderer = this.vueServerRenderer.createRenderer()
    this.renderOptions = this.config.renderOptions

    const isLocal = this.app.config.env === "local"
    if (isLocal) {
      const register = require("@sc/babel-register-vue").default
      register({
        cache: false,
        only: [ this.config.sourcePath ],
        presets: [ "@babel/preset-env" ],
        plugins: [ "@babel/plugin-proposal-object-rest-spread", "@babel/plugin-transform-destructuring" ],
        extensions: [ ".vue", ".js" ],
      })
    }
  }

  createPageComponent(name, options = {}) {
    const { openSSR = true } = options

    const baseUrl = this.config.cdnHost + this.config.publicPath
    const isLocal = this.app.config.env === "local"

    return {
      props: {
        initialState: {
          type: Object,
          default() { return {} },
        },

        pageProps: {
          type: Object,
          default() { return {} },
        },
      },

      components: {
        "html-template": this.config.renderOptions.template,
        "app-component": this.createAppComponent(name, openSSR),
      },

      template: `
      <html-template :title="title"
        :meta="meta"
        :styles="styles"
        :scripts="scripts"
        :apiProxy="apiProxy"
        :initialScript="initialScript"
      >
        <app-component :initialState="initialState"></app-component>
      </html-template>
      `,

      data() {
        const { title, meta, disabledAwsc } = this.pageProps
        const initialScript = `window.__INITIAL_STATE__= '${escapeHtml(sjs(JSON.stringify(this.initialState)).replace(/[\u2028]/g, "").replace(/[\u2029]/g, ""))}';`
        const apiProxy = isLocal && options.env.env !== options.env._env ? `window.__env__= '${options.env.env}';` : null

        return {
          title,
          meta,
          scripts: this._getScripts(),
          styles: this._getStyles(),
          initialScript,
          disabledAwsc,
          apiProxy,
        }
      },

      methods: {
        _getScripts() {
          const scripts = this.pageProps.scripts || []
          scripts.push(baseUrl + name + "/index.js")
          return scripts
        },

        _getStyles() {
          const styles = this.pageProps.styles || []
          if (!isLocal) styles.push(baseUrl + name + "/index.css")
          return styles
        },
      },
    }

  }

  createAppComponent(name, openSSR) {
    const component = {
      props: {
        initialState: {
          type: Object,
          default() { return {} },
        },
      },
      template: `<div id="app"></div>`,
    }
    if (openSSR) {
      const isLocal = this.app.config.env === "local"
      const appComponentPath = `${this.config.sourcePath}/${name}/App.${isLocal ? "vue" : "js"}`
      if (isLocal) delete require.cache[appComponentPath]
      component.template = `<div id="app" ssr="true"><app-component :initialState="initialState"></app-component></div>`
      component.components = { "app-component": require(appComponentPath).default }
    }

    return component
  }

  render(name, locals = {}, options = {}) {
    return new Promise((resolve, reject) => {
      vueServerRenderer.createRenderer().renderToString(new Vue({
        render: createComponent => createComponent(this.createPageComponent(name, options), {
          props: locals,
        }),
      }), (err, html) => {
        if (err) {
          reject(err)
        } else {
          html = `<!DOCTYPE html>${html}`
          resolve(html)
        }
      })
    })
  }
}

module.exports = Engine
