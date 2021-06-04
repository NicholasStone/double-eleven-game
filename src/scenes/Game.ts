import Phaser from 'phaser'
import Texture from '@/constants/texture'
import Scenes from '@/constants/scenes'
import Animates from '@/constants/animates'

export default class Game extends Phaser.Scene {

  protected cat!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody

  protected sky!: Phaser.GameObjects.TileSprite
  protected midBackground!: Phaser.GameObjects.TileSprite
  protected foreBackground!: Phaser.GameObjects.TileSprite

  constructor () {
    super(Scenes.GAME)
  }

  public create () {
    const { width, height } = this.scale
    this.sky = this.add.tileSprite(0, 0, width, height, Texture.Background.Sky).setOrigin(0, 0).setScrollFactor(0, 0)
    this.midBackground = this.add.tileSprite(0, 0, width, height, Texture.Background.Midground).setOrigin(0, 0).setScrollFactor(0, 0)
    this.foreBackground = this.add.tileSprite(0, height - 88, width, height, Texture.Background.Foreground).setOrigin(0, 0).setScrollFactor(0, 0)

    this.physics.world.setBounds(0, 0, Number.MAX_SAFE_INTEGER, height - 30)

    this.cat = this.physics.add
      .sprite(width * 0.15, height - 30, Texture.NinjaCat)
      .setOrigin(0.5, 1)
      .play(Animates.NinjaCatWalk)
    this.cat.body.setCollideWorldBounds(true)
    this.cat.body.setVelocityX(200)

    this.cameras.main.startFollow(this.cat)
    this.cameras.main.setBounds(0, 0, Number.MAX_SAFE_INTEGER, height)
  }

  public update (time: number, delta: number) {
    this.sky.setTilePosition(this.cameras.main.scrollX * 0.4)
    this.midBackground.setTilePosition(this.cameras.main.scrollX * 0.8)
    this.foreBackground.setTilePosition(this.cameras.main.scrollX * 1.2)
  }
}
