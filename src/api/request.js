import Http from './http'
import Url from './config'

class Reuest {
  login(data) {
    return Http.get(Url.loginUrl, { params: data })
  }
}

export default new Reuest()
