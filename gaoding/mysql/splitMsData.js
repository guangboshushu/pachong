const splitMysqlData = (data) => {
  const key = []
  const val = []
  const kv = []

  if (data.count === 'add') {
    delete data.count
    for (let k in data) {
      if (data[k] !== 'null' && data[k] !== null) {
        let STR = data[k]
        STR = STR.toString().replace(/\'/g, "\"")
        val.push('\'' + STR + '\'')
        key.push(k)
        kv.push(k + '=' + STR)
      }
    }
  } else {
    for (let k in data) {
      if (data[k] !== 'null' && data[k] !== null) {
        let STR = data[k]
        STR = STR.toString().replace(/\'/g, "\"")
        val.push(' \'' + STR + '\' ')
        key.push(k)
        kv.push(k + '=' + ' \'' + STR + '\' ')
      }
    }
  }
  let keyStr = key.toString()
  let valStr = val.toString()
  let kvStr = kv.toString()
  return ({
    key: keyStr,
    val: valStr,
    kv: kvStr
  })
}
module.exports = splitMysqlData
