import Phaser from 'phaser'

import Texture from '@/constants/texture'
import NumberSettings from '@/constants/number-settings'
import DogeProperty from '@/constants/doge-property'
import Scenes from '@/constants/scenes'
import Tube from '@/game/Tube'

type BuffPack = {
  buff: DogeProperty.Buff;
  diff: number;
  origin: number;
  current: number;
}

export default class Player extends Phaser.GameObjects.Container {
  private _objectState: DogeProperty.State = DogeProperty.State.Forward
  private _objectGravityY = 0

  private buff: Array<BuffPack> = []

  protected object!: Phaser.GameObjects.Image
  objectBody!: Phaser.Physics.Arcade.Body

  protected bindJump!: Function
  private jumpVelocity = NumberSettings.GoUpVelocity

  get objectState (): DogeProperty.State {
    return this._objectState
  }

  set objectState (value: DogeProperty.State) {
    this._objectState = value
  }

  get objectGravityY (): number {
    return this._objectGravityY
  }

  set objectGravityY (value: number) {
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

  setBuff (buff: DogeProperty.Buff) {
    const buffPack: BuffPack = {
      buff,
      diff: 0,
      origin: 0,
      current: 0
    }

    switch (buff) {
      case DogeProperty.Buff.NONE:
        this.objectGravityY = NumberSettings.GravityY
        this.jumpVelocity = NumberSettings.GoUpVelocity
        this.buff = []
        break

      case DogeProperty.Buff.MOER_GRAVITY:
        buffPack.diff = NumberSettings.MoreGravityDiff
        buffPack.origin = this.objectGravityY
        buffPack.current = this.objectGravityY += NumberSettings.MoreGravityDiff
        break
      case DogeProperty.Buff.LESS_GRAVITY:
        buffPack.diff = NumberSettings.LessGravityDiff
        buffPack.origin = this.objectGravityY
        buffPack.current = this.objectGravityY += NumberSettings.LessGravityDiff
        break
      case DogeProperty.Buff.LESS_UPPER_VELOCITY:
        buffPack.diff = NumberSettings.LessUpperVelocity
        buffPack.origin = this.objectGravityY
        buffPack.current = this.jumpVelocity += NumberSettings.LessUpperVelocity
        break
      case DogeProperty.Buff.MORE_UPPER_VELOCITY:
        buffPack.diff = NumberSettings.MoreUpperVelocity
        buffPack.origin = this.objectGravityY
        buffPack.current = this.jumpVelocity += NumberSettings.MoreUpperVelocity
        break
      case DogeProperty.Buff.INVINCIBLE:
        this.objectBody.setBounceY(1)
        this.objectBody.setCollideWorldBounds(true)

        setTimeout(() => {
          this.objectBody.setBounceY(0)
          this.objectBody.setCollideWorldBounds(false)
          this.buff.splice(this.buff.indexOf(buffPack), 1)
        }, 5000)

        break
    }

    this.buff.push(buffPack)
  }

  dead (tube?: Tube) {
    if (this.buff) {
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
