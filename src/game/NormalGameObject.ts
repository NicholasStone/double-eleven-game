import Phaser from 'phaser'
import Texture from '@/constants/texture'

export default class NormalGameObject extends Phaser.GameObjects.Container {
  public texture: Texture.Object | Texture.Charactor

  protected object: Phaser.GameObjects.Image
  objectBody: Phaser.Physics.Arcade.Body

  constructor (scene: Phaser.Scene, x: number, y: number, texture: Texture.Charactor | Texture.Object) {
    super(scene, x, y)
    this.texture = texture

    this.object = scene.add.image(0, 0, texture).setOrigin(0, 0)
    this.add(this.object)

    scene.physics.add.existing(this)

    const { width, height } = this.object
    this.objectBody = this.body as Phaser.Physics.Arcade.Body
    this.objectBody.setSize(width, height)
    // this.objectBody.setOffset(width * 0.5, height * 0.5)
  }

  preUpdate () {
    if (this.objectBody.onOverlap) console.log(this.objectBody.onOverlap, this.texture)
  }
}
