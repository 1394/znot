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
    ns: 'system',
  }, sysInit),
}

const ns = new Proxy(namespaces, {
  set: (target, prop, value) => {
    return false
  },
})

z.defns = (nsdefs, opts) => {
  const { ns } = nsdefs
  if (namespaces[ns]) {
    throw new Error('namespace already existed')
  }
  namespaces[ns] = Namespace(nsdefs, opts)
  return namespaces[ns]
}

const za = function (args) {
  // console.log('-'.repeat(100))
  // console.log('za type args: ', typeof args, args)
  const fn = args.shift()
  // console.log('will execute : ', fn, args)
  const scanArgs = (arr) => arr.map(el => {
    // console.log('scanArgs el', el)
    if (Array.isArray(el) && typeof el[0] === 'function' && el[0].__za_fn) {
      // console.log('1will recall za', ...el.slice(1))
      return za(el.slice(1))
    }
    return el
  })

  if (typeof fn === 'string') {
    if (ns.system._has(fn)) {
      args.unshift(ns.system[fn])
      // console.log('ns.system[fn]', ns.system[fn])
      args = scanArgs(args)
      // console.log('2will recall za', args)
      return za(args)
    }
    const [namespace, fnname] = fn.split('.')
    // console.log(`ns[${namespace}][${fnname}]`, ns[namespace])
    if (fnname && ns[namespace]._has(fnname)) {
      args = scanArgs(args)
      args.unshift(ns[namespace][fnname])
      // console.log(`3will recall za by ns[${namespace}][${fnname}]`, ns[namespace][fnname], args)
      return za(args)
    }
    throw new Error(`za.error: fn [${fn}] or [${namespace}.${fnname}] not exist`)
  }
  if (fn.__za_fn) {
    // const fn2 = args[0]
    // console.log(`4will recall za by za array`, fn2, args)
    args = scanArgs(args.slice(1))
    return za(args)
  }
  if (typeof fn === 'function') {
    args = scanArgs(args)
    // console.log(`5will recall za by function first element`, args)
    return fn(...args)
  }
}
za.__za_fn = true

module.exports = {
  za,
  z: new Proxy(z, {
    set: () => false,
    get: (O, prop) => {
      if (prop === 'defns') {
        return O.defns
      }
      return ns.system[prop]
    },
  }),
  ns,
}
