import Phaser from 'phaser'
import Texture from '@/constants/texture'
import Scenes from '@/constants/scenes'
import Animates from '@/constants/animates'

export default class Preloader extends Phaser.Scene {
  constructor () {
    super(Scenes.PRELOADER)
  }

  preload () {
    this.load.image(Texture.Background.Midground, 'assets/background/bg_midground.png')
    this.load.image(Texture.Background.Foreground, 'assets/background/bg_foreground.png')
    this.load.image(Texture.Background.Sky, 'assets/background/bg_sky.png')

    this.load.atlas(Texture.NinjaCat,
      'assets/characters/ninja-cat-walk.png',
      'assets/characters/ninja-cat-walk.json'
    )
  }

  create () {
    this.add.image(0, 0, Texture.Background.Sky).setOrigin(0, 0)
    this.add.image(0, 0, Texture.Background.Midground).setOrigin(0, 0)
    this.add.image(0, 88, Texture.Background.Foreground).setOrigin(0, 0)

    this.anims.create({
      key: Animates.NinjaCatWalk,
      frames: this.anims.generateFrameNames(Texture.NinjaCat, {
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
