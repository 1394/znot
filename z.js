'use strict'

const {object: mO, array, mA} = require('@dmitri.leto/manipula')

const z = (fn, ...args) => {
  if (typeof fn === 'string') {
    if (z._getSysFn(fn)) {
      return z(z._getSysFn(fn), ...args)
    }
    if (z._getNsFn(fn)) {
      return z(z._getNsFn(fn), ...args)
    }
    throw new Error(`error: fn [${fn}] not exist`)
  }
  if (typeof fn === 'function') {
    return fn(...args)
  } else {
    throw new Error(`error: fn [${fn}] type is not a function`)
  }
}

z._isPromise = p => p && typeof p.then === 'function' && typeof p.catch === 'function' && typeof p.finally === 'function'

z._sysns = new Map()
z.nss = {
}

z._getSysFn = (fnName) => {
  // console.log('getSysFn', fnName, z._sysns)
  if (z._sysns.has(fnName)) {
    return z._sysns.get(fnName)
  }
}

z._getNsFn = (nsFn) => {
  // console.log('getNsFn', nsFn)
  const [ns, fnName] = nsFn.split('.')
  const _ns = z.nss[ns]
  // console.log('getNsFn', {ns, _ns, fnName, nss: z.nss})
  if (_ns && fnName &&  _ns.has(fnName)) {
    return _ns.get(fnName)
  }
}

z._getFn = (fnName) => {
  if (typeof fnName !== 'string') {
    return
  }
  if (z._sysns.has(fnName)) {
    return z._sysns.get(fnName)
  }
  return z._getNsFn(fnName) || z[fnName]
}

z._sysdefn = (ns, fn) => {
  z._sysns.set(ns, fn)
}

z.defns = (ns, opts = {}) => {
  const { required } = opts
  z.nss[ns] = new Proxy(new Map(required), {
    get: (O, prop) => {
      if (O.has(prop)) {
        return O.get(prop)
      }
    }
  })
  return ns
}

z.defn = (ns, fnName, fn) => {
  if (!z.nss[ns]) {
    throw new Error(`error: namespace [${ns}] not existed`)
  }
  z.nss[ns].set(fnName, fn)
}

z._sysdefn('reduce', Function.bind.call(Function.call, Array.prototype.reduce))
z._sysdefn('concat', (...args) =>  {
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
z._sysdefn('sort', (arr, fn) => fn ? arr.sort(fn) : arr.sort() )
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

z._sysdefn('repeat', function* (arg1, arg2) {
  if (arg2) {
    const locals = {n: 0}
    while(locals.n < arg1) {
      yield arg2
      locals.n++;
    }
  } else {
    while (true) {
      yield arg1
    }
  }
})

z._sysdefn('repcall', (count, fn, ...args) => {
  for(let i=0;i < count;i++)
    fn(...args)
})

z._sysdefn('push', (arr, el) => arr.push(el))

const znot = new Proxy(z, {
  set: (target, prop, value) => {
    return false
  },
  apply: (target, scope, args) => {
    // console.log(`z will execute with args`)
    // console.dir(args, {depth: 4})
    return target.apply(scope, args)
  },
  get: (target, prop) => {
    // console.log('Proxy.get', {prop, type: typeof prop, value: target[prop]})
    return target._getFn(prop) || z.nss[prop] ||  target[prop]
  }
})

module.exports = znot
