import Phaser from 'phaser'
import Texture from '@/constants/texture'
import Scenes from '@/constants/scenes'
import Animates from '@/constants/animates'

export default class Preloader extends Phaser.Scene {
  constructor () {
    super(Scenes.PRELOADER)
  }

  public preload () {
    this.loadBackground()

    this.load.image(Texture.Object.Igloo, 'assets/object/igloo.png')
    this.load.image(Texture.Object.Iceberg, 'assets/object/iceberg.png')

    this.load.atlas(Texture.NinjaCat.Walk,
      'assets/characters/ninja-cat-walk.png',
      'assets/characters/ninja-cat-walk.json'
    )

    this.load.atlas(Texture.NinjaCat.Jump,
      'assets/characters/ninja-cat-jump.png',
      'assets/characters/ninja-cat-jump.json'
    )
  }

  public create () {
    this.anims.create({
      key: Animates.NinjaCat.Walk,
      frames: this.anims.generateFrameNames(Texture.NinjaCat.Walk, {
        start: 1,
        end: 8,
        prefix: 'NinjaCat_walk_',
        zeroPad: 2,
        suffix: '.png'
      }),
      frameRate: 15,
      repeat: -1
    })

    this.anims.create({
      key: Animates.NinjaCat.Jump,
      frames: this.anims.generateFrameNames(Texture.NinjaCat.Jump, {
        start: 1,
        end: 6,
        prefix: 'NinjaCat_jump_',
        zeroPad: 2,
        suffix: '.png'
      }),
      frameRate: 15,
      repeat: 0
    })

    this.scene.start(Scenes.GAME)
  }

  protected loadBackground () {
    this.load.image(Texture.Background.Midground, 'assets/background/bg_midground.png')
    this.load.image(Texture.Background.Foreground, 'assets/background/bg_foreground.png')
    this.load.image(Texture.Background.Sky, 'assets/background/bg_sky.png')
  }
}
