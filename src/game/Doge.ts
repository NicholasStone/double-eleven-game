import Phaser from 'phaser'

import Texture from '@/constants/texture'
import NumberSettings from '@/constants/number-settings'
import DogeState from '@/constants/doge'
import Scenes from '@/constants/scenes'

export default class Doge extends Phaser.GameObjects.Container {
  protected doge!: Phaser.GameObjects.Image
  protected objectBody!: Phaser.Physics.Arcade.Body
  protected objectState: DogeState = DogeState.Forward
  protected bindJump!: Function

  constructor (scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y)

    this.doge = scene.add.image(0, 0, Texture.Charactor.Akita).setOrigin(0, 0)
    this.add(this.doge)

    scene.physics.add.existing(this)

    this.objectBody = this.body as Phaser.Physics.Arcade.Body
    this.objectBody.setSize(this.doge.width, this.doge.height)
    this.objectBody.setCollideWorldBounds(true)
    this.objectBody.setVelocityX(200)
    this.objectBody.setGravity(NumberSettings.GravityX, NumberSettings.GravityY)

    this.bindJump = this.jump.bind(this)

    scene.input.keyboard.on('keyup-SPACE', this.bindJump)
    scene.input.on('pointerdown', this.bindJump)
  }

  preUpdate () {
    if (this.scene.scene.isActive(Scenes.GAMEOVER)) return

    switch (this.objectState) {
      case DogeState.Dead:
        break
      case DogeState.Forward:
        if (this.objectBody.blocked.down || this.objectBody.blocked.up) {
          this.dead()
        }
        break
    }
  }

  protected dead () {
    this.objectBody.setGravity(0, 0)
    this.objectBody.setVelocity(0)
    this.objectBody.setAcceleration(0, 0)

    this.scene.input.keyboard.off('keyup-SPACE', this.bindJump)
    this.scene.input.off('pointerdown', this.bindJump)

    this.scene.scene.run(Scenes.GAMEOVER)
  }

  protected jump () {
    this.objectBody.setGravityY(0)
    this.objectBody.setVelocityY(NumberSettings.GoUpVelocity)
    this.objectBody.setGravityY(NumberSettings.GravityY)
  }
}
