import Phaser from 'phaser'
import Game from '@/scenes/Game'

const buffName = [
  '什么也没有了',
  '跳的更高',
  '跳的没那么高',
  '不朽',
  '下坠更快',
  '下坠没那么快'
]

export default class ScoreBoard extends Phaser.GameObjects.Container {
  protected hudEl: HTMLElement
  protected gameScene: Game

  constructor (scene: Game, x: number, y: number) {
    super(scene, x, y)

    this.gameScene = scene
    this.hudEl = document.getElementById('hud') || document.createElement('div')
  }

  preUpdate () {
    const { scrollX } = this.scene.cameras.main

    // this.setPosition(scrollX + 50, 0)

    // this.hudEl.getElementsByClassName('buff')[0].innerHTML = this.gameScene.playerBehind.buff.join(',') + ''
    this.hudEl.getElementsByClassName('score')[0].innerHTML = Math.floor(scrollX / 3) + ''
  }
}
