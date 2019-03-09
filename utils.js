const z = require('./z.js')
const util = require('util')

const utils = z.defns({
  ns: 'utils',
  locals: {
    debug: true
  }
}, {
  logging: (...args) => {
    if (utils.$debug) {
      console.log(' [log]', util.format(...args))
    }
  },
  logdir: (depth, o) => {
    if (utils.$debug) {
      console.dir(o, { depth })
    }
  }
})
