import Phaser from 'phaser'
import Texture from '@/constants/texture'

export default abstract class NormalGameObject extends Phaser.GameObjects.Container {
  public texture: Texture.Object | Texture.Charactor

  protected object!: Phaser.GameObjects.Image
  objectBody!: Phaser.Physics.Arcade.Body

  protected constructor (scene: Phaser.Scene, x: number, y: number, texture: Texture.Charactor | Texture.Object) {
    super(scene, x, y)
    this.texture = texture

    this.addImage()
  }

  protected addImage () {
    this.object = this.scene.add.image(0, 0, this.texture).setOrigin(0, 0)
    this.add(this.object)
  }

  protected addBody () {
    this.scene.physics.add.existing(this)

    const { width, height } = this.object
    this.objectBody = this.body as Phaser.Physics.Arcade.Body
    this.objectBody.setSize(width, height)
  }

  preUpdate () {
    if (this.objectBody.onOverlap) console.log(this.objectBody.onOverlap, this.texture)
  }
}
