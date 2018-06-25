const request = require('request')
const Iconv = require('iconv-lite')
const cheerio = require('cheerio')

const getCompany = require('./getCompany')

// 查找 是否存在
// 查找页数

const getPages = (categoryno) => {
 let url = 'http://www.cantonfair.org.cn/cn/preview/previewCompany.aspx?categoryno=' + categoryno + '&page=1'
  request({
    encoding: null,
    url: url,
  }, (error, response, body) => {
    if (!error && response.statusCode == 200) {
      let bd = Iconv.decode(body, 'utf-8').toString()
      let $ = cheerio.load(bd)
      let cos = $('table')
      let trCount = cos.find('tr')
      if (trCount.length <= 1) {
        console.log('no data')
        return false
      }

      let pages = $('select ').find('option').length
      if (pages === 0) {
        pages = 1
      }
      console.log('共', pages + '页')
      for(let i = 1; i <= pages; i++) {
        console.log('处理第', i + '页')
        getCompany(categoryno, i)
      }
    }
  })
}
module.exports = getPages
