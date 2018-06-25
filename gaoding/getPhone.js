const request = require('request')
const Iconv = require('iconv-lite')
const cheerio = require('cheerio')
const querystring = require('querystring')

const updateMysql = require('./mysql/updateMysql')
const selectMysql = require('./mysql/selectMysql')

const getphone = () => {
  selectMysql('website', 'company_lib', '(phone is NULL or phone = "wait") and website is not NULL   and website <> "http://"  order by id desc limit 0,1', res => {
    // console.log('res', res)
    let website = res[0]['website']
    console.log('正在爬取：', website)
    updateMysql('company_lib', {
      phone: 'w'
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
          let extractedphone = []

          pageBody.find('div').each(function(index) {
            let div = $(this)
            let stringToSearchIn = div.text()
            // let re = /(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/
              let phone = stringToSearchIn.match(/((((13[0-9])|(15[^4])|(18[0,1,2,3,5-9])|(17[0-8])|(147))\d{8})|((\d3,4|\d{3,4}-|\s)?\d{7,14}))?/g)

              for(let number of phone) {
                if(number.length > 6)  {
                  if(number.indexOf('1') === 0) {
                    if(number.length > 10) {extractedphone.push(number)}
                  } else {
                    extractedphone.push(number)
                  }
                }
              }
          })

          if (extractedphone[0]) {
            console.log('找到phone:', extractedphone)
              updateMysql('company_lib', {phone: extractedphone.join(',')}, 'website = "' + website + '"', res => {})
          } else {
            console.log('未找到phone')
          }



        }
      })

    }
  })
}

module.exports = getphone
