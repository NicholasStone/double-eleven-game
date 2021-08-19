import Phaser from 'phaser'
import Game from '@/scenes/Game'

const buffName = [
  '什么都没有',
  '不朽',
  '跳的更高',
  '跳的没那么高',
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

    // this.hudEl.getElementsByClassName('buff')[0].innerHTML = this.gameScene.playerBehind.getBuffList()
    //   .map(item => document.createElement('li'))
    //   .join(',')

    const buffListEl = this.hudEl.getElementsByClassName('buff-list')[0]

    while (buffListEl.firstChild) {
      buffListEl.firstChild.remove()
    }

    this.gameScene.playerFront.getBuffList()
      .forEach(({ buff, expire }) => {
        const buffItem = document.createElement('li')
        buffItem.classList.add('item')
        buffItem.appendChild(document.createTextNode(buffName[buff]))
        if (expire > 0) {
          const expireEl = document.createElement('span')
          expireEl.appendChild(document.createTextNode(((expire - Date.now()) / 1000).toFixed(1) + '秒'))
          expireEl.classList.add('expire')
          buffItem.appendChild(expireEl)
        }
        buffListEl.appendChild(buffItem)
      })

    this.hudEl.getElementsByClassName('score')[0].innerHTML = Math.floor(scrollX / 3) + ''
  }
}
