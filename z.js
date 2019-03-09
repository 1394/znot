'use strict'

const Namespace = require('./ns')

const { object: mO, array: mA } = require('@dmitri.leto/manipula')

const z = function (fn, ...args) {
  if (typeof fn === 'string') {
    if (z._sysns.get(fn)) {
      return z(z._sysns.get(fn), ...args)
    }
    // if (z._getNsFn(fn)) {
    //   return z(z._getNsFn(fn), ...args)
    // }
    throw new Error(`error: fn [${fn}] not exist`)
  }
  if (typeof fn === 'function') {
    return fn(...args)
  } else {
    throw new Error(`error: fn [${fn}, ${args}] type is not a function`)
  }
}

z._isPromise = p => p && typeof p.then === 'function' && typeof p.catch === 'function' && typeof p.finally === 'function'

// namespaces
const namespaces = { system: Namespace('system') }
z._sysns = namespaces.system

z.ns = new Proxy(namespaces, {
  // get: (target, prop) => {
  // },
  set: (target, prop, value) => {
    return false
  }
})

z.defns = (ns, opts) => {
  namespaces[ns] = Namespace(ns, opts)
  return namespaces[ns]
}

z._getSysFn = (fnName) => z._sysns.get(fnName)// {

z._getNsFn = (nsFn) => {
  // console.log('getNsFn', nsFn)
  const [ns, fnName] = nsFn.split('.')
  const _ns = z.ns[ns]
  // console.log('getNsFn', { ns, _ns, fnName, nss: z.ns })
  if (_ns && fnName && _ns.has && _ns.has(fnName)) {
    return _ns.get(fnName)
  } else {
    console.error(`error: nsFn ${nsFn} not found`, ns, fnName, _ns)
  }
}

z._getFn = (fnName) => {
  if (typeof fnName !== 'string') {
    return
  }
  if (z._sysns[fnName]) {
    return z._sysns[fnName]
  }
  return z._getNsFn(fnName) || z[fnName]
}

z._sysdefn = (ns, fn) => {
  z._sysns.defn(ns, fn)
}

// defn
z.defn = (ns, fnName, fn) => {
  if (!z.ns[ns]) {
    throw new Error(`error: namespace [${ns}] not existed`)
  }
  z.ns[ns].set(fnName, fn)
}

// sysdefn
z._sysdefn('reduce', Function.bind.call(Function.call, Array.prototype.reduce))
z._sysdefn('concat', (...args) => {
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
})
z._sysdefn('sort', (arr, fn) => fn ? arr.sort(fn) : arr.sort())
z._sysdefn('map', (arr, fn) => arr.map(fn))
z._sysdefn('filter', Function.bind.call(Function.call, Array.prototype.filter))
z._sysdefn('find', Function.bind.call(Function.call, Array.prototype.find))
z._sysdefn('split', Function.bind.call(Function.call, String.prototype.split))

z._sysdefn('keys', map => Object.keys(map))
z._sysdefn('vals', map => Object.values(map))
z._sysdefn('entries', map => Object.entries(map))
z._sysdefn('get', (map, prop, defValue) => map.hasOwnProperty(prop) ? (map[prop] || defValue) : defValue)
z._sysdefn('get-in', (map, path, defValue) => mO.get(map, path, defValue))
z._sysdefn('assoc-in', (map, path, defValue) => mO.concat(map, path, defValue))
z._sysdefn('then', (p, fn, catchFn) => catchFn ? p.then(fn).catch(catchFn) : p.then(fn))
z._sysdefn('catch', (p, fn) => p.catch(fn))

z._sysdefn('repeat', function * (arg1, arg2) {
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
})

z._sysdefn('repcall', (count, fn, ...args) => {
  for (let i = 0; i < count; i++) { fn(...args) }
})

z._sysdefn('push', (arr, el) => arr.push(el))

z._sysdefn('iftrue', (pred, fn) => {
  return !!fn()
})

z._sysdefn('dowhile', (fn, cb) => {
  const state = {}
  do {
    state.result = fn()
    if (state.result) {
      state.last = state.result
      cb && cb(state.result)
    }
  } while (state.result)
  return state.last
})

const znot = new Proxy(z, {
  set: (target, prop, value) => {
    return false
  },
  apply: (target, scope, args) => {
    // console.log(`z will execute with args`, (args[1] || '').toString())
    // console.dir(args, { depth: Infinity })
    // console.log(`z target`, z)
    // console.log(`z scope`, scope)
    return target.apply(scope, args)
  },
  get: (target, prop) => {
    // console.log('Proxy.get', { prop, type: typeof prop, value: target[prop] })
    if ({ ns: 'ns', defns: 'defns' }[prop]) {
      return target[prop]
    }
    // console.log('try call function: ', prop)
    const result = target._getFn(prop)
    if (!result) {
      const msg = `function [${prop}] is not exist`
      throw new Error(msg)
    }
    return result
  }
})

module.exports = znot
