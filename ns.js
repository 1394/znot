const LocalsPropName = '__$locals'
const _isPromise = p => p && typeof p.then === 'function' && typeof p.catch === 'function' && typeof p.finally === 'function'

module.exports = (opts, init) => {
  const { ns, locals } = opts
  if (typeof ns !== 'string') {
    const error = `namespace[${ns}] must be string!`
    throw new Error(error)
  }
  const namespace = new Map(Object.entries(init).filter(([name]) => name !== LocalsPropName))
  namespace.set('_ns', ns)
  namespace.set('_keys', Object.keys(init))
  // make namespace 'locals' object
  if (locals && typeof locals === 'object' && !Array.isArray(locals)) {
    namespace.set(LocalsPropName, Object.keys(locals).reduce((acc, prop) => {
      acc['$' + prop] = locals[prop]
      return acc
    }, {}))
  } else {
    namespace.set(LocalsPropName, {})
  }

  const setProp = (prop, value) => {
    if (prop.startsWith('$')) {
      const locals = namespace.get(LocalsPropName)
      locals[prop] = value
      namespace.set(LocalsPropName, locals)
      return true
    } else {
      console.error(`local variable name ${ns}.${prop} must be started with $`)
      return false
    }
  }

  namespace.set('let', (k, v, fn) => {
    setProp(k, v)
    if (typeof fn === 'function') {
      if (_isPromise(fn)) {
        return fn(v).finally(() => setProp(k, undefined))
      } else {
        const result = fn(v)
        setProp(k, undefined)
        return result
      }
    }
  })

  namespace.set('iflet', (k, v, fn, elseFn) => {
    setProp(k, v)
    if (typeof fn === 'function' && v) {
      return fn(v)
    } else {
      if (!v && typeof elseFn === 'function') {
        return elseFn(v)
      }
    }
    return !!v
  })

  return new Proxy(namespace, {
    get: (O, prop) => {
      if (typeof prop !== 'string') {
        return
      }
      if (prop === '_getLocals') {
        return O.get(LocalsPropName)
      }
      if (prop.startsWith('$')) {
        return O.get(LocalsPropName)[prop]
      }
      if (O.has(prop)) {
        return O.get(prop)
      } else {
        // console.error(`namespace.${ns} error: function [${prop}] is not exist`)
        const error = `namespace.${ns} error: function [${prop}] is not exist`
        throw new Error(error)
      }
    },
    set: (O, localProp, value) => {
      return setProp(localProp, value)
    },
  })
}
