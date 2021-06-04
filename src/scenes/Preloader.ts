import Phaser from 'phaser'
import Texture from '@/constants/texture'
import Scenes from '@/constants/scenes'
import Animates from '@/constants/animates'

export default class Preloader extends Phaser.Scene {
  constructor () {
    super(Scenes.PRELOADER)
  }

  preload () {
    this.load.image(Texture.BACKGROUND, 'assets/background/bg_2400x768.jpg')

    this.load.atlas(Texture.CHARACTER,
      'assets/characters/ninja-cat-walk.png',
      'assets/characters/ninja-cat-walk.json'
    )
  }

  create () {
    this.add.image(0, 0, Texture.BACKGROUND).setOrigin(0, 0)

    this.anims.create({
      key: Animates.NinjaCatWalk,
      frames: this.anims.generateFrameNames(Texture.CHARACTER, {
        start: 1,
        end: 8,
        prefix: 'NinjaCat_walk_',
        zeroPad: 2,
        suffix: '.png'
      }),
      frameRate: 15,
      repeat: -1
    })

    this.scene.start(Scenes.GAME)
  }
}
