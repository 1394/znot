const z = require('./z.js')

console.log(z)

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
