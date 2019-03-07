const z = require('./z.js')

z.defns('utils', {
  required: [
    ['logging', (...args) => {
      console.log(' [log]', ...args)
    }],
    ['logdir', (depth, o) => {
      console.dir(o, { depth })
    }]
  ]
})
