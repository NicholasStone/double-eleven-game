import Phaser from 'phaser'
import Texture from '@/constants/texture'
import NormalGameObject from '@/game/NormalGameObject'
import Animates from '@/constants/animates'
import { ObjectTypes } from '@/constants/object-types'

export default class LootBox extends NormalGameObject {
  private animePlay: number = -1
  private effect!: Phaser.GameObjects.Sprite

  constructor (scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, Texture.Charactor.Husky)
    this.objectType = ObjectTypes.LootBox
    this.addBody()
    const { width, height } = this.object
    this.object.setOrigin(0.5, 0.5)
    this.objectBody.setOffset(-width / 2, -height / 2)

    this.effect = this.scene.add
      .sprite(0, 0, Texture.Effects.Buff2)
      .setOrigin(0, 0)
      .setVisible(false)

    this.add(this.effect)
  }

  handleOverlapped () {
    this.objectBody.setEnable(false)
    this.effect
      .setVisible(true)
      .play(Animates.BuffEffect).setOrigin(0.5, 0.5).on(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
        this.setVisible(false)
        this.effect.setVisible(false)
        setTimeout(() => {
          console.log('re enable loot box')
          this.objectBody.setEnable(true)
          this.setVisible(true)
        }, 3000)
      })
  }
}
