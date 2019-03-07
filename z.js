'use strict'

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

z._sysns = new Map()
z.nss = {
}

z._getSysFn = (fnName) => {
  if (z._sysns.has(fnName)) {
    return z._sysns.get(fnName)
  }
}

z._getNsFn = (nsFn) => {
  const [ns, fnName] = nsFn.split('.')
  const _ns = z.nss[ns]
  if (_ns && _ns.has(fnName)) {
    return _ns.get(fnName)
  }
}

z._sysdefn = (ns, fn) => {
  z._sysns.set(ns, fn)
}

z.defns = (ns, opts = {}) => {
  const { required } = opts
  z.nss[ns] = new Map(required)
  return ns
}

z.defn = (ns, fnName, fn) => {
  if (!z.nss[ns]) {
    throw new Error(`error: namespace [${ns}] not existed`)
  }
  z.nss[ns].set(fnName, fn)
}

z._sysdefn('sort', Function.bind.call(Function.call, Array.prototype.sort))
z._sysdefn('reduce', Function.bind.call(Function.call, Array.prototype.reduce))
z._sysdefn('map', Function.bind.call(Function.call, Array.prototype.map))
z._sysdefn('filter', Function.bind.call(Function.call, Array.prototype.filter))
z._sysdefn('find', Function.bind.call(Function.call, Array.prototype.find))
z._sysdefn('split', Function.bind.call(Function.call, String.prototype.split))

module.exports = z
