import NormalGameObject from '@/game/NormalGameObject'
import Phaser from 'phaser'
import Texture from '@/constants/texture'

export default class Tube extends NormalGameObject {
  effective = true

  constructor (scene: Phaser.Scene, x: number, y: number, type: Texture.Object.TubeLong | Texture.Object.TubeShort) {
    super(scene, x, y, type)

    this.addBody()
  }

  handleImpact () {
    this.effective = false
    this.objectBody.setGravityY(2000)
  }
}
