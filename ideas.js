const { z, ns } = require('./index')

const ideas = z.defns({
  ns: 'ideas'
}, {
  log: ns.utils,
  whileMore7: function (val) {
    return z('dowhile', () => {
      const rnd = Math.random() * 100
      z(ideas.log.logging, { rnd, val, pred: rnd > val })
      return rnd > val
    })
  }
})

console.log(z(ideas.whileMore7, 7))
