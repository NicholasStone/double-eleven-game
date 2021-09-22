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

function appendTextNode (parent: HTMLElement, tag: string, text: string, className: Array<string> = []) {
  const textParent = document.createElement(tag)
  textParent.appendChild(document.createTextNode(text))
  textParent.classList.add(...className)
  parent.appendChild(textParent)
}

export default class ScoreBoard extends Phaser.GameObjects.Container {
  protected hudEl: HTMLElement
  protected gameScene: Game

  constructor (scene: Game, x: number, y: number) {
    super(scene, x, y)

    this.gameScene = scene
    this.hudEl = document.getElementById('hud') || document.createElement('div')
    this.hudEl.classList.remove('hidden')
  }

  preUpdate () {
    const { scrollX } = this.scene.cameras.main

    const buffListEl = this.hudEl.getElementsByClassName('buff-list')[0]

    while (buffListEl.firstChild) {
      buffListEl.firstChild.remove()
    }

    this.gameScene.players[0].getBuffList()
      .forEach(({ buff, expire, level }) => {
        const buffItem = document.createElement('li')
        buffItem.classList.add('item')
        buffItem.appendChild(document.createTextNode(buffName[buff]))
        if (expire > 0) {
          appendTextNode(buffItem, 'span', ((expire - Date.now()) / 1000).toFixed(1) + '秒', ['expire'])
        }
        if (level > 1) {
          appendTextNode(buffItem, 'span', `x${level}`, ['expire'])
        }
        buffListEl.appendChild(buffItem)
      })

    this.hudEl.getElementsByClassName('score')[0].innerHTML = Math.floor(scrollX / 30) + ''
  }
}
