import Phaser from 'phaser'
import Texture from '@/constants/texture'
import Scenes from '@/constants/scenes'
import NinjaCat from '@/game/NinjaCat'

export default class Game extends Phaser.Scene {
  protected cat!: NinjaCat

  protected sky!: Phaser.GameObjects.TileSprite
  protected midBackground!: Phaser.GameObjects.TileSprite
  protected foreBackground!: Phaser.GameObjects.TileSprite

  protected igloo!: Phaser.GameObjects.Image
  protected iceberg!: Phaser.GameObjects.Image

  constructor () {
    super(Scenes.GAME)
  }

  public create () {
    const { width, height } = this.scale
    this.addBackground()

    this.igloo = this.add.image(Phaser.Math.Between(900, 1500), Phaser.Math.Between(500, 620), Texture.Object.Igloo)
    this.iceberg = this.add.image(Phaser.Math.Between(900, 1500), height - 30, Texture.Object.Iceberg).setOrigin(0, 1)

    this.physics.world.setBounds(0, 0, Number.MAX_SAFE_INTEGER, height - 30)

    this.cat = new NinjaCat(this, width * 0.5, height - 30)
    this.add.existing(this.cat)

    const body = this.cat.body as Phaser.Physics.Arcade.Body
    body.setCollideWorldBounds(true)
    body.setVelocityX(200)
    body.setGravityY(10)

    this.cameras.main.startFollow(this.cat, false, 1, 1, -370)
    this.cameras.main.setBounds(0, 0, Number.MAX_SAFE_INTEGER, height)
  }

  public update (time: number, delta: number) {
    this.moveBackground()
    this.wrapIgloo()
  }

  protected addBackground () {
    const { width, height } = this.scale

    this.sky = this.add.tileSprite(0, 0, width, height, Texture.Background.Sky).setOrigin(0, 0).setScrollFactor(0, 0)
    this.midBackground = this.add.tileSprite(0, 0, width, height, Texture.Background.Midground).setOrigin(0, 0).setScrollFactor(0, 0)
    this.foreBackground = this.add.tileSprite(0, height - 88, width, height, Texture.Background.Foreground).setOrigin(0, 0).setScrollFactor(0, 0)
  }

  protected moveBackground () {
    this.sky.setTilePosition(this.cameras.main.scrollX * 0.4)
    this.midBackground.setTilePosition(this.cameras.main.scrollX * 0.8)
    this.foreBackground.setTilePosition(this.cameras.main.scrollX * 1.2)
  }

  protected wrapIgloo () {
    const { scrollX } = this.cameras.main
    const rightEdge = scrollX + this.scale.width

    if (this.igloo.x + this.igloo.width < scrollX) {
      this.igloo.x = Phaser.Math.Between(rightEdge + 100, rightEdge + 1000)
      this.igloo.y = Phaser.Math.Between(500, 620)
    }
  }
}
