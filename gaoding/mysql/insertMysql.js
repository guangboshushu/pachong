const connection = require('./connection')
const splitMsData = require('../splitMsData.js')

const insertMysql = (table, data, callback) => {
  const d = splitMsData(data)
  let keyStr = d.key
  let valStr = d.val

  connection.query('insert into ' + table + ' (' + keyStr + ') values (' + valStr + ')', function (error, results, fields) {
    const res = {}
    if (error) {
      throw error
      res.result = false
      res.action = 'insert'
      res.OkPacket = results
    } else {
      res.result = true
      res.action = 'insert'
      res.OkPacket = results
    }
    callback(res)
  })
}

module.exports = insertMysql
