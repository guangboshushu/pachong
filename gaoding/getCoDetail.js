const selectMysql = require('./mysql/selectMysql')
const updateMysql = require('./mysql/updateMysql')

const getCompanyDetail = require('./getCompanyDetail')
const querystring = require('querystring')

const getCoDetail = () => {
  selectMysql('source, nameCN', 'company_lib', 'address is  NULL  order by id desc limit 1', res => {
    let source = res[0]['source']
    console.log(source+' : ', res[0]['nameCN'])
    let id = source.replace('http://i.cantonfair.org.cn/cn/Company/Index?', '')

    id = querystring.parse(id)['corpid']

    getCompanyDetail(id, info => {

      let ReturnData = info.ReturnData
      // let nameCN = ReturnData.ExhibitorName
      if (!ReturnData.Address) {
        ReturnData.Address = 'none'
      }
      let data = {
        address: ReturnData.Address,
        zipcode: ReturnData.ZipCode,
        website: ReturnData.WebSite,
        sorceData: JSON.stringify(info),
        staffs: ReturnData.PeopleNum,
        exhFund: ReturnData.ExhFund.replace(/（万元）/, ''),
        compType: ReturnData.TypeName,
        keyword: ReturnData.KeyWord,
        introduce: ReturnData.Introduce,
        province: ReturnData.KeyWord
      }

    //  console.log('data', data)

      for (let key in data) {
        if (!data[key]) {
          delete data[key]
        }
      }

      updateMysql('company_lib', data, 'source = "' + source + '"', res => {
        if (res) {
          console.log('success', id)
        }
      })
    })
  })
}

module.exports = getCoDetail
