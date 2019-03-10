const { z, importClass } = require('../z')

const methods = importClass(String.prototype)

z.defns({
  ns: 'str'
}, methods)
