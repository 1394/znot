const { array: mA } = require('@dmitri.leto/manipula')

const sort = (arr, fn) => fn ? arr.sort(fn) : arr.sort()
const map = (arr, fn) => arr.map(fn)
const filter = Function.bind.call(Function.call, Array.prototype.filter)
const find = Function.bind.call(Function.call, Array.prototype.find)
const push = (arr, el) => arr.push(el)
const pop = (arr, el) => arr.pop(el)
const reduce = Function.bind.call(Function.call, Array.prototype.reduce)

const groupby = mA.groupby
const indexby = mA.indexby

module.exports = {
  sort,
  map,
  filter,
  find,
  push,
  pop,
  reduce,
  indexby,
  groupby,
}
