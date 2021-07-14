import Phaser from 'phaser'
import Texture from '@/constants/texture'
import Scenes from '@/constants/scenes'
import Doge from '@/game/Doge'
import NumberSettings from '@/constants/number-settings'

export default class Game extends Phaser.Scene {
  protected doge!: Doge

  protected sky!: Phaser.GameObjects.TileSprite
  protected midBackground!: Phaser.GameObjects.TileSprite
  protected foreBackground!: Phaser.GameObjects.TileSprite

  protected allObstacles: Array<Phaser.GameObjects.Image> = []
  protected nextObstaclePosition = NumberSettings.ObstacleInterval

  protected nextLootBox = NumberSettings.LootBoxInterval - 1
  protected lootBox: Array<Phaser.GameObjects.Image> = []

  constructor () {
    super(Scenes.GAME)
  }

  public create () {
    const { width, height } = this.scale
    const rightEdge = width - NumberSettings.CameraOffsetX

    this.setBackground()
    this.setBorder()

    this.allObstacles.push(this.add.image(rightEdge - NumberSettings.ObstacleInterval, height - 30, Texture.Object.Obstacle).setOrigin(0.5, 1))

    this.physics.world.setBounds(0, NumberSettings.BorderHeight, Number.MAX_SAFE_INTEGER, height - NumberSettings.BorderHeight * 2)

    this.doge = new Doge(this, width * 0.5, height * 0.3)
    this.add.existing(this.doge)

    this.setCamera()
  }

  public update (time: number, delta: number) {
    this.moveBackground()
    this.wrapObstacleAndLootBox()
  }

  protected setCamera () {
    const { height } = this.scale
    this.cameras.main.startFollow(this.doge, false, 1, 1, NumberSettings.CameraOffsetX)
    this.cameras.main.setBounds(0, 0, Number.MAX_SAFE_INTEGER, height)
  }

  protected setBorder () {
    const { height } = this.scale

    this.add.rectangle(0, 0, Number.MAX_SAFE_INTEGER, NumberSettings.BorderHeight, 0x00ff00, 0.5).setOrigin(0, 0)
    this.add.rectangle(0, height - NumberSettings.BorderHeight, Number.MAX_SAFE_INTEGER, NumberSettings.BorderHeight, 0x00ff00, 0.5).setOrigin(0, 0)
  }

  protected setBackground () {
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

  protected wrapObstacleAndLootBox () {
    if (this.scene.isActive(Scenes.GAMEOVER)) return

    const { height } = this.scale
    const { scrollX } = this.cameras.main
    const leftEdge = scrollX + NumberSettings.CameraOffsetX
    const rightEdge = scrollX + NumberSettings.CameraOffsetX + this.scale.width

    const lastObstacle = this.allObstacles[this.allObstacles.length - 1]

    /**
     * 在右边界和最后一个障碍物的距离大于设定值时，添加下一个障碍物
     */
    if (!this.nextLootBox) {
      const lootBoxUpper = this.add.image(rightEdge + NumberSettings.DistanceBetweenObstacleAndLootBox * 1.2, height * 0.4, Texture.Charactor.Husky).setOrigin(0, 1)
      const lootBoxLower = this.add.image(rightEdge + NumberSettings.DistanceBetweenObstacleAndLootBox * 1.2, height * 0.8, Texture.Charactor.Husky).setOrigin(0, 1)

      this.nextLootBox = NumberSettings.LootBoxInterval
      this.nextObstaclePosition = NumberSettings.DistanceBetweenObstacleAndLootBox
    } else if (rightEdge - lastObstacle.x - NumberSettings.CameraOffsetX > this.nextObstaclePosition) {
      // 添加新的障碍物
      this.setObstacle(rightEdge, height)
      this.nextObstaclePosition = NumberSettings.ObstacleInterval

      // 干掉没有用的障碍物
      for (const obstacle of this.allObstacles) {
        if (obstacle.x - obstacle.width - 20 < leftEdge) {
          this.clearObstacle(obstacle)
        }
      }

      this.nextLootBox--
    }
  }

  private clearObstacle (obstacle: Phaser.GameObjects.Image) {
    const index = this.allObstacles.indexOf(obstacle)
    this.allObstacles.splice(index, 1)
    obstacle.destroy()
  }

  private setObstacle (rightEdge: number, height: number) {
    const newObstacle = this.add.image(rightEdge + 10 - NumberSettings.CameraOffsetX, height - 30, Texture.Object.Obstacle).setOrigin(0, 1)
    this.allObstacles.push(newObstacle)
  }
}
