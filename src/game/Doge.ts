import Phaser from 'phaser'

import Texture from '@/constants/texture'
import NumberSettings from '@/constants/number-settings'
import DogeProperty from '@/constants/doge-property'
import Scenes from '@/constants/scenes'
import Tube from '@/game/Tube'

export default class Doge extends Phaser.GameObjects.Container {
  private _objectState: DogeProperty.State = DogeProperty.State.Forward
  private _buff: DogeProperty.Buff = DogeProperty.Buff.NONE
  private _objectGravityY = 0

  protected object!: Phaser.GameObjects.Image
  objectBody!: Phaser.Physics.Arcade.Body

  protected bindJump!: Function
  protected jumpVelocity = NumberSettings.GoUpVelocity

  get objectState (): DogeProperty.State {
    return this._objectState
  }

  set objectState (value: DogeProperty.State) {
    this._objectState = value
  }

  get buff (): DogeProperty.Buff {
    return this._buff
  }

  set buff (value: DogeProperty.Buff) {
    this._buff = value

    this.objectBody.setBounceY(0)
    this.objectBody.setCollideWorldBounds(false)

    switch (value) {
      case DogeProperty.Buff.MOER_GRAVITY:
        this.objectBody.setGravityY(NumberSettings.GravityY + NumberSettings.LessGravityDiff)
        break
      case DogeProperty.Buff.LESS_GRAVITY:
        this.objectBody.setGravityY(NumberSettings.GravityY + NumberSettings.MoreGravityDiff)
        break
      case DogeProperty.Buff.LESS_UPPER_VELOCITY:
        this.jumpVelocity += NumberSettings.LessUpperVelocity
        break
      case DogeProperty.Buff.MORE_UPPER_VELOCITY:
        this.jumpVelocity += NumberSettings.MoreUpperVelocity
        break
      case DogeProperty.Buff.INVINCIBLE:
        this.objectBody.setBounceY(1)
        this.objectBody.setCollideWorldBounds(true)
        break
    }
  }

  get objectGravityY (): number {
    return this._objectGravityY
  }

  set objectGravityY (value: number) {
    console.log(value)
    if (this._objectGravityY === value) return

    this._objectGravityY = value
    this.objectBody.setGravityY(value)
  }

  constructor (scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y)

    this.object = scene.add.image(0, 0, Texture.Charactor.Akita).setOrigin(0, 0)
    this.add(this.object)

    scene.physics.add.existing(this)

    this.objectBody = this.body as Phaser.Physics.Arcade.Body
    this.objectBody.setSize(this.object.width, this.object.height)
    this.objectBody.setCollideWorldBounds(true)
    this.objectBody.setVelocityX(200)
    this.objectBody.setGravityX(NumberSettings.GravityX)
    this.objectGravityY = NumberSettings.GravityY

    this.bindJump = this.jump.bind(this)

    scene.input.keyboard.on('keyup-SPACE', this.bindJump)
    scene.input.on('pointerdown', this.bindJump)
  }

  preUpdate () {
    if (this.scene.scene.isActive(Scenes.GAMEOVER)) return

    switch (this.objectState) {
      case DogeProperty.State.Dead:
        break
      case DogeProperty.State.Forward:
        if (this.objectBody.blocked.down || this.objectBody.blocked.up) {
          this.dead()
        }
        break
    }
  }

  dead (tube?: Tube) {
    if (this.buff === DogeProperty.Buff.INVINCIBLE) {
      tube?.handleImpact()
      return
    }
    this.objectBody.setGravity(0, 0)
    this.objectBody.setVelocity(0)
    this.objectBody.setAcceleration(0, 0)

    this.scene.input.keyboard.off('keyup-SPACE', this.bindJump)
    this.scene.input.off('pointerdown', this.bindJump)

    this.scene.scene.run(Scenes.GAMEOVER)
  }

  jump () {
    this.objectBody.setVelocityY(this.jumpVelocity)
  }
}
