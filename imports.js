const { z } = require('./z')

function getAllMethodNames (obj) {
  const methods = Object.getOwnPropertyNames(obj)
  return methods
}

const getInstanceMethods = (obj, ns) => {
  const props = getAllMethodNames(obj)
  const methods = {}
  props.forEach(prop => {
    if (typeof obj[prop] === 'function') {
      methods[prop] = function (...args) {
        const obj = args.pop()
        const fn = Function.bind.call(Function.call, Object.getPrototypeOf(obj)[prop])
        return fn(obj, ...args)
      }
    } else {
      methods[prop] = (obj) => obj[prop]
    }
  })
  return methods
}

const getClassMethods = (cls) => {
  const props = getAllMethodNames(cls)
  const methods = {}
  props.forEach(prop => {
    if (typeof cls[prop] === 'function') {
      methods[prop] = function (...args) {
        return cls[prop](args.pop(), ...args)
      }
    // } else {
    //   methods[prop] = (obj) => obj[prop]
    }
  })
  return methods
}

const importClass = (cls, ns) => {
  const methods = {}
  if (cls.prototype) {
    Object.assign(methods, getInstanceMethods(cls.prototype))
  }
  Object.assign(methods, getClassMethods(cls))
  z.defns({
    ns
  }, methods)
}

module.exports = importClass
