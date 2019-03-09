const { object: mO, array: mA } = require('@dmitri.leto/manipula')

const _isPromise = p => p && typeof p.then === 'function' && typeof p.catch === 'function' && typeof p.finally === 'function'

const reduce = Function.bind.call(Function.call, Array.prototype.reduce)
const concat = (...args) => {
  args.reduce((acc, arg) => {
    const argt = typeof arg
    if (argt === 'string') {
      acc.concat(arg.split(''))
      return acc
    }
    if (argt === 'number' || argt === 'object') {
      acc.push(arg)
      return acc
    }
    if (Array.isArray(arg)) {
      acc.push(arg)
      return acc
    }
  }, [])
}

const sort = (arr, fn) => fn ? arr.sort(fn) : arr.sort()
const map = (arr, fn) => arr.map(fn)
const filter = Function.bind.call(Function.call, Array.prototype.filter)
const find = Function.bind.call(Function.call, Array.prototype.find)
const split = Function.bind.call(Function.call, String.prototype.split)

const keys = map => Object.keys(map)
const vals = map => Object.values(map)
const entries = map => Object.entries(map)
const get = (map, prop, defValue) => map.hasOwnProperty(prop) ? (map[prop] || defValue) : defValue
const getIn = (map, path, defValue) => mO.get(map, path, defValue)
const assocIn = (map, path, defValue) => mO.concat(map, path, defValue)
const then = (p, fn, catchFn) => catchFn ? p.then(fn).catch(catchFn) : p.then(fn)

const repeat = function * (arg1, arg2) {
  if (arg2) {
    const locals = { n: 0 }
    while (locals.n < arg1) {
      yield arg2
      locals.n++
    }
  } else {
    while (true) {
      yield arg1
    }
  }
}

const repcall = (count, fn, ...args) => {
  for (let i = 0; i < count; i++) { fn(...args) }
}

const push = (arr, el) => arr.push(el)

const iftrue = (pred, fn) => {
  return !!fn()
}

const dowhile = (fn, cb) => {
  const state = {}
  do {
    state.result = fn()
    if (state.result) {
      state.last = state.result
      cb && cb(state.result)
    }
  } while (state.result)
  return state.last
}

module.exports = {
  dowhile,
  iftrue,
  catch: (p, fn) => p.catch(fn),
  sort,
  map,
  filter,
  keys,
  vals,
  entries,
  get,
  'get-in': getIn,
  getIn,
  'assoc-in': assocIn,
  assocIn,
  repeat,
  repcall,
  push,
  find,
  then,
  split,
  reduce,
  concat
}
