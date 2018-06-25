const getEmail = require('./getEmail.js')
const go = () => {
   getEmail()
}
setInterval(go, 2500)
