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

const sys = {
  dowhile,
  iftrue,
  catch: (p, fn) => p.catch(fn),
  repeat,
  repcall,
  then,
  split,
  concat
}

Object.assign(sys, require('./sys/object'))
Object.assign(sys, require('./sys/array'))

module.exports = sys
