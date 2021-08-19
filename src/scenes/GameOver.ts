import Phaser from 'phaser'
import Scenes from '@/constants/scenes'
import Texture from '@/constants/texture'

export default class GameOver extends Phaser.Scene {
  constructor () {
    super(Scenes.GAMEOVER)
  }

  create () {
    const { width, height } = this.scale

    this.add.rectangle(width * 0.5, height * 0.5, width, height * 0.23, 0x092864, 0.5)

    this.add.image(width * 0.5, height * 0.5, Texture.Image.Wasted)

    const restartGame = () => {
      this.scene.start(Scenes.GAME)
      this.input.keyboard.off('keyup-SPACE', restartGame)
      this.input.off('pointerup', restartGame)
    }

    this.input.keyboard.once('keyup-SPACE', restartGame)
    this.input.once('pointerup', restartGame)
  }
}
