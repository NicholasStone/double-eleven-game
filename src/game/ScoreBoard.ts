import Phaser from 'phaser'
import Texture from '@/constants/texture'

export default class ScoreBoard extends Phaser.GameObjects.Container {
  protected background!: Phaser.GameObjects.Shape

  protected text!: Phaser.GameObjects.DOMElement

  constructor (scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y)

    this.background = scene.add.rectangle(0, 0, 200, 150, 0xffffff).setOrigin(0, 0)
    this.background.setAlpha(0.7)
    this.add(this.background)
    this.setDepth(9999)

    this.text = scene.add.dom(0, 0).createFromCache(Texture.HTML.ScoreBoard)
    // this.text.setPerspective(800)

    this.add(this.text)
  }

  preUpdate () {
    this.setPosition(this.scene.cameras.main.scrollX + 50, 15)
  }
}
