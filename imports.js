const { z } = require('./z')

function getAllMethodNames (obj) {
  const methods = Object.getOwnPropertyNames(obj)
  // let methods = new Set()
  // while (obj = Reflect.getPrototypeOf(obj)) {
  //   let keys = Reflect.ownKeys(obj)
  //   keys.forEach((k) => methods.add(k))
  // }
  return methods
}

const getInstanceMethods = (obj, ns) => {
  const props = getAllMethodNames(obj)
  const methods = {}
  props.forEach(prop => {
    if (typeof obj[prop] === 'function') {
      methods[prop] = function (...args) {
        const obj = args.pop()
        return obj[prop](...args)
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

const importClass = (cls, ns, overrides) => {
  const methods = {}
  if (cls.prototype) {
    Object.assign(methods, getInstanceMethods(cls.prototype))
  }
  Object.assign(methods, getClassMethods(cls))
  z.defns({
    ns,
  }, Object.assign(methods, overrides))
}

module.exports = importClass
