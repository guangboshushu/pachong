const request = require('request')
const Iconv = require('iconv-lite')
const cheerio = require('cheerio')
const querystring = require('querystring')

const updateMysql = require('./mysql/updateMysql')
const selectMysql = require('./mysql/selectMysql')

const getEmail = () => {
  selectMysql('website', 'company_lib', 'email is NULL and website is not NULL and website <> "http://"  order by id desc limit 0,1', res => {
    let website = res[0]['website']
    console.log('正在爬取：', website)
    updateMysql('company_lib', {
      email: 'wait'
    }, 'website = "' + website + '"', res => {})
    if (website.length > 8) {

      request({
        encoding: null,
        url: website,
        method: "get",
      }, (error, response, body) => {
        if (!error && response.statusCode == 200) {
          console.log('正在处理中 ...')
          let bd = Iconv.decode(body, 'utf-8').toString()
          let $ = cheerio.load(bd)
          let pageBody = $('body')
          let extractedEmail = ''

          pageBody.find('div').each(function(index) {
            let div = $(this)
            let stringToSearchIn = div.html()
            let re = /(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/
            if (re.exec(stringToSearchIn)) {
              extractedEmail = re.exec(stringToSearchIn)
            }
          })

          let data = {}

          if (extractedEmail[0]) {
            let email = extractedEmail[0]
            data.email = email
            console.log('找到email:', email)
          } else {
            data.email = 'none'
            console.log('未找到email')
          }

          updateMysql('company_lib', data, 'website = "' + website + '"', res => {})

        } else {
          let data = {
            email: 'none'
          }
          updateMysql('company_lib', data, 'website = "' + website + '"', res => {})
        }
      })

    }
  })
}

module.exports = getEmail
