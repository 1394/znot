'use strict'

const Namespace = require('./ns')

const z = function (fn, ...args) {
  if (typeof fn === 'string') {
    if (ns.system[fn]) {
      return z(ns.system[fn], ...args)
    }
    throw new Error(`error: fn [${fn}] not exist`)
  }
  if (typeof fn === 'function') {
    return fn(...args)
  } else {
    const error = `fn [${typeof fn}, ${args}] type is not a function`
    throw new Error(error)
  }
}

// namespaces
const sysInit = require('./sys')

const namespaces = {
  system: Namespace({
    ns: 'system'
  }, sysInit)
}

const ns = new Proxy(namespaces, {
  set: (target, prop, value) => {
    return false
  }
})

z.defns = (nsdefs, opts) => {
  const { ns } = nsdefs
  if (namespaces[ns]) {
    throw new Error('namespace already existed')
  }
  namespaces[ns] = Namespace(nsdefs, opts)
  return namespaces[ns]
}

module.exports = {
  z: new Proxy(z, {
    set: () => false,
    get: (O, prop) => {
      if (prop === 'defns') {
        return O.defns
      }
      return ns.system[prop]
    }
  }),
  ns
}
