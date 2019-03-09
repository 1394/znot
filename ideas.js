const z = require('./index')

const ideas = z.defns('ideas')

ideas.defn('whileMore7', function (val) {
  return z(z.dowhile, () => {
    const rnd = Math.random() * 100
    console.log({ rnd, val, pred: rnd > val })
    return rnd > val
  })
})

console.log(z(ideas.whileMore7, 7))
