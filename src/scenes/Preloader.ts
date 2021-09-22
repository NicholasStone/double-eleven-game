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

    this.load.image(Texture.Image.Wasted, 'assets/images/wasted.png')

    this.load.image(Texture.Object.Top1, 'assets/object/top-1.png')
    this.load.image(Texture.Object.Top2, 'assets/object/top-2.png')
    this.load.image(Texture.Object.Top3, 'assets/object/top-3.png')
    this.load.image(Texture.Object.Top4, 'assets/object/top-4.png')

    this.load.image(Texture.Charactor.Husky, 'assets/characters/husky.png')
    // this.load.image(Texture.Charactor.Samoyed, 'assets/characters/samoyed.png')
    // this.load.image(Texture.Charactor.Akita, 'assets/characters/akita.png')

    this.load.atlas(Texture.Charactor.BlurBird, 'assets/characters/blue-bird.png', 'assets/characters/blue-bird.json')
    this.load.atlas(Texture.Charactor.RedBird, 'assets/characters/red-bird.png', 'assets/characters/red-bird.json')

    this.load.atlas(Texture.Effects.Buff1, 'assets/effects/buff-1.png', 'assets/effects/buff-1.json')
    this.load.atlas(Texture.Effects.Buff2, 'assets/effects/buff-2.png', 'assets/effects/buff-2.json')
  }

  public create () {
    this.anims.create({
      key: Animates.RedBirdFly,
      frames: Texture.Charactor.RedBird,
      frameRate: 15,
      repeat: -1
    })

    this.anims.create({
      key: Animates.BlueBirdFly,
      frames: Texture.Charactor.BlurBird,
      frameRate: 15,
      repeat: -1
    })

    this.anims.create({
      key: Animates.Effects.Example,
      frames: Texture.Effects.Buff1,
      frameRate: 6,
      repeat: 0
    })

    this.anims.create({
      key: Animates.BuffEffect,
      frames: Texture.Effects.Buff2,
      frameRate: 6,
      repeat: 0
    })

    this.scene.start(Scenes.READY)
  }

  protected loadBackground () {
    this.load.image(Texture.Background.Background, 'assets/background/background.png')
    this.load.image(Texture.Background.Top, 'assets/background/top.png')
    this.load.image(Texture.Background.Ground, 'assets/background/ground.png')

    // this.load.image(Texture.Background.Midground, 'assets/background/bg_midground.png')
    // this.load.image(Texture.Background.Foreground, 'assets/background/bg_foreground.png')
    // this.load.image(Texture.Background.Sky, 'assets/background/bg_sky.png')
  }
}
