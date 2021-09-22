import Phaser from 'phaser'
import Texture from '@/constants/texture'
import IObjectType from '@/game/IObjectType'
import { ObjectTypes } from '@/constants/object-types'

export default abstract class NormalGameObject extends Phaser.GameObjects.Container implements IObjectType {
  public objectType!: ObjectTypes
  public texture: Texture.Object | Texture.Charactor

  protected object!: Phaser.GameObjects.Sprite
  objectBody!: Phaser.Physics.Arcade.Body

  protected constructor (scene: Phaser.Scene, x: number, y: number, texture: Texture.Charactor | Texture.Object) {
    super(scene, x, y)
    this.texture = texture

    this.addObject()
  }

  protected addObject () {
    this.object = this.scene.add.sprite(0, 0, this.texture).setOrigin(0, 0)
    this.add(this.object)
  }

  protected addBody () {
    this.scene.physics.add.existing(this)

    const { width, height } = this.object
    this.objectBody = this.body as Phaser.Physics.Arcade.Body
    this.objectBody.setSize(width, height)
  }
}
