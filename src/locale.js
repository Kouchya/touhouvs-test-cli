let lang = ['zh_cn']
let part = ['char', 'reminder']
let langSet = {}

lang.forEach(function (l) {
  langSet[l] = {}
  part.forEach(function (p) {
    const key = `./data/${l}/${p}.json`
    try {
      langSet[l][p] = require(key)
    } catch (e) {
      console.warn(`${key} is missing.`)
    }
  })
})
require('fs').writeFileSync(`${__dirname}/locale.generated.json`, JSON.stringify(langSet))