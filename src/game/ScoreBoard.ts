import Phaser from 'phaser'
import Game from '@/scenes/Game'
import Player from '@/game/Player'

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
  protected gameScene: Game
  protected buffListEl1: HTMLElement
  protected buffListEl2: HTMLElement

  constructor (scene: Game, x: number, y: number) {
    super(scene, x, y)

    this.gameScene = scene

    Array.from(document.getElementsByClassName('score-board'))
      .forEach(el => el.classList.remove('hidden'))

    this.buffListEl1 = document.getElementById('hud-buff-1') || document.createElement('ul')
    this.buffListEl2 = document.getElementById('hud-buff-2') || document.createElement('ul')
  }

  preUpdate () {
    const { scrollX } = this.scene.cameras.main

    this.updateScoreBoard(this.buffListEl1, this.gameScene.players[0])
    this.updateScoreBoard(this.buffListEl2, this.gameScene.players[1])

    const scoreEl = document.getElementById('hud-score')
    if (scoreEl) {
      scoreEl.innerHTML = Math.floor(scrollX / 100) + ''
    }
  }

  updateScoreBoard (el: HTMLElement, player:Player) {
    while (el.firstChild) {
      el.firstChild.remove()
    }

    player.getBuffList()
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
        el.appendChild(buffItem)
      })
  }
}
