import Phaser from 'phaser'
import Texture from '@/constants/texture'
import NormalGameObject from '@/game/NormalGameObject'
import Animates from '@/constants/animates'

export default class LootBox extends NormalGameObject {
  private animePlay: number = -1

  constructor (scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, Texture.Charactor.Husky)
    this.addBody()
    const { width, height } = this.object
    this.object.setOrigin(0.5, 0.5)
    this.objectBody.setOffset(-width / 2, -height / 2)
  }

  handleOverlapped () {
    console.log('overlapped')
    this.objectBody.setEnable(false)
    this.object.play(Animates.BuffEffect).setOrigin(0.5, 0.5).on(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
      this.setVisible(false)
      this.animePlay = window.setTimeout(() => {
        this.objectBody.setEnable(true)
        this.object.setVisible(true)
      }, 2000)
    })
  }
}
