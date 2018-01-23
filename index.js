global.Promise = require('bluebird')

const hf = require('human-format')
const limit = require('limit-concurrency-decorator').default

function main () {
  const f = limit(1)(() => Promise.resolve())

  let i
  const loop1 = () => {
    if (i++ < 2e1) {
      j = 0
      return loop2().then(loop1)
    }
  }

  let j
  const loop2 = () => {
    if (j++ < 2e5) {
      f('foo', 'bar', 'baz', 'qux', 1, 2, 3)
      return f('foo', 'bar', 'baz', 'qux', 1, 2, 3).then(loop2)
    }
    const { heapUsed, heapTotal} = process.memoryUsage()
    console.log('%d: %s / %s', i, hf(heapUsed), hf(heapTotal))
    return Promise.resolve()
  }

  i = 0
  return loop1()
}
main()
