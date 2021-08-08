import Phaser from 'phaser'

export default class ScoreBoard extends Phaser.GameObjects.Container {
  protected hudEl: HTMLElement
  protected hud!: Phaser.GameObjects.DOMElement

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y)

    // this.setPosition(x, y)
    this.hudEl = document.getElementById('hud') || document.createElement('div')

    // this.hud = scene.add.dom(0, 0, this.hudEl).setOrigin(0, 0)

    // this.add(this.hud)
  }

  preUpdate() {
    const { scrollX } = this.scene.cameras.main

    // this.setPosition(scrollX + 50, 0)

    this.hudEl.getElementsByClassName('score')[0].innerHTML = Math.floor(scrollX / 3) + ''
  }
}
