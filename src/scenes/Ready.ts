import Phaser from 'phaser'
import Scenes from '@/constants/scenes'

export default class Ready extends Phaser.Scene {
  constructor () {
    super(Scenes.READY)
  }

  create () {
    const { width, height } = this.scale
    this.add.text(width * 0.5, height * 0.5, '点击屏幕开始游戏', {
      padding: {
        left: 15,
        right: 15,
        top: 15,
        bottom: 15
      },
      fontSize: '42px'
    }).setOrigin(0.5, 0.5)
  }
}
