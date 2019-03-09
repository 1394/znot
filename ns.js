const LocalsPropName = '__$locals'

module.exports = (opts, init) => {
  const { ns, locals } = opts
  if (typeof ns !== 'string') {
    const error = `namespace[${ns}] must be string!`
    throw new Error(error)
  }
  const namespace = new Map(Object.entries(init).filter(([name]) => name !== LocalsPropName))
  namespace.set('_ns', ns)
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
    const locals = namespace.get(LocalsPropName)
    locals[prop] = value
    namespace.set(LocalsPropName, locals)
  }

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
      if (!localProp.startsWith('$')) {
        console.error(`local var ${localProp} is not existed in namespace ${ns}`)
        return false
      } else {
        setProp(localProp, value)
        return true
      }
    }
  })
}
