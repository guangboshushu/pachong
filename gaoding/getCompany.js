const request = require('request')
const Iconv = require('iconv-lite')
const cheerio = require('cheerio')
const query = require('./mysql/connection')
const insertMysql = require('./mysql/insertMysql')
const selectMysql = require('./mysql/selectMysql')

// selectMysql('*', 'staff', 'id > 0', res => {
//   console.log(res)
// })


const getCompany = (categoryno, page) => {

  let url = 'http://www.cantonfair.org.cn/cn/preview/previewCompany.aspx?categoryno=' + categoryno + '&page=' + page
  let companys = []

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

      cos.find('tr').each(function(index, item) {
        let tr = $(this)
        let co = {}
        if (index > 0) {
          tr.find('td').each(function(idx, itm) {
            let td = $(this)
            let link = td.find('a').attr('href')

            if (idx % 2) {
              co.name_en = td.text()
              selectMysql('name_cn', 'company_lib', 'name_cn = "' + co.name_cn + '"', res => {
                if (!res) {
                  insertMysql('company_lib', co, res => {
                    if (res) {
                      console.log('success')
                    } else {
                      console.log(co.name_cn + 'faile')
                    }
                  })
                } else {
                  console.log(co.name_cn + '  => 正在处理 ...')
                  console.log('抓取成功!')
                  console.log('')
                }
              })

            } else {
              co.name_cn = td.text()
              co.source = link
            }
          })

        }

      })
    }
  })
}
module.exports = getCompany
