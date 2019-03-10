const { z } = require('./z.js')
const { format } = require('util')

const debug = !!process.env.DEBUG

const utils = z.defns({
  ns: 'utils',
  locals: {
    debug: debug,
  },
}, {
  setDebug: (debug) => {
    utils.$debug = debug
  },
  logging: (...args) => {
    if (utils.$debug) {
      console.log(' [log]', format(...args))
    }
  },
  logdir: (depth, o) => {
    if (utils.$debug) {
      console.dir(o, { depth })
    }
  },
})
