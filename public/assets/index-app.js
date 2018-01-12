/**
 * init vue app for index.html.
 * generate QRCode for current weex bundle.
 * udpate QRCode when preview bundle changed.
 */
(function () {
  var qrcodedraw = new QRCodeLib.QRCodeDraw()

  function getUrl (bundle) {
    var protocol = location.protocol + '//'
    var hostname = typeof CURRENT_IP === 'string'
      ? CURRENT_IP
      : location.hostname
    var pathname = location.pathname
    pathname = pathname.replace(/\/$|\/[^.]+.html/, '')
    var port = location.port
      ? ':' + location.port
      : ''
    return protocol
      + hostname
      + port
      + pathname
      + '/'
      + bundle
        .replace('dist/web', 'dist/native')
        .replace('./', '')
  }

  function initApp () {
    return new Vue({
      el: '#app',
      template: '#app-template',
      data: function () {
        return {
          nativeUrl: getUrl('dist/native/index.js'),
          webUrl: ''
        }
      },
      updated: function () {
        this.updateQrCode()
      },
      mounted: function () {
        this.updateQrCode()
      },
      methods: {
        updateQrCode: function () {
          this.updateWebQrCode(this.updateNativeQrCode)
        },

        updateWebQrCode: function (callback) {
          var webUrl = this.webUrl
          var self = this
          if (this._prevWebUrl !== webUrl) {
            this._prevWebUrl = webUrl
            qrcodedraw.draw(this.$refs.webCanvas, webUrl, function () {
              console.log('> QR CODE URL for WEB: ' + webUrl)
              callback && callback.call(self)
            })
          }
        },

        updateNativeQrCode: function () {
          var nativeUrl = this.nativeUrl
          var self = this
          if (this._prevNativeUrl !== nativeUrl) {
            this._prevNativeUrl = nativeUrl
            qrcodedraw.draw(this.$refs.nativeCanvas, nativeUrl, function () {
              console.log('> QR CODE URL for NATIVE: ' + nativeUrl)
            })
          }
        }
      }
    })
  }

  var app = initApp()
  addEventListener('message', function (evt) {
    const { type, bundle, url } = evt.data
    if (type === 'change-bundle') {
      console.log('UPDATE QR CODE URL: ' + bundle)
      // change vm.val to updated bundle.
      app.nativeUrl = getUrl(bundle)
      app.webUrl = url
    }
  })
})()
