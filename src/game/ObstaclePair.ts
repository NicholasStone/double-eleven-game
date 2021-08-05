import Phaser from 'phaser'
import ObstacleSettings from '@/constants/obstacle-settings'
import NormalGameObject from '@/game/NormalGameObject'
import Texture from '@/constants/texture'
import TubeLong from '@/game/TubeLong'
import TubeShort from '@/game/TubeShort'

export default class ObstaclePair extends Phaser.GameObjects.Container {
  private modality!: ObstacleSettings.Modality
  private tube1!: NormalGameObject
  private tube2!: NormalGameObject

  // private gameScene!: Phaser.Scene

  constructor (scene: Phaser.Scene, x: number, y: number, modality: ObstacleSettings.Modality) {
    super(scene, x, y)
    console.log('ObstaclePair', x, ' ', y)
    this.setModality(modality, x, y)
  }

  setModality (value: ObstacleSettings.Modality, x: number, y: number) {
    this.modality = value
    this.createTube(Texture.Object.TubeLong, x, 0)
    this.createTube(Texture.Object.TubeShort, x, this.scene.scale.height - 128)
    // switch (value) {
    //   case Obstacle.TowShort:
    //     // this.createTube(Texture.Object.TubeShort, x, y)
    //     break
    //   case Obstacle.TowLong:
    //   case Obstacle.ShortDown:
    //   case Obstacle.ShortUp:
    // }
  }

  private createTube (tube: Texture.Object.TubeLong | Texture.Object.TubeShort, x: number, y: number) {
    return tube === Texture.Object.TubeLong ? new TubeLong(this.scene, x, y) : new TubeShort(this.scene, x, y)
  }
}
