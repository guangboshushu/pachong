const getCo = require('./getCo.js')
let i = 400

const go = () => {
   getCo(i)
  console.log('make categoryno', i)
  i += 1
  if (i > 2500) {
    clearInterval(go)
  }
}
setInterval(go, 2000)
