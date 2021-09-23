import Phaser from 'phaser'

import Texture from '@/constants/texture'
import NumberSettings from '@/constants/number-settings'
import PlayerProperty from '@/constants/player-properties'
import Scenes from '@/constants/scenes'
import Tube from '@/game/Tube'
import Animates from '@/constants/animates'
import NormalGameObject from '@/game/NormalGameObject'
import LootBox from '@/game/LootBox'
import { getRandomInArray } from '@/shared/random'
import GameEvent from '@/constants/events'
import IObjectType from '@/game/IObjectType'
import { ObjectTypes } from '@/constants/object-types'
import InitialXVelocity = NumberSettings.InitialXVelocity

type BuffPack = {
  buff: PlayerProperty.Buff
  diff: number
  origin: number
  current: number
  expire: number
  timer?: number
  level: number
}

// interface HandleBuff {
//   ()
// }

export default class Player extends Phaser.GameObjects.Container implements IObjectType {
  objectType = ObjectTypes.Player
  objectState: PlayerProperty.State = PlayerProperty.State.Alive
  private _objectGravityY = 0

  private buff: Array<BuffPack> = []

  protected players: Array<Player> = []
  protected ghostTimeRemain = 2

  protected object!: Phaser.GameObjects.Sprite
  protected effect!: Phaser.GameObjects.Sprite
  protected objectBody!: Phaser.Physics.Arcade.Body

  protected bindJump!: () => void

  protected controlKey!: string
  protected controlEl!: string

  protected endTime = -1
  protected emitter!: Phaser.Events.EventEmitter
  protected texture!: Texture.Charactor

  private jumpVelocity = NumberSettings.GoUpVelocity

  get objectGravityY (): number {
    return this._objectGravityY
  }

  set objectGravityY (value: number) {
    if (this._objectGravityY === value) return

    this._objectGravityY = value
    this.objectBody.setGravityY(value)
  }

  constructor (scene: Phaser.Scene, x: number, y: number, type: 'red' | 'blue', playerList: Array<Player>, emitter: Phaser.Events.EventEmitter) {
    super(scene, x, y)

    this.players = playerList
    this.emitter = emitter
    this.texture = type === 'red' ? Texture.Charactor.RedBird : Texture.Charactor.BlurBird

    this.object = scene.add
      .sprite(0,
        0,
        this.texture,
        'frame_01.png ')
      .setOrigin(0, 0)
      .setFlipX(true)
      .play(type === 'red' ? Animates.RedBirdFly : Animates.BlueBirdFly)
    this.add(this.object)

    this.effect = scene.add
      .sprite(0, 0, Texture.Effects.Buff1, 'buff_1_1.png')
      .setOrigin(0.25, 0.25)
      .setVisible(false)
    this.add(this.effect)

    scene.physics.add.existing(this)

    this.objectBody = this.body as Phaser.Physics.Arcade.Body
    this.objectBody.setSize(this.object.width * 0.8, this.object.height * 0.8)
    this.objectBody.setOffset(this.objectBody.width * 0.1, this.objectBody.height * 0.1)
    this.objectBody.setCollideWorldBounds(true)
    this.objectBody.setVelocityX(InitialXVelocity)
    this.objectBody.setGravityX(NumberSettings.GravityX)
    this.objectGravityY = NumberSettings.GravityY

    this.bindJump = this.jump.bind(this)

    this.emitter.on(GameEvent.GameOver, () => this.dead())
  }

  preUpdate () {
    if (this.scene.scene.isActive(Scenes.GAMEOVER)) {
      if (this.objectState !== PlayerProperty.State.Dead) {
        this.dead()
      }
      return
    }

    if (this.endTime > 0 && this.endTime <= Date.now()) {
      this.emitter.emit(GameEvent.GameOver)
    }

    const { scrollX: leftEdge } = this.scene.cameras.main
    const rightEdge = leftEdge + this.scene.scale.width
    // 对比位置
    const { width, x, y } = this

    switch (this.objectState) {
      case PlayerProperty.State.Dead:
        break
      case PlayerProperty.State.Alive:
        if (this.objectBody.blocked.down || this.objectBody.blocked.up) {
          if (this.isOtherAlive()) {
            this.ghost()
          } else {
            this.emitter.emit(GameEvent.GameOver)
          }
        }
        break
      case PlayerProperty.State.Ghost:
        if (x > rightEdge) {
          this.setPosition(leftEdge - width - 10, y)
        }

        break
    }
  }

  setControl (key: string, controlElID: string) {
    this.controlKey = key
    this.controlEl = controlElID

    this.scene.input.keyboard.on(key, this.bindJump)
    document.getElementById(controlElID)?.addEventListener('click', this.bindJump)
  }

  unsetControl () {
    this.scene.input.keyboard.off(this.controlKey)
    document.getElementById(this.controlEl)?.removeEventListener('click', this.bindJump)
  }

  handleOverlap (object: Phaser.GameObjects.GameObject) {
    if (this.objectState === PlayerProperty.State.Dead) return

    const tube = object as Tube
    const box = object as LootBox
    const player = object as Player

    switch ((object as NormalGameObject).objectType) {
      case ObjectTypes.Obstacles:

        if (!tube.effective) return

        switch (this.objectState) {
          case PlayerProperty.State.Alive:
            if (this.isOtherAlive()) {
              this.ghost(tube)
            } else {
              this.emitter.emit(GameEvent.GameOver)
            }

            break
          case PlayerProperty.State.Immortal:
            tube.handleImpact()
            break
          case PlayerProperty.State.Ghost:
            if (this.endTime > Date.now()) {
              tube.handleImpact()
            } else {
              this.emitter.emit(GameEvent.GameOver)
            }
        }

        break
      case ObjectTypes.LootBox:
        if (this.objectState === PlayerProperty.State.Ghost) return
        this.setBuff(this.buffLoot())

        box.handleOverlapped()
        break
      case ObjectTypes.Player:
        this.reborn()
        player.reborn()
        break
      default:
        break
    }
  }

