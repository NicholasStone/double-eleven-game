import Phaser from 'phaser'
import Texture from '@/constants/texture'
import Scenes from '@/constants/scenes'
import Animates from '@/constants/animates'

export default class Game extends Phaser.Scene {

  protected cat!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody

  protected background!: Phaser.GameObjects.TileSprite

  constructor () {
    super(Scenes.GAME)
  }

  public create () {
    const { width, height } = this.scale
    this.background = this.add.tileSprite(0, 0, width, height, Texture.BACKGROUND).setOrigin(0).setScrollFactor(0, 0)

    this.physics.world.setBounds(0, 0, Number.MAX_SAFE_INTEGER, height - 30)

    this.cat = this.physics.add
      .sprite(width * 0.15, height - 30, Texture.CHARACTER)
      .setOrigin(0.5, 1)
      .play(Animates.NinjaCatWalk)
    this.cat.body.setCollideWorldBounds(true)
    this.cat.body.setVelocityX(200)

    this.cameras.main.startFollow(this.cat)
    this.cameras.main.setBounds(0, 0, Number.MAX_SAFE_INTEGER, height)
  }

  public update (time: number, delta: number) {
    this.background.setTilePosition(this.cameras.main.scrollX)
  }
}
