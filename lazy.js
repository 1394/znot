class Lazy {
  constructor (iterable, callback) {
    this.iterable = iterable
    this.callback = callback
  }

  filter (callback) {
    return new LazyFilter(this, callback)
  }

  map (callback) {
    return new LazyMap(this, callback)
  }

  next () {
    return this.iterable.next()
  }

  take (n) {
    const values = []
    for (let i = 0; i < n; i++) {
      values.push(this.next().value)
    }

    return values
  }
}

class LazyFilter extends Lazy {
  next () {
    while (true) {
      const item = this.iterable.next()

      if (this.callback(item.value)) {
        return item
      }
    }
  }
}

class LazyMap extends Lazy {
  next () {
    const item = this.iterable.next()

    const mappedValue = this.callback(item.value)
    return { value: mappedValue, done: item.done }
  }
}

module.exports = Lazy
