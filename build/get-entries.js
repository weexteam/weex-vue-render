const path = require('path')
const fs = require('fs-extra')
const del = require('del')
const { resolve } = require('./utils')
const debug = require('../config').debug

const examplesDirectory = resolve('examples')
const entriesDirectory = resolve('examples/bundle-entry')
const testDirectory = resolve('examples/test')
const { getEntryFileContent } = require('./entry-template')

function walk(entry, dir, isNative, isTest) {
  dir = dir || '.'
  const directory = path.join(isTest ? testDirectory : examplesDirectory, dir)
  const subEntryDir = isNative ? 'native' : 'web'
  const entryDirectory = path.join(
    isTest ? testDirectory : entriesDirectory,
    isTest ? '' : subEntryDir,
    dir
  )
  fs.readdirSync(directory)
    .forEach(function(file) {
      const fullpath = path.join(directory, file)
      const stat = fs.statSync(fullpath)
      const extname = path.extname(fullpath)
      if (stat.isFile() && extname === '.vue') {
        const entryFile = path.join(
          entryDirectory,
          path.basename(file, extname) + (isTest ? extname : '.js')
        )
        if (!isTest) {
          fs.outputFileSync(entryFile, getEntryFileContent(fullpath, isNative))
        }
        const name = path.join(isTest ? '' : subEntryDir, dir, path.basename(file, extname))
        entry[name] = entryFile + (isNative ? '?entry=true' : '')
      } else if (stat.isDirectory() && file !== 'bundle-entry' && file !== 'include') {
        const subdir = path.join(dir, file)
        walk(entry, subdir, isNative, isTest)
      }
    })
}

function getEntries (isNative, noEntry) {
  const entry = {}
  walk(entry, null, isNative, noEntry)
  return entry
}

exports.getWebEntries = function (noEntry) {
  if (!debug) {
    if (!noEntry) {
      del.sync(resolve('examples/bundle-entry/web/**'))
    }
    return getEntries(false, noEntry)
  }

  // debug === true.
  const entryDir = 'web'
  const entryName = 'test/components/render-function'
  const entryPath = path.join(entryDir, entryName)
  fs.outputFileSync(
    resolve(path.join('examples/bundle-entry', entryPath + '.js')),
    getEntryFileContent(
      resolve(path.join('examples', entryName + '.vue')),
      false
    )
  )
  const entries = {}
  entries[`${entryDir}/${entryName}`]
    = resolve(`examples/bundle-entry/${entryDir}/${entryName}.js`)
  return entries
}

exports.getTestEntries = function () {
  const entry = {}
  walk(entry, null, false, true)
  return entry
}

exports.getNativeEntries = function (noEntry) {
  if (!noEntry) {
    del.sync(resolve('examples/bundle-entry/native/**'))
  }
  return getEntries(true, noEntry)
}
