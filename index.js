const z = require('./z.js')
const importClass = require('./imports')

importClass(String, 'str')
importClass(Array, 'array', {
  push: (el, arr) => {
    arr.push(el)
    return arr
  },
  unshift: (el, arr) => {
    arr.unshift(el)
    return arr
  },
})
importClass(Object, 'obj')

require('./utils')

module.exports = z
