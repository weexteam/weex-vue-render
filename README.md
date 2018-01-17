# weex-vue-render

Web renderer for weex project. Support Vue 2.x syntax.

[![build](https://travis-ci.org/weexteam/weex-vue-render.svg?branch=master)](https://travis-ci.org/weexteam/weex-vue-render)
[![vuejs2.x](https://img.shields.io/badge/vue-2.x-brightgreen.svg)](https://img.shields.io/badge/vue-2.x-brightgreen.svg)
[![pkg](https://img.shields.io/npm/v/weex-vue-render.svg?style=flat)](https://npmjs.com/package/weex-vue-render)
[![down](https://img.shields.io/npm/dm/weex-vue-render.svg)](https://npmjs.com/package/weex-vue-render)
[![Package Quality](http://npm.packagequality.com/shield/weex-vue-render.svg)](http://packagequality.com/#?package=weex-vue-render)

## How To Use

We strongly suggest you use v1.x instead of 0.12.x, according to performance issue.

```shell
npm install weex-vue-render
```

```javascript
// import vue runtime.
const Vue = require('vue/dist/vue.runtime.common').default
// import weex-vue-render
const weex = require('weex-vue-render')
// init the weex instance.
weex.init(Vue)
// import your .vue App.
const App = require('App.vue')
// must have a '#root' element in your html body.
App.$el = '#root'
// instantiate
new App()
```

> The way to require  ES modules and CommonJS modules may have a slice of difference between different versions of Vue and Vue-loader, and this is totally depending on Vue and the loader, so please check out related documents.

> If your import the UMD formated bundle to the html, then you dont't have to call `init` manually.

```html
<script>{{Vue runtime}}</script>
<script>{{weex-vue-render}}</script>
<script>{{your web.bundle.js}}</script>
```

### pack your .vue file to web.bundle.js

> You should pack your web.bundle.js and native.bundle.js separately. Use weex-loader for native packing and use vue-loader for web packing.

Use [vue-loader](https://github.com/vuejs/vue-loader) to pack your code for web.bundle.js.

If you are using weex-vue-render@**1.x** , You should definitely use below plugins to get things work:

* weex-vue-precompiler
* autoprefixer
* postcss-plugin-weex
* postcss-plugin-px2rem

> We use weex-vue-precompiler instead of `$processStyle` in 1.x verison.

Now, how to use this plugins to pack you web.bundle.js ? We use them in the vue-loader option.

Here is a vue-loader option example:

```javascript
{ // webpack config.
  vue: {
    optimizeSSR: false,
    postcss: [
      // to convert weex exclusive styles.
      require('postcss-plugin-weex')(),
      require('autoprefixer')({
        browsers: ['> 0.1%', 'ios >= 8', 'not ie < 12']
      }),
      require('postcss-plugin-px2rem')({
        // base on 750px standard.
        rootValue: 75,
        // to leave 1px alone.
        minPixelValue: 1.01
      })
    ],
    compilerModules: [
      {
        postTransformNode: el => {
          // to convert vnode for weex components.
          require('weex-vue-precompiler')()(el)
        }
      }
    ]
  }
}
```

> You should use a .js file as your webpack entry, not the Main.vue or App.vue file.

The content of your entry file `main.js` should be like this:

```javascript
// import Vue runtime if you like.
// import weex-vue-render if you like.
// init weex if you imported it.
// at least it should have this:
import App from './your/App.vue'
App.el = '#root'
new Vue(App)
```

## How to Migrate from 0.12.x to 1.x

> Why should I update to 1.x ?

The answer is **enoumouse change in rendering performance** with a few minor updates in your code is definitely worth to try.

### packing configuration

You should use the previous mentioned plugins in your vue-loader configuration.

### check your code

| category | rules | 0.12.x | 1.x |
| --- | ---- | ------ | ----- |
| **render function** | create weex component in render function | support | supported in **>=1.0.11** |
| **event binding** | bind native events for custom component's root element | `@click` | `@click.native` [doc](https://vuejs.org/v2/guide/components.html#Binding-Native-Events-to-Components) |
| **styles** | style binding | none | better performance for binding object literal like `:style="{width:w,height:h}"` instead of object variable like `:style="someObj"` |
|  | styles in `animation.transition` | none | should add css prefix manualy if needed. We suggest you use [transition](https://weex-project.io/references/common-style.html#transition-v0-16-0) to implement animation. |
| **exclusive styles** | limit | none | wirte them in `<style>` tag for better performance. |
|  | `wx` unit  | support | only in binding style (will fix soon) |
| **ref** | what `this.$refs.xx` will get | always instance of VueComponent | HTMLElement for div, image and text; VueComponent for other components. |

## Develop

```shell
# build for weex-vue-render package
npm run build
# debug and serve examples
npm run dev
# build and run test cases
npm run test
```
