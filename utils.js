const z = require('./z.js')
const util = require('util')

z.defns('utils', {
  required: [
    ['logging', (...args) => {
      console.log(' [log]', util.format(...args))
    }],
    ['logdir', (depth, o) => {
      console.dir(o, { depth })
    }]
  ]
})
