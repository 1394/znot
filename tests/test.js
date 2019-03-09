const assert = require('assert')
const disp = (txt, res) => {
  console.log(`${txt} ... Ok\n`)
}

const { z } = require('../index')

const seeds = require('./seeds')

const arr = [3, 5, 77, 23, 5, 887, 1, -4]

const result = z('map',
  z('sort', arr),
  el => `el: ${el}`
)

disp('result: sort and templating each el of array', assert.deepStrictEqual(result, [ 'el: -4',
  'el: 1',
  'el: 23',
  'el: 3',
  'el: 5',
  'el: 5',
  'el: 77',
  'el: 887'
]))

const result1 = z('map',
  result,
  (el) => z(parseInt,
    z('split', el, ':')[1],
    10
  )
)

disp('result1 by split el and parseInt last of split', assert.deepStrictEqual(result1, [ -4, 1, 23, 3, 5, 5, 77, 887 ]))

disp('get-in by path as array', assert.deepStrictEqual(
  z('get-in', seeds.src, ['a', 'b', 'd', 'e']),
  '234'
))

disp('get-in by path as string', assert.deepStrictEqual(
  z('get-in', seeds.src, 'a.b.d.e'),
  '234'
))

disp('get-in defValue', assert.deepStrictEqual(
  z('get-in', seeds.src, 'a.b.d.e.eee', 'defValue'),
  'defValue'
))

z('catch',
  // eslint-disable-next-line prefer-promise-reject-errors
  Promise.reject({ error: 123 }),
  (compared) => {
    disp('promise.catch', assert.deepStrictEqual({ error: 123 }, compared))
  }
)

z('then',
  Promise.resolve(123),
  (compared) => {
    disp('promise.then', assert.strictEqual(123, compared))
  }
)

setTimeout(() => process.exit(0), 500)
