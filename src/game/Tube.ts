import NormalGameObject from '@/game/NormalGameObject'
import Phaser from 'phaser'
import Texture from '@/constants/texture'
import NumberSettings from '@/constants/number-settings'
import TubeWidth = NumberSettings.TubeWidth
import TubeHeight = NumberSettings.TubeHeight
import { getRandomNumber } from '@/shared/random'

function randomTexture (position: 'upper' | 'lower'): Texture.Object {
  const random = getRandomNumber(0, 3)
  if (position === 'upper') {
    return [
      Texture.Object.Top1,
      Texture.Object.Top2,
      Texture.Object.Top3,
      Texture.Object.Top4
    ][random]
  } else {
    return Texture.Object.Tube
    // return [
    //   Texture.Object.Ground1,
    //   Texture.Object.Ground2,
    //   Texture.Object.Ground3,
    //   Texture.Object.Ground4
    // ][random]
  }
}

export default class Tube extends NormalGameObject {
  effective = true
  tubePosition!: 'upper' | 'lower'

  constructor (scene: Phaser.Scene, x: number, y: number, position: 'upper' | 'lower') {
    super(scene, x, y, randomTexture(position))

    this.tubePosition = position
    // this.object.setSize(TubeWidth, TubeHeight)
    this.addBody()
  }

  handleImpact () {
    this.effective = false
    this.objectBody.setAccelerationY(this.tubePosition === 'upper' ? -2000 : 2000)
  }
}
