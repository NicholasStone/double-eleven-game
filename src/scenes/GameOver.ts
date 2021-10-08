import Phaser from 'phaser'
import Scenes from '@/constants/scenes'
import Texture from '@/constants/texture'
import axios from 'axios'
import JSEncrypt from 'jsencrypt'
import pubKeyString from '@/constants/public-key'

export default class GameOver extends Phaser.Scene {
  protected score!: number

  constructor () {
    super(Scenes.GAMEOVER)
  }

  create () {
    const { width, height } = this.scale

    this.add.rectangle(width * 0.5, height * 0.5, width, height * 0.23, 0x092864, 0.5)

    this.add.image(width * 0.5, height * 0.5, Texture.Image.Wasted)
    this.score = this.scene.get(Scenes.GAME).cameras.main.scrollX
    this.postRank().then(console.log)
  }

  async postRank () {
    const player1 = sessionStorage.getItem('player1')
    const player2 = sessionStorage.getItem('player2')
    const info = JSON.parse(sessionStorage.getItem(`PLAYER_TOKEN_${player1}_${player2}`) || '')
    const data = Object.assign({}, info, { score: this.score })
    console.log(data)

    const encryptor = new JSEncrypt()
    encryptor.setPublicKey(pubKeyString)
    const rsaEncrypted = encryptor.encrypt(JSON.stringify(data))
    const { data: result } = await axios.post('/api/ranks', {
      data: rsaEncrypted
    })

    return result
  }
}
