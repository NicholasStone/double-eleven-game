import Phaser from 'phaser'
import Texture from '@/constants/texture'
import Scenes from '@/constants/scenes'
import Player from '@/game/Player'
import NumberSettings from '@/constants/number-settings'
import LootBox from '@/game/LootBox'
import Tube from '@/game/Tube'
import { getRandomNumber } from '@/shared/random'
import ScoreBoard from '@/game/ScoreBoard'
import TubeSpaceBetween = NumberSettings.TubeSpaceBetween
import TubeHeight = NumberSettings.TubeHeight
import GameEvent from '@/constants/events'

export type TubePair = {
  id: number,
  upper: Tube,
  lower: Tube,
  offset: number
}

const idGenerator = (function * () {
  let i = 1
  while (true) {
    yield i++
  }
})()

export default class Game extends Phaser.Scene {
  players: Array<Player> = []

  protected sky!: Phaser.GameObjects.TileSprite
  protected top!: Phaser.GameObjects.TileSprite
  protected ground!: Phaser.GameObjects.TileSprite

  protected allObstacles: Array<TubePair> = []

  protected nextObstaclePosition = NumberSettings.ObstacleInterval

  protected nextLootBoxPositionX = 0
  protected obstacleBeforeLootBox = NumberSettings.LootBoxInterval
  protected lootBox: Record<string, LootBox | null> = {
    upper: null,
    middle: null,
    lower: null
  }

  protected scoreBoard!: ScoreBoard
  protected cameraCenter!: Phaser.GameObjects.Rectangle
  protected emitter = new Phaser.Events.EventEmitter()

  constructor () {
    super(Scenes.GAME)
  }

  public create () {
    const { width, height } = this.scale

    this.setBackground()
    this.setBorder()
    this.physics.world.setBounds(0, NumberSettings.BorderHeight, Number.MAX_SAFE_INTEGER, height - NumberSettings.BorderHeight * 2)
    this.setPlayer(width * 0.2, height * 0.4, 'blue', 'keydown-S', 'left-control')
    this.setPlayer(width * 0.6, height * 0.3, 'red', 'keydown-K', 'right-control')

    this.setObstacle(width - NumberSettings.CameraOffsetX - NumberSettings.ObstacleInterval)
    this.setScoreBoard()
    this.setCamera()

    this.emitter.on(GameEvent.GameOver, () => this.gameOver())
  }

  public update (time: number, delta: number) {
    this.moveGround()
    this.wrapObstacleAndLootBox()
  }

  protected setPlayer (x: number, y: number, type: 'blue' | 'red', keyboard: string, control: string) {
    const player = new Player(this, x, y, type, this.players, this.emitter)
    player.setControl(keyboard, control)
    this.add.existing(player)

    this.players.forEach(otherPlayer => {
      this.physics.add.overlap(player, otherPlayer, this.handleOverlap.bind(this), undefined, this)
    })
    this.players.push(player)
  }

  protected setCamera () {
    const { width, height } = this.scale
    this.cameraCenter = this.add.rectangle(width * 0.3, height / 2, 10, 10, 0xffffff, 0)
    this.physics.add.existing(this.cameraCenter)
    const centerBody = this.cameraCenter.body as Phaser.Physics.Arcade.Body
    centerBody.setGravityX(NumberSettings.GravityX)
    centerBody.setVelocityX(NumberSettings.InitialXVelocity)
    this.cameras.main.startFollow(this.cameraCenter, false, 1, 1)
    this.cameras.main.setBounds(0, 0, Number.MAX_SAFE_INTEGER, height)
  }

  protected stopCamera () {
    const body = this.cameraCenter.body as Phaser.Physics.Arcade.Body
    body.setGravityX(0)
    body.setVelocityX(0)
  }

  protected setBorder () {
    const { width, height } = this.scale

    this.top = this.add.tileSprite(0, 0, width, NumberSettings.BorderHeight, Texture.Background.Top)
      .setOrigin(0, 0)
      .setScrollFactor(0, 0)

    this.ground = this.add.tileSprite(0, height - NumberSettings.BorderHeight, width, NumberSettings.BorderHeight, Texture.Background.Ground)
      .setOrigin(0, 0)
      .setScrollFactor(0, 0)
  }

  protected setBackground () {
    const { width, height } = this.scale

    this.sky = this.add.tileSprite(0, 0, width, height, Texture.Background.Background)
      .setOrigin(0, 0)
      .setScrollFactor(0, 0)
  }

  protected moveGround () {
    const { scrollX } = this.cameras.main
    this.sky.setTilePosition(scrollX * 0.4)
    this.top.setTilePosition(scrollX)
    this.ground.setTilePosition(scrollX)
  }

