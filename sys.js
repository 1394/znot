// const _isPromise = p => p && typeof p.then === 'function' && typeof p.catch === 'function' && typeof p.finally === 'function'

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

const split = Function.bind.call(Function.call, String.prototype.split)

const then = (p, fn, catchFn) => {
  return catchFn ? p.then(fn).catch(catchFn) : p.then(fn)
}

const promiseAll = (arr) => Promise.all(arr)

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

const iftrue = (val) => {
  return !!val
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

const count = (obj) => {
  if (Array.isArray(obj) || typeof obj === 'string') {
    return obj.length
  }
  if (typeof obj === 'object') {
    return Object.keys(obj).length
  }
  return 0
}

const gt = (a, b) => a > b
const ge = (a, b) => a >= b
const lt = (a, b) => a < b
const le = (a, b) => a <= b
const eq = (a, b) => a === b
const ne = (a, b) => a !== b

const cond = (...args) => {
  const fn = args.find(([pred, fn, ...args]) => {
    if (typeof pred === 'object' && pred.else) {
      return true
    }
    return pred
  })
  if (fn) {
    return fn(...args)
  }
}

const first = (obj) => {
  if (typeof obj === 'string' || Array.isArray(obj)) {
    return obj[0]
  }
  return obj
}

const last = (obj) => {
  if (typeof obj === 'string' || Array.isArray(obj)) {
    return obj[obj.length - 1]
  }
  return obj
}

const isEven = (n) => !(n % 2)
const isOdd = (n) => !!(n % 2)

const next = (obj) => {
  if (typeof obj === 'string' || Array.isArray(obj)) {
    return obj.slice(1)
  }
  return obj
}

const splitAt = (arr, n, defval) => {
  if (Array.isArray(arr) && arr.length) {
    const res = []
    let i = 0
    while (arr.length > i) {
      let el = arr.slice(i, i + n)
      if (el.length < n && defval) {
        el = el.concat(Array(n - el.length).fill(defval))
      }
      res.push(el)
      i = i + n
    }
    return res
  }
}

const assoc = (obj, ...args) => {
  const res = Object.assign({}, obj)
  splitAt(args, 2).forEach(([k, v]) => {
    if (typeof v !== 'undefined') {
      res[k] = v
    }
  })
  return res
}

const get = (obj, ...args) => {
  if (args.length === 1 && Array.isArray(args[0]) && args[0].length) {
    args = args[0]
  }
  if ((Array.isArray(obj) || typeof obj === 'string') && obj.length) {
    if (args.length === 1) {
      return obj[args[0]]
    } else {
      return args.reduce((acc, n) => {
        acc.push(obj[n])
        return acc
      }, [])
    }
  }
  if (typeof obj === 'object') {
    if (args.length === 1) {
      return obj[args[0]]
    } else {
      return args.reduce((acc, n) => {
        acc[n] = obj[n]
        return acc
      }, {})
    }
  }
}

const chain = (args, obj) => {
  return args.reduce((acc, [method, ...values]) => {
    if (['object', 'function'].includes(typeof acc) && acc[method] && typeof acc[method] === 'function') {
      acc = acc[method](...values)
      return acc
    } else {
      if (acc.hasOwnProperty(method)) {
        return acc[method]
      } else {
        const error = `error chain call with method [${method}]`
        throw new Error(error)
      }
    }
  }, obj)
}

// eslint-disable-next-line no-new-func
const fn = (...args) => new Function(...args)
const bind = (fn, scope) => fn.bind(scope)

const sys = {
  chain,
  fn,
  bind,
  get,
  assoc,
  isEven,
  isOdd,
  'even?': isEven,
  'odd?': isOdd,
  first,
  last,
  next,
  cond,
  count,
  dowhile,
  iftrue,
  catch: (p, fn) => p.catch(fn),
  repeat,
  repcall,
  then,
  promiseAll,
  split,
  concat,
  gt,
  ge,
  lt,
  le,
  eq,
  ne,
}

// Object.assign(sys, require('./sys/object'))
// Object.assign(sys, require('./sys/array'))

module.exports = sys
