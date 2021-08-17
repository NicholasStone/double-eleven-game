import { sha256 } from 'js-sha256'
import Config from '../config'

function generateTokenService (key: string):string {
  return sha256(key + Config.secretKey).substring(0, 10)
}

export default generateTokenService
