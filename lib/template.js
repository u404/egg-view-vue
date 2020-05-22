"use strict"

module.exports = {
  template: `<html>
      <head>
        <meta charset="utf-8">
        <meta name="wap-font-scale" content="no">
        <meta content="yes" name="apple-mobile-web-app-capable">
        <meta content="yes" name="apple-touch-fullscreen">
        <meta content="telephone=no,email=no" name="format-detection">
        <meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no,viewport-fit=cover">
        <meta v-for="(value, key) in meta" :name="key" :content="value" />
        <title>{{title}}</title>
        <script v-html="remScript" />
        <link v-for="item in styles" rel="stylesheet" :href="item" />
      </head>
      <body>
        <slot></slot>
        <script src="//g.smartcinema.com.cn/fe/libs/0.0.1/es6-promise.min.js"></script>
        <script src="//g.smartcinema.com.cn/fe/libs/0.0.1/vue.runtime.min.js"></script>
        <script src="//g.smartcinema.com.cn/node/lib-windvane/0.0.4/index.js"></script>
        <script v-html="initialScript" />
        <script v-if="apiProxy" v-html="apiProxy"/>
        <script v-if="disabledAwsc"> window.useAWSC = false; </script>
        <script v-for="item in scripts" :src="item"></script>
      </body>
    </html>`,

  props: {
    title: {
      type: String,
      default: "",
    },

    styles: {
      type: Array,
      default: [],
    },

    scripts: {
      type: Array,
      default: [],
    },

    meta: {
      type: Object,
      default() { return {} },
    },

    initialScript: {
      type: String,
    },

    apiProxy: {
      type: String,
      default: null,
    },

    disabledAwsc: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      remScript: `;(function(){var win=window,docElem=document.documentElement,timeoutId;setRem();docElem.setAttribute('data-dpr',win.devicePixelRatio);win.addEventListener('resize',delaySetRem,false);win.addEventListener('pageshow',function(e){e.persisted&&delaySetRem()},false);function delaySetRem(){clearTimeout(timeoutId);timeoutId=setTimeout(setRem,300)};function setRem(){win.rem=docElem.getBoundingClientRect().width/10;docElem.style.fontSize=win.rem+'px';window.onRefreshRem&&window.onRefreshRem(win.rem)};var lib=win.lib||{},flexible=lib.flexible||{};flexible.dpr=win.devicePixelRatio;flexible.refreshRem=setRem;flexible.rem2px=function(d){var val=parseFloat(d)*win.rem;if(typeof d==='string'&&d.match(/rem$/)){val+='px'}return val};flexible.px2rem=function(d){var val=parseFloat(d)/win.rem;if(typeof d==='string'&&d.match(/px$/)){val+='rem'}return val};lib.flexible=flexible;win.lib=lib})();"function"!=typeof Object.assign&&(Object.assign=function(d,f){if(null==d)throw new TypeError("Cannot convert undefined or null to object");for(var e=Object(d),b=1;b<arguments.length;b++){var a=arguments[b];if(null!=a)for(var c in a)Object.prototype.hasOwnProperty.call(a,c)&&(e[c]=a[c])}return e});`,
    }
  },
}
