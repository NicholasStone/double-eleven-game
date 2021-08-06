import Phaser from 'phaser'

export default class ScoreBoard extends Phaser.GameObjects.Container {
  protected background?: Phaser.GameObjects.Shape

  constructor (scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y)

    this.background = scene.add.rectangle(0, 0, 200, 150, 0xffffff).setOrigin(0, 0)
    this.background.setAlpha(0.7)
    this.add(this.background)
  }

  preUpdate () {
  }
}
