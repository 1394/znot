module.exports = (ns, opts = {}) => {
  const { required } = opts
  const namespace = new Map(required)
  namespace.set('_ns', ns)
  // make namespace 'locals' object
  if (!namespace.has('locals')) {
    namespace.set('locals', {})
  }
  namespace.set('defn', (name, fn) => {
    if (name !== 'defn') {
      namespace.set(name, fn)
    } else {
      throw new Error('error: namespace function name cant be reserved word')
    }
  })
  return new Proxy(namespace, {
    get: (O, prop) => {
      if (O.has(prop)) {
        return O.get(prop)
      } else {
        const error = `namespace.${O.get('_ns')} error: function [${prop}] is not exist`
        throw new Error(error)
      }
    }
  })
}
