const z = require('../z')

z.defns('ztest', {
  required: [
    ['logging', (...args) => {
      console.log(' [log]', ...args)
    }],
    ['logdir', (depth, o) => {
      console.dir(o, { depth })
    }]
  ]
})

const arr = [3, 5, 77, 23, 5, 887, 1, -4]
z('ztest.logging', 'arr: ', arr)

const result = z('map',
  z('sort', arr),
  el => `el: ${el}`
)

const result1 = z('map',
  result,
  (el) => z(parseInt,
    z('split', el, ':')[1],
    10
  )
)

z('ztest.logging', 'result: ', result)
z('ztest.logging', 'result1: ', result1)
z('ztest.logging', 'z.nss: ')
z('ztest.logdir', 4, z.nss)

// vanilla js

const res = arr.sort().map(el => `el: ${el}`)

const res1 = res.map(el => parseInt(el.split(': ')[1], 10))

console.log('res1', res1)

process.exit(0)
