import Phaser from 'phaser'
import Texture from '@/constants/texture'
import Scenes from '@/constants/scenes'
// import Animates from '@/constants/animates'

export default class Preloader extends Phaser.Scene {
  constructor () {
    super(Scenes.PRELOADER)
  }

  public preload () {
    this.loadBackground()

    this.load.image(Texture.Image.Wasted, 'assets/images/wasted.png')

    this.load.image(Texture.Object.Igloo, 'assets/object/igloo.png')
    this.load.image(Texture.Object.Obstacle, 'assets/object/iceberg.png')
    this.load.atlas(Texture.Object.IceBlock, 'assets/block/block-ground.png', 'assets/block/block-ground.json')

    this.load.image(Texture.Object.TubeLong, 'assets/object/tube-1.png')
    this.load.image(Texture.Object.TubeShort, 'assets/object/tube-2.png')

    this.load.image(Texture.Charactor.Husky, 'assets/characters/husky.png')
    this.load.image(Texture.Charactor.Samoyed, 'assets/characters/samoyed.png')
    this.load.image(Texture.Charactor.Akita, 'assets/characters/akita.png')
  }

  public create () {
    this.scene.start(Scenes.READY)
  }

  protected loadBackground () {
    this.load.image(Texture.Background.Midground, 'assets/background/bg_midground.png')
    this.load.image(Texture.Background.Foreground, 'assets/background/bg_foreground.png')
    this.load.image(Texture.Background.Sky, 'assets/background/bg_sky.png')
  }
}
