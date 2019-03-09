const LocalsPropName = '__$locals'

module.exports = (opts, init) => {
  const { ns, required, locals } = opts
  const namespace = new Map(Object.entries(init).filter(([name]) => name !== LocalsPropName))
  namespace.set('_ns', ns)
  // make namespace 'locals' object
  if (locals && typeof locals === 'object' && !Array.isArray(locals)) {
    namespace.set('__$locals', Object.keys(locals).reduce((acc, prop) => {
      acc['$' + prop] = locals[prop]
    }, {}))
  } else {
    namespace.set(LocalsPropName, {})
  }

  return new Proxy(namespace, {
    get: (O, prop) => {
      if (prop.startsWith('$')) {
        return O.get(LocalsPropName)[prop]
      }
      if (O.has(prop)) {
        return O.get(prop)
      } else {
        const error = `namespace.${ns} error: function [${prop}] is not exist`
        throw new Error(error)
      }
    },
    set: (O, localProp, value) => {
      if (!localProp.startsWith('$')) {
        console.error(`local var ${localProp} is not existed in namespace ${ns}`)
        return false
      }
      O.set('')
      console.error('namespace readonly after initialize!')
      return false
    }
  })
}
