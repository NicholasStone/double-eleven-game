import Phaser from 'phaser'
import Texture from '@/constants/texture'
import NormalGameObject from '@/game/NormalGameObject'

export default class LootBox extends NormalGameObject {
  constructor (scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, Texture.Charactor.Husky)

    this.object = scene.add.image(0, 0, Texture.Charactor.Husky).setOrigin(0, 0)
    this.add(this.object)

    scene.physics.add.existing(this)

    const { width, height } = this.object
    this.objectBody = this.body as Phaser.Physics.Arcade.Body
    this.objectBody.setSize(width, height)
  }

  handleOverlapped (nextPositionX?: number, nextPositionY?: number) {
    console.log('overlapped')
    this.objectBody.setEnable(false)
    setTimeout(() => {
      this.setPosition(nextPositionX, nextPositionY)
      this.objectBody.setEnable(true)
    }, 500)
  }
}
