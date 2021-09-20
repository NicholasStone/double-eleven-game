import Phaser from 'phaser'
import Texture from '@/constants/texture'
import Scenes from '@/constants/scenes'
import Player from '@/game/Player'
import NormalGameObject from '@/game/NormalGameObject'
import NumberSettings from '@/constants/number-settings'
import PlayerProperty from '@/constants/player-properties'
import LootBox from '@/game/LootBox'
import Tube from '@/game/Tube'
import { getRandomInArray, getRandomNumber } from '@/shared/random'
import ScoreBoard from '@/game/ScoreBoard'
import TubeSpaceBetween = NumberSettings.TubeSpaceBetween
import TubeHeight = NumberSettings.TubeHeight

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
  playerBehind!: Player
  playerFront!: Player

  protected ghostPlayer: Player | null = null

  protected sky!: Phaser.GameObjects.TileSprite
  protected midBackground!: Phaser.GameObjects.TileSprite
  protected foreBackground!: Phaser.GameObjects.TileSprite

  protected allObstacles: Array<TubePair> = []

  protected nextObstaclePosition = NumberSettings.ObstacleInterval

  protected nextLootBoxPositionX = 0
  protected obstacleBeforeLootBox = NumberSettings.LootBoxInterval
  protected lootBox: Record<string, LootBox | null> = {
    upper: null,
    middle: null,
    lower: null
  }

  // protected scoreBoard!: Phaser.GameObjects.DOMElement
  protected scoreBoard!: ScoreBoard

  protected cameraCenter!: Phaser.GameObjects.Rectangle

  constructor () {
    super(Scenes.GAME)
  }

  public create () {
    const { width, height } = this.scale

    this.setBackground()
    this.setBorder()
    this.physics.world.setBounds(0, NumberSettings.BorderHeight, Number.MAX_SAFE_INTEGER, height - NumberSettings.BorderHeight * 2)
    // this.setPlayerBehind()
    this.setPlayerFront()
    this.setObstacle(width - NumberSettings.CameraOffsetX - NumberSettings.ObstacleInterval)
    this.setScoreBoard()
    this.setCamera()
  }

  public update (time: number, delta: number) {
    this.moveBackground()
    this.wrapObstacleAndLootBox()
  }

  protected setPlayerBehind () {
    const { width, height } = this.scale

    this.playerBehind = new Player(this, width * 0.2, height * 0.3, 'blue')
    this.add.existing(this.playerBehind)

    this.playerBehind.setControl('keydown-S', 'left-control')
  }

  protected setPlayerFront () {
    const { width, height } = this.scale

    this.playerFront = new Player(this, width * 0.6, height * 0.3, 'red')
    this.add.existing(this.playerFront)

    this.playerFront.setControl('keydown-K', 'right-control')
  }

  // protected unsetControl () {
  //   this.input.keyboard.off('keydown-S', this.playerBehind.jump.bind(this.playerBehind))
  //   this.input.keyboard.off('keydown-K', this.playerFront.jump.bind(this.playerFront))
  //
  //   document.getElementById('left-control')?.removeEventListener('click', this.playerBehind.jump.bind(this.playerBehind))
  //   document.getElementById('right-control')?.removeEventListener('click', this.playerFront.jump.bind(this.playerFront))
  // }

  protected setCamera () {
    const { width, height } = this.scale
    this.cameraCenter = this.add.rectangle(width * 0.3, height / 2, 10, 10, 0xffffff)
    this.physics.add.existing(this.cameraCenter)
    const centerBody = this.cameraCenter.body as Phaser.Physics.Arcade.Body
    centerBody.setGravityX(NumberSettings.GravityX)
    centerBody.setVelocityX(NumberSettings.InitialXVelocity)
    this.cameras.main.startFollow(this.cameraCenter, false, 1, 1)
    this.cameras.main.setBounds(0, 0, Number.MAX_SAFE_INTEGER, height)

    console.log(this.cameras.main)
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

    const { scrollX } = this.cameras.main
    const leftEdge = scrollX + NumberSettings.CameraOffsetX
    const rightEdge = scrollX + NumberSettings.CameraOffsetX + this.scale.width

    const lastObstacle = this.allObstacles[this.allObstacles.length - 1]

    /**
     * 在右边界和最后一个障碍物的距离大于设定值时，添加下一个障碍物
     * 障碍物的个数达到一定数量时，添加 loot box
     */
    if (!this.obstacleBeforeLootBox) {
      this.nextLootBoxPositionX = rightEdge + NumberSettings.DistanceBetweenObstacleAndLootBox * 1.2
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

    addOverlap(this.playerFront)
    addOverlap(this.playerBehind)

    this.allObstacles.push(obstaclePair)
  }

  protected tubePairFactory (x: number): TubePair {
    const { height } = this.scale

    const offset = getRandomNumber(height * 0.2, height * 0.8)

    return {
      id: idGenerator.next().value as number,
      upper: new Tube(this, x, Math.max(offset - TubeSpaceBetween / 2 - TubeHeight, 15 - TubeHeight), 'upper'),
      lower: new Tube(this, x, Math.min(offset + TubeSpaceBetween / 2, height - 15), 'lower'),
      offset
    }
  }

  protected handleOverlap (object1: Phaser.GameObjects.GameObject, object2: Phaser.GameObjects.GameObject) {
    const player = object2 as Player

    if (player.objectState === PlayerProperty.State.Dead) return

    let buff: PlayerProperty.Buff

    const tube = object1 as Tube
    const box = object1 as LootBox

    switch ((object1 as NormalGameObject).texture) {
      case Texture.Object.Tube:

        if (tube.effective) {
          if (this.ghostPlayer && this.ghostPlayer !== player) {
            // this.playerBehind.dead()
            this.playerFront.dead()
          }
          this.ghostPlayer = player
          player.ghost(object1 as Tube)
        }

        break
      case Texture.Charactor.Husky:
        if (player.objectState === PlayerProperty.State.Ghost) return
        buff = this.buffLoot()
        player.setBuff(buff)

        box.handleOverlapped()
        break
      default:
        break
    }
  }

  protected buffLoot (): PlayerProperty.Buff {
    // return 2
    const buffArray = Object.values(PlayerProperty.Buff).filter(item => typeof item === 'number')
    return getRandomInArray(buffArray) as PlayerProperty.Buff
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

      addOverlap(this.playerFront)
      addOverlap(this.playerBehind)
    }
  }

  protected setScoreBoard () {
    this.scoreBoard = new ScoreBoard(this, 500, 15)
    this.scoreBoard.setPosition(0, 0)
    this.add.existing(this.scoreBoard)
  }
}