  protected isOtherAlive () {
    return this.players.filter(player => player !== this).every(player => player.objectState === PlayerProperty.State.Alive)
  }

  protected buffLoot (): PlayerProperty.Buff {
    // return 2
    const buffArray = Object.values(PlayerProperty.Buff).filter(item => typeof item === 'number')
    return getRandomInArray(buffArray) as PlayerProperty.Buff
  }

  protected reborn () {
    if (this.objectState !== PlayerProperty.State.Ghost) return
    this.objectState = PlayerProperty.State.Alive
    this.endTime = -1

    this.objectBody.setVelocity(this.objectBody.velocity.x / 4)
    this.objectBody.setAcceleration(0, 0)
    this.objectBody.setGravityX(NumberSettings.GravityX)
    this.objectGravityY = NumberSettings.GravityY
    this.objectBody.setBounceY(0)
    this.object.setAlpha(1)
    this.setControl(this.controlKey, this.controlEl)
  }

  protected setBuff (buff: PlayerProperty.Buff) {
    const createBuffPack = (): BuffPack => {
      return {
        buff,
        diff: 0,
        origin: 0,
        current: 0,
        expire: -1,
        level: 1
      }
    }

    const handleMoreGravity = () => {
      buffPack.diff = NumberSettings.MoreGravityDiff
      buffPack.origin = this.objectGravityY
      buffPack.current = this.objectGravityY += NumberSettings.MoreGravityDiff
    }

    const handleLessGravity = () => {
      buffPack.diff = NumberSettings.LessGravityDiff
      buffPack.origin = this.objectGravityY
      buffPack.current = this.objectGravityY += NumberSettings.LessGravityDiff
    }

    const handleMoreUpperVelocity = () => {
      buffPack.diff = NumberSettings.MoreUpperVelocity
      buffPack.origin = this.objectGravityY
      buffPack.current = this.jumpVelocity += NumberSettings.MoreUpperVelocity
    }

    const handleLessUpperVelocity = () => {
      buffPack.diff = NumberSettings.LessUpperVelocity
      buffPack.origin = this.objectGravityY
      buffPack.current = this.jumpVelocity += NumberSettings.LessUpperVelocity
    }

    const buffIndex = this.buff.findIndex(item => item.buff === buff)
    const buffPack = buffIndex >= 0 ? this.buff[buffIndex] : createBuffPack()
    if (buffIndex >= 0) {
      buffPack.level++
    }

    switch (buff) {
      case PlayerProperty.Buff.NONE:
        this.objectGravityY = NumberSettings.GravityY
        this.jumpVelocity = NumberSettings.GoUpVelocity
        this.buff = []
        this.objectState = PlayerProperty.State.Alive
        break

      case PlayerProperty.Buff.MOER_GRAVITY:
        handleMoreGravity()
        break

      case PlayerProperty.Buff.LESS_GRAVITY:
        handleLessGravity()
        break

      case PlayerProperty.Buff.LESS_UPPER_VELOCITY:
        handleLessUpperVelocity()
        break

      case PlayerProperty.Buff.MORE_UPPER_VELOCITY:
        handleMoreUpperVelocity()
        break

      case PlayerProperty.Buff.IMMORTAL:
        if (buffIndex >= 0) {
          // @ts-ignore
          clearTimeout(buff[buffIndex]?.timer as number)
          this.buff.splice(buffIndex, 1)
        }

        this.objectState = PlayerProperty.State.Immortal
        this.objectBody.setBounceY(1)
        buffPack.buff = PlayerProperty.Buff.IMMORTAL
        buffPack.expire = Date.now() + NumberSettings.ImmortalDuration

        buffPack.timer = window.setTimeout(() => {
          this.objectBody.setBounceY(0)
          this.buff.splice(this.buff.indexOf(buffPack), 1)
          this.objectState = PlayerProperty.State.Alive
        }, NumberSettings.ImmortalDuration)

        break
    }

    if (buffIndex < 0 && buff) {
      this.buff.push(buffPack)
    }
  }

  getBuffList () {
    if (this.buff.length) {
      return this.buff
        .map(({ buff, expire, level }) => ({ buff, expire, level }))
    } else {
      return [{
        buff: PlayerProperty.Buff.NONE,
        expire: -1,
        level: 0
      }]
    }
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
    this.unsetControl()
    this.object.stop()
    this.objectBody.setGravity(0, 0)
    this.objectBody.setVelocity(0)
    this.objectBody.setAcceleration(0, 0)
    this.objectState = PlayerProperty.State.Dead

    this.scene.scene.run(Scenes.GAMEOVER)
  }

  ghost (tube?: Tube) {
    if (!this.ghostTimeRemain) this.emitter.emit(GameEvent.GameOver)
    this.unsetControl()

    this.objectState = PlayerProperty.State.Ghost

    this.objectBody.setVelocity(this.objectBody.velocity.x * 4)
    this.objectBody.setAcceleration(0, 0)
    this.objectBody.setBounceY(1)
    this.object.setAlpha(0.5)
    this.endTime = Date.now() + 10 * 1000
    this.ghostTimeRemain--
  }

  jump () {
    if (this.objectState === PlayerProperty.State.Dead ||
      this.scene.scene.isActive(Scenes.GAMEOVER)) return

    this.objectBody.setVelocityY(this.jumpVelocity)
  }
}
