// const { array: mA, object: mO } = require('@dmitri.leto/manipula')

/* eslint-disable semi */
const gen = {
  isIterable: (val) => {
    return typeof val[Symbol.iterator] === 'function'
  },
  arr: function * (arr) {
    for (let el of arr) {
      yield el
    }
  },
  obj: function * (O) {
    for (let [k, v] of Object.entries(O)) {
      yield { [k]: v }
    }
  },
  range: function * (from = 1, to, step = 1) {
    let i = from
    while (to ? (i <= to) : true) {
      yield i;
      i += step;
    }
  },
}

class Lz {
  constructor (arg = []) {
    this.gen = gen

    if (typeof arg === 'function') {
      const iterable = arg()
      if (gen.isIterable(iterable)) {
        this.iterable = iterable
        this.type = arg.type || 'array'
        return this
      }
    }
    if (Array.isArray(arg)) {
      this.iterable = gen.arr(arg)
      this.type = 'array'
      return this
    }
    if (typeof arg === 'object' && !this.iterable) {
      this.iterable = gen.obj(arg)
      this.keys = Object.keys(arg)
      this.type = 'object'
      return this
    }
    throw new Error('[error] unsupported argument type!')
  }

  static range (...args) {
    return gen.range(...args)
  }

  static seq (fn) {
    return function * () {
      while (true) {
        yield fn()
      }
    }
  }

  map (fn) {
    const me = this
    const res = function * () {
      for (let el of me.iterable) {
        yield fn(el)
      }
    }
    res.type = me.type
    return new Lz(res)
  }

  mapvals (fn) {
    const me = this
    const res = function * () {
      for (let el of me.iterable) {
        const [k, v] = Object.entries(el)[0]
        yield { [k]: fn(v) }
      }
    }
    res.type = me.type
    return new Lz(res)
  }

  mapkeys (fn) {
    const me = this
    const res = function * () {
      for (let el of me.iterable) {
        const [k, v] = Object.entries(el)
        yield { [fn(k)]: v }
      }
    }
    res.type = me.type
    return new Lz(res)
  }

  filter (fn) {
    const me = this
    const res = function * () {
      for (let el of me.iterable) {
        if (fn(el)) {
          yield el
        }
      }
    }
    res.type = me.type
    return new Lz(res)
  }

  find (fn) {
    const me = this
    const res = function * () {
      for (let el of me.iterable) {
        if (fn(el)) {
          yield el
          break
        }
      }
    }
    res.type = me.type
    return new Lz(res)
  }

  take (size) {
    const me = this
    const iterable = function * () {
      let idx = 0
      for (let el of me.iterable) {
        if (idx < size) {
          yield el
          idx++
        } else {
          break
        }
      }
    }
    iterable.type = me.type
    return new Lz(iterable)
  }

  forEach (fn) {
    for (let el of this.iterable) {
      fn(el)
    }
  }

  value () {
    if (this.type === 'array') {
      let result = []
      for (let el of this.iterable) {
        result.push(el)
      }
      return result
    }
    if (this.type === 'object') {
      let result = {}
      for (let el of this.iterable) {
        Object.assign(result, el)
      }
      return result
    }
  }

  eval (fn) {
    return typeof fn === 'function' ? fn(this.value()) : this.value()
  }

  range (from, to, step) {
    this.iterable = gen.range(from, to, step)
    return this
  }

  first () {
    if (!this.iterable) {
      return
    }
    const { value, done } = this.iterable.next()
    return done ? false : value
  }

  next () {
    this.first()
    return [...this.iterable]
  }
}

module.exports = Lz
