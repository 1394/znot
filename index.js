const z = require('./z.js')
const importClass = require('./imports')

importClass(String.prototype, 'str')
importClass(Array.prototype, 'array')
importClass(Object, 'obj')

require('./utils')

module.exports = z
