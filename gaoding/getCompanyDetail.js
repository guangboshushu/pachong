const request = require('request')
const Iconv = require('iconv-lite')
const cheerio = require('cheerio')
const querystring = require('querystring')
const query = require('./mysql/connection')

const getCompanyDetail = (id, callback) => {
  const url = 'http://i.cantonfair.org.cn/DataTransfer/Do'
  let post_data = 'strData=%7B%22ExhibitorID%22%3A%22'+id+'%22%2C%22IsCN%22%3A%221%22%2C%22IsAD%22%3A%22%22%2C%22CorpType%22%3A%221%22%7D&interfaceSet=ExhibitorDetail&uri=http%3A%2F%2Fi.cantonfair.org.cn%2Fcn%2FCompany%2FIndex%3Fcorpid%3D'+id+'%26corptype%3D1%26ad%3D'
  let companys = []

  request({
    encoding: null,
    url: url,
    method: "POST",
    json: true,
    headers: {
      "content-type": "application/x-www-form-urlencoded",
    },
    body: post_data
  }, (error, response, body) => {
    console.log('body', body)
    console.log('error', error)
    if (!error && response.statusCode == 200) {
      callback(body)
    } else {
      console.log(response.statusCode)
      console.log(error)
    }
  })

}

module.exports = getCompanyDetail
