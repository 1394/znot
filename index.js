const z = require('./z.js')
const importClass = require('./imports')

importClass(String, 'str')
importClass(Array, 'array')
importClass(Object, 'obj')

require('./utils')

module.exports = z
