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
        this.value = iterable
        this.type = arg.type || 'array'
        return this
      }
    }
    if (Array.isArray(arg)) {
      this.value = gen.arr(arg)
      this.type = 'array'
      return this
    }
    if (typeof arg === 'object' && !this.value) {
      this.value = gen.obj(arg)
      this.keys = Object.keys(arg)
      this.type = 'object'
      return this
    }
    throw new Error('[error] unsupported argument type!')
  }

  map (fn) {
    const me = this
    const res = function * () {
      for (let el of me.value) {
        yield fn(el)
      }
    }
    res.type = me.type
    return new Lz(res)
  }

  mapvals (fn) {
    const me = this
    const res = function * () {
      for (let el of me.value) {
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
      for (let el of me.value) {
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
      for (let el of me.value) {
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
      for (let el of me.value) {
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
      for (let el of me.value) {
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
    for (let el of this.value) {
      fn(el)
    }
  }

  value () {
    if (this.type === 'array') {
      let result = []
      for (let el of this.value) {
        result.push(el)
      }
      return result
    }
    if (this.type === 'object') {
      let result = {}
      for (let el of this.value) {
        Object.assign(result, el)
      }
      return result
    }
  }

  eval (fn) {
    return typeof fn === 'function' ? fn(this.value()) : this.value()
  }

  range (from, to, step) {
    this.value = gen.range(from, to, step)
    return this
  }
}

module.exports = Lz
