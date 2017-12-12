/**
 * these iife is just for the convenience for the showcase of demos.
 * you can import a jsbundle by wrapping it in a <script> tag.
 * e.g. <script src="examples/build/vue-web/vue/index.js"></*script>
 */
; (function () {
  function getUrlParam (key) {
    var reg = new RegExp('[?|&]' + key + '=([^&]+)')
    var match = location.search.match(reg)
    return match && match[1]
  }

  function fixScriptUrl (page) {
    return page.replace('examples/build/vue-web/vue', 'dist/web')
  }

  function informParent (data) {
    const parent = window.parent
    if (parent) {
      data.type = 'change-bundle'
      parent.postMessage(data, '*')
    }
  }

  /**
   * fetch bundle transformed from 'page' query parameter. And
   * install it to the page.
   */
  var page = getUrlParam('page')
  var defaultPage = 'examples/build/vue-web/vue/index.js'
  if (!page) {
    var url = location.href.replace(/\?|$/, function(f) {
      var query = '?page=' + defaultPage
      return f ? query + '&' : query
    })
    return location.href = url
  }

  var script = document.createElement('script')
  var bundle = fixScriptUrl(page)
  script.src = bundle
  informParent({
    bundle: bundle,
    url: location.href
  })
  document.body.appendChild(script)
})()
