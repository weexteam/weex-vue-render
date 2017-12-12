var path = require('path')

exports.resolve = function resolve (rel) {
  return path.resolve(__dirname, '../', rel)
}

exports.extend = function extend(to, ...froms) {
  froms.forEach(function (from) {
    for (const key in from) {
      if (from.hasOwnProperty(key)) {
        to[key] = from[key]
      }
    }
  })
  return to
}
