"use strict"

if (process.argv[2] !== '--native') {
  global.Promise = require("bluebird")
}

var hf = require("human-format")
var limit = require("limit-concurrency-decorator").default

function main() {
  console.log("Node version: %s", process.version)
  var time = Date.now()
  var f = limit(1)(function() {
    return Promise.resolve()
  })

  var i
  function loop1 () {
    if (i++ < 2e1) {
      j = 0
      return loop2().then(loop1)
    }
    var diff = Date.now()
    console.log("Benchmark took %d seconds", (diff - time) / 1000)
  }

  var j
  function loop2 () {
    if (j++ < 2e5) {
      f("foo", "bar", "baz", "qux", 1, 2, 3)
      return f("foo", "bar", "baz", "qux", 1, 2, 3).then(loop2)
    }
    var memoryUsage = process.memoryUsage()
    var heapUsed = memoryUsage.heapUsed
    var heapTotal = memoryUsage.heapTotal

    console.log("%d: %s / %s", i, hf(heapUsed), hf(heapTotal))
    return Promise.resolve()
  }

  i = 0
  return loop1()
}
main()
