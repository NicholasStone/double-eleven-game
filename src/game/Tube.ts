import NormalGameObject from '@/game/NormalGameObject'
import Phaser from 'phaser'
import Texture from '@/constants/texture'
import NumberSettings from '@/constants/number-settings'
import TubeWidth = NumberSettings.TubeWidth
import TubeHeight = NumberSettings.TubeHeight

export default class Tube extends NormalGameObject {
  effective = true
  tubePosition!: 'upper' | 'lower'

  constructor (scene: Phaser.Scene, x: number, y: number, position: 'upper' | 'lower') {
    super(scene, x, y, Texture.Object.Tube)

    this.tubePosition = position
    this.object.setSize(TubeWidth, TubeHeight)
    this.addBody()
  }

  handleImpact () {
    this.effective = false
    this.objectBody.setAccelerationY(this.tubePosition === 'upper' ? -2000 : 2000)
  }
}
