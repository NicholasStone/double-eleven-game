import Phaser from 'phaser'
import Texture from '@/constants/texture'
import NormalGameObject from '@/game/NormalGameObject'

export default class LootBox extends NormalGameObject {
  private animePlay: number = -1

  constructor (scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, Texture.Charactor.Husky)
    this.addBody()
  }

  handleOverlapped () {
    if (this.animePlay < 0) {
      console.log('start anime')
      this.objectBody.setEnable(false)
      this.animePlay = window.setTimeout(() => {
        this.objectBody.setEnable(true)
        this.animePlay = -1
      }, 5000)
    }
  }
}
