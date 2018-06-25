const connection = require('./connection')

const selectMysqlFields = (fieldsStr, table, query, callback) => {
  connection.query("select " + fieldsStr + " from " + table + " where " + query, (err, rows, fields) => {
    if (err) {
      throw err
      callback(false)
    }
    if (rows.length > 0) {
      callback(rows)
    } else {
      callback(null)
    }
  })
}

module.exports = selectMysqlFields
