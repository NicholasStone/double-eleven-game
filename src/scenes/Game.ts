import Phaser from 'phaser'
import Texture from '@/constants/texture'
import Scenes from '@/constants/scenes'
import Doge from '@/game/Doge'
import NormalGameObject from '@/game/NormalGameObject'
import NumberSettings from '@/constants/number-settings'
import DogeProperty from '@/constants/doge-property'
import LootBox from '@/game/LootBox'

export default class Game extends Phaser.Scene {
  protected doge!: Doge

  protected sky!: Phaser.GameObjects.TileSprite
  protected midBackground!: Phaser.GameObjects.TileSprite
  protected foreBackground!: Phaser.GameObjects.TileSprite

  protected allObstacles: Array<NormalGameObject> = []
  protected nextObstaclePosition = NumberSettings.ObstacleInterval

  protected nextLootBoxPositionX = 0
  protected nextLootBox = NumberSettings.LootBoxInterval
  protected lootBox: Record<string, LootBox | null> = {
    upper: null,
    lower: null
  }

  private overlapped = false

  constructor () {
    super(Scenes.GAME)
  }

  public create () {
    const { width, height } = this.scale

    this.setBackground()
    this.setBorder()

    this.physics.world.setBounds(0, NumberSettings.BorderHeight, Number.MAX_SAFE_INTEGER, height - NumberSettings.BorderHeight * 2)

    this.doge = new Doge(this, width * 0.5, height * 0.3)
    this.add.existing(this.doge)

    this.setObstacle(width - NumberSettings.CameraOffsetX - NumberSettings.ObstacleInterval, height - (64 + 30))

    this.setLootBox(NumberSettings.DistanceBetweenObstacleAndLootBox * 1.2)

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
     * 障碍物的个数达到一定数量时，添加 loot box
     */
    if (!this.nextLootBox) {
      // this.lootBox.upper = this.add.image(rightEdge + NumberSettings.DistanceBetweenObstacleAndLootBox * 1.2, height * 0.4, Texture.Charactor.Husky).setOrigin(0, 1)
      // this.lootBox.lower = this.add.image(rightEdge + NumberSettings.DistanceBetweenObstacleAndLootBox * 1.2, height * 0.8, Texture.Charactor.Husky).setOrigin(0, 1)

      // this.setLootBox(rightEdge + NumberSettings.DistanceBetweenObstacleAndLootBox * 1.2)
      this.nextLootBoxPositionX = rightEdge + NumberSettings.DistanceBetweenObstacleAndLootBox * 1.2

      this.nextLootBox = NumberSettings.LootBoxInterval
      this.nextObstaclePosition = NumberSettings.DistanceBetweenObstacleAndLootBox
    } else if (rightEdge - lastObstacle.x - NumberSettings.CameraOffsetX > this.nextObstaclePosition) {
      // 添加新的障碍物
      this.setObstacle(rightEdge + 10 - NumberSettings.CameraOffsetX, height - (64 + 30))
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

  protected clearObstacle (obstacle: NormalGameObject) {
    const index = this.allObstacles.indexOf(obstacle)
    this.allObstacles.splice(index, 1)
    obstacle.destroy()
  }

  protected setObstacle (x: number, y: number) {
    const newObstacle = new NormalGameObject(this, x, y, Texture.Object.Obstacle)
    this.add.existing(newObstacle)
    this.physics.add.overlap(newObstacle, this.doge, this.handleOverlap.bind(this), undefined, this)
    this.allObstacles.push(newObstacle)
  }

  protected handleOverlap (object1: Phaser.GameObjects.GameObject, object2: Phaser.GameObjects.GameObject) {
    if ((object2 as Doge).objectState === DogeProperty.State.Dead) return

    switch ((object1 as NormalGameObject).texture) {
      case Texture.Object.Obstacle:
        this.doge.dead()
        break
      case Texture.Charactor.Husky:
        this.doge.buff = this.buffLoot()

        this.lootBox.upper?.handleOverlapped(this.nextLootBoxPositionX, NumberSettings.UpperLootBoxPosition)
        this.lootBox.lower?.handleOverlapped(this.nextLootBoxPositionX, NumberSettings.LowerLootBoxPosition)
        break
      default:
        break
    }
  }

  protected buffLoot (): DogeProperty.Buff {
    return DogeProperty.Buff.INVINCIBLE
  }

  protected setLootBox (x: number) {
    if (this.lootBox.upper) {
      this.lootBox.lower?.setPosition(x, NumberSettings.LowerLootBoxPosition)
      this.lootBox.upper?.setPosition(x, NumberSettings.UpperLootBoxPosition)
    } else {
      this.lootBox.upper = new LootBox(this, x, NumberSettings.UpperLootBoxPosition)
      this.lootBox.lower = new LootBox(this, x, NumberSettings.LowerLootBoxPosition)

      this.add.existing(this.lootBox.upper)
      this.add.existing(this.lootBox.lower)

      this.physics.add.overlap(this.lootBox.upper, this.doge, this.handleOverlap.bind(this), undefined, this)
      this.physics.add.overlap(this.lootBox.lower, this.doge, this.handleOverlap.bind(this), undefined, this)
    }
  }
}
