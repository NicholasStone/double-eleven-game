import Phaser from 'phaser'
import Scenes from '@/constants/scenes'

export default class Ready extends Phaser.Scene {
  constructor () {
    super(Scenes.READY)
  }

  create () {
    const { width, height } = this.scale
    this.add.text(width * 0.5, height * 0.5, '点击屏幕或点击空格开始游戏', {
      padding: {
        left: 15,
        right: 15,
        top: 15,
        bottom: 15
      },
      fontSize: '42px'
    }).setOrigin(0.5, 0.5)

    const gameStart = () => {
      this.scene.start(Scenes.GAME)

      this.input.keyboard.off('keyup-SPACE', gameStart)
      this.input.off('pointerup', gameStart)
    }

    this.input.keyboard.once('keyup-SPACE', gameStart)

    this.input.once('pointerup', gameStart)
  }
}
