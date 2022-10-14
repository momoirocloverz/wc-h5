import { mgop } from '@aligov/jssdk-mgop'
import { isZLB, ZLBJump, convert } from '../util/index'
const MGOP = (api, data, type) => {
  return new Promise((resolve, reject) => {
    mgop({
      api, // 必须
      host: 'https://mapi.zjzwfw.gov.cn/',
      dataType: 'JSON',
      type,
      appKey: 'djk0at4y+2001885902+zngwuf', // 必须
      data: convert(data),
      header: {
        Authorization: localStorage.getItem('token') || '',
        Accept: 'application/prs.xkm.v1.0.0+json',
        // isTestUrl: '1',
      },
      onSuccess: (data) => {
        if (data.data.code == 21001) {
          localStorage.removeItem('token')
          if (isZLB()) {
            ZLBJump()
          }
          reject(data.data)
        } else {
          resolve(data.data)
        }
      },
      onFail: (e) => {
        reject(e)
      }
    })
  })
}
export default MGOP
