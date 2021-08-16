import Phaser from 'phaser'

import Texture from '@/constants/texture'
import NumberSettings from '@/constants/number-settings'
import PlayerProperty from '@/constants/player-properties'
import Scenes from '@/constants/scenes'
import Tube from '@/game/Tube'
import Animates from '@/constants/animates'

type BuffPack = {
  buff: PlayerProperty.Buff;
  diff: number;
  origin: number;
  current: number;
}

export default class Player extends Phaser.GameObjects.Container {
  private _objectState: PlayerProperty.State = PlayerProperty.State.Alive
  private _objectGravityY = 0

  private buff: Array<BuffPack> = []

  protected object!: Phaser.GameObjects.Sprite
  protected effect!: Phaser.GameObjects.Sprite
  protected objectBody!: Phaser.Physics.Arcade.Body

  protected bindJump!: () => void
  private jumpVelocity = NumberSettings.GoUpVelocity

  get objectState (): PlayerProperty.State {
    return this._objectState
  }

  set objectState (value: PlayerProperty.State) {
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

  constructor (scene: Phaser.Scene, x: number, y: number, type: 'red' | 'blue') {
    super(scene, x, y)

    this.object = scene.add
      .sprite(0, 0, type === 'red' ? Texture.Charactor.RedBird : Texture.Charactor.BlurBird, 'frame_01.png ')
      .setOrigin(0, 0)
      .setFlipX(true)
      .play(type === 'red' ? Animates.RedBirdFly : Animates.BlueBirdFly)
    this.add(this.object)

    this.effect = scene.add
      .sprite(0, 0, Texture.Effects.Buff_1, 'buff_1_1.png')
      .setOrigin(0.25, 0.25)
      .setVisible(false)
    this.add(this.effect)

    scene.physics.add.existing(this)

    this.objectBody = this.body as Phaser.Physics.Arcade.Body
    this.objectBody.setSize(this.object.width, this.object.height)
    this.objectBody.setCollideWorldBounds(true)
    this.objectBody.setVelocityX(200)
    this.objectBody.setGravityX(NumberSettings.GravityX)
    this.objectGravityY = NumberSettings.GravityY

    this.bindJump = this.jump.bind(this)
    this.setBuff(PlayerProperty.Buff.IMMORTAL)

    setTimeout(() => this.playEffect(Animates.Effects.Example), 2000)
  }

  preUpdate () {
    if (this.scene.scene.isActive(Scenes.GAMEOVER)) return

    switch (this.objectState) {
      case PlayerProperty.State.Dead:
        break
      case PlayerProperty.State.Alive:
        if (this.objectBody.blocked.down || this.objectBody.blocked.up) {
          this.dead()
        }
        break
    }
  }

  setBuff (buff: PlayerProperty.Buff) {
    const buffPack: BuffPack = {
      buff,
      diff: 0,
      origin: 0,
      current: 0
    }

    switch (buff) {
      case PlayerProperty.Buff.NONE:
        this.objectGravityY = NumberSettings.GravityY
        this.jumpVelocity = NumberSettings.GoUpVelocity
        this.buff = []
        break

      case PlayerProperty.Buff.MOER_GRAVITY:
        buffPack.diff = NumberSettings.MoreGravityDiff
        buffPack.origin = this.objectGravityY
        buffPack.current = this.objectGravityY += NumberSettings.MoreGravityDiff
        break
      case PlayerProperty.Buff.LESS_GRAVITY:
        buffPack.diff = NumberSettings.LessGravityDiff
        buffPack.origin = this.objectGravityY
        buffPack.current = this.objectGravityY += NumberSettings.LessGravityDiff
        break
      case PlayerProperty.Buff.LESS_UPPER_VELOCITY:
        buffPack.diff = NumberSettings.LessUpperVelocity
        buffPack.origin = this.objectGravityY
        buffPack.current = this.jumpVelocity += NumberSettings.LessUpperVelocity
        break
      case PlayerProperty.Buff.MORE_UPPER_VELOCITY:
        buffPack.diff = NumberSettings.MoreUpperVelocity
        buffPack.origin = this.objectGravityY
        buffPack.current = this.jumpVelocity += NumberSettings.MoreUpperVelocity
        break
      case PlayerProperty.Buff.IMMORTAL:
        this.objectState = PlayerProperty.State.Immortal
        this.objectBody.setBounceY(1)
        buffPack.buff = PlayerProperty.Buff.IMMORTAL

        setTimeout(() => {
          this.objectBody.setBounceY(0)
          this.buff.splice(this.buff.indexOf(buffPack), 1)
          this.objectState = PlayerProperty.State.Alive
        }, 5000)

        break
    }

    this.buff.push(buffPack)
  }

  getBuffList () {
    return this.buff.map(item => item.buff)
  }

  playEffect (effect: Animates.Effects) {
    this.effect
      .setVisible(true)
      .play(effect)
      .on(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
        this.effect.setVisible(false)
      })
  }

  dead (tube?: Tube, ignoreImmortal = false) {
    if (this.objectState === PlayerProperty.State.Immortal && !ignoreImmortal) {
      tube?.handleImpact()
      return
    }
    this.object.stop()
    this.objectBody.setGravity(0, 0)
    this.objectBody.setVelocity(0)
    this.objectBody.setAcceleration(0, 0)
    this.objectState = PlayerProperty.State.Dead

    // this.scene.input.keyboard.off('keyup-SPACE', this.bindJump)
    // this.scene.input.off('pointerdown', this.bindJump)

    this.scene.scene.run(Scenes.GAMEOVER)
  }

  jump () {
    if (this.objectState === PlayerProperty.State.Dead || this.scene.scene.isActive(Scenes.GAMEOVER)) return

    this.objectBody.setVelocityY(this.jumpVelocity)
  }
}
