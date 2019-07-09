const Lz = require('lz')

const memoryUsage = Lz.seq(process.memoryUsage)

const r = new Lz(memoryUsage)
r.map(val => {
  return new Lz(val)
    .find(el => el.heapUsed)
    .mapvals(el => `${(el / 1024).toFixed(2)} kB`)
    .eval()
})

r.map(el => el.heapUsed).take(20).eval(console.log)