  protected wrapObstacleAndLootBox () {
    if (this.scene.isActive(Scenes.GAMEOVER)) return

    const { scrollX } = this.cameras.main
    const leftEdge = scrollX + NumberSettings.CameraOffsetX
    const rightEdge = scrollX + NumberSettings.CameraOffsetX + this.scale.width

    const lastObstacle = this.allObstacles[this.allObstacles.length - 1]

    /**
     * 在右边界和最后一个障碍物的距离大于设定值时，添加下一个障碍物
     * 障碍物的个数达到一定数量时，添加 loot box
     */
    if (!this.obstacleBeforeLootBox) {
      this.nextLootBoxPositionX = rightEdge + NumberSettings.DistanceBetweenObstacleAndLootBox * 0.7
      // console.log('next loot box position', this.nextLootBoxPositionX)

      this.setLootBox(this.nextLootBoxPositionX)

      this.obstacleBeforeLootBox = NumberSettings.LootBoxInterval
      this.nextObstaclePosition = NumberSettings.DistanceBetweenObstacleAndLootBox
    } else if (rightEdge - lastObstacle.upper.x - NumberSettings.CameraOffsetX > this.nextObstaclePosition) {
      // 添加新的障碍物
      this.setObstacle(rightEdge + 10 - NumberSettings.CameraOffsetX)
      this.nextObstaclePosition = NumberSettings.ObstacleInterval

      // 干掉没有用的障碍物
      for (const obstacle of this.allObstacles) {
        if (obstacle.upper.x - obstacle.upper.width - 20 < leftEdge) {
          this.clearObstacle(obstacle)
        }
      }

      this.obstacleBeforeLootBox--
      // console.log('obstacle before loot box', this.obstacleBeforeLootBox)
    }
  }

  protected clearObstacle (obstacle: TubePair) {
    const index = this.allObstacles.indexOf(obstacle)
    this.allObstacles.splice(index, 1)
    obstacle.lower.destroy()
    obstacle.upper.destroy()
  }

  protected setObstacle (x: number) {
    const obstaclePair = this.tubePairFactory(x)

    this.add.existing(obstaclePair.upper)
    this.add.existing(obstaclePair.lower)

    const addOverlap = (object: Player) => {
      this.physics.add.overlap(obstaclePair.upper, object, this.handleOverlap.bind(this), undefined, this)
      this.physics.add.overlap(obstaclePair.lower, object, this.handleOverlap.bind(this), undefined, this)
    }

    this.players.forEach(player => {
      addOverlap(player)
    })

    this.allObstacles.push(obstaclePair)
  }

  protected tubePairFactory (x: number): TubePair {
    const { height } = this.scale

    const offset = getRandomNumber(height * 0.2, height * 0.8)

    return {
      id: idGenerator.next().value as number,
      upper: new Tube(this, x, NumberSettings.BorderHeight - 15, 'upper'),
      lower: new Tube(this, x, height - NumberSettings.BorderHeight + 15, 'lower'),
      offset
    }
  }

  protected handleOverlap (object1: Phaser.GameObjects.GameObject, object2: Phaser.GameObjects.GameObject) {
    const player = object2 as Player
    player.handleOverlap(object1)
  }

  protected setLootBox (x: number) {
    const addOverlap = (object: Player) => {
      if (!(this.lootBox.upper && this.lootBox.middle && this.lootBox.lower)) return
      this.physics.add.overlap(this.lootBox.upper, object, this.handleOverlap.bind(this), undefined, this)
      this.physics.add.overlap(this.lootBox.middle, object, this.handleOverlap.bind(this), undefined, this)
      this.physics.add.overlap(this.lootBox.lower, object, this.handleOverlap.bind(this), undefined, this)
    }

    if (this.lootBox.upper) {
      // console.log('has loot box')
      this.lootBox.lower?.setPosition(x, NumberSettings.LowerLootBoxPosition)
      this.lootBox.middle?.setPosition(x, NumberSettings.MiddleLootBoxPosition)
      this.lootBox.upper?.setPosition(x, NumberSettings.UpperLootBoxPosition)
    } else {
      // console.log('new box')
      this.lootBox.upper = new LootBox(this, x, NumberSettings.UpperLootBoxPosition)
      this.lootBox.middle = new LootBox(this, x, NumberSettings.MiddleLootBoxPosition)
      this.lootBox.lower = new LootBox(this, x, NumberSettings.LowerLootBoxPosition)

      this.add.existing(this.lootBox.upper)
      this.add.existing(this.lootBox.middle)
      this.add.existing(this.lootBox.lower)

      this.players.forEach(player => {
        addOverlap(player)
      })
    }
  }

  protected setScoreBoard () {
    this.scoreBoard = new ScoreBoard(this, 500, 15)
    this.scoreBoard.setPosition(0, 0)
    this.add.existing(this.scoreBoard)
  }

  protected gameOver () {
    this.stopCamera()
    this.scene.run(Scenes.GAMEOVER)
  }
}
