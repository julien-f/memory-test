"use strict"

global.Promise = require('bluebird')

const hf = require('human-format')
const limit = require('limit-concurrency-decorator').default

function main () {
  console.log('Node version: %s', process.version)
  const time = Date.now()
  const f = limit(1)(() => Promise.resolve())

  let i
  const loop1 = () => {
    if (i++ < 2e1) {
      j = 0
      return loop2().then(loop1)
    }
    const diff = Date.now()
    console.log('Benchmark took %f seconds', (diff - time) / 1000)
  }

  let j
  const loop2 = () => {
    if (j++ < 2e5) {
      f('foo', 'bar', 'baz', 'qux', 1, 2, 3)
      return f('foo', 'bar', 'baz', 'qux', 1, 2, 3).then(loop2)
    }
    const memoryUsage = process.memoryUsage()
    const heapUsed = memoryUsage.heapUsed
    const heapTotal = memoryUsage.heapTotal

    console.log('%d: %s / %s', i, hf(heapUsed), hf(heapTotal))
    return Promise.resolve()
  }

  i = 0
  return loop1()
}
main()
