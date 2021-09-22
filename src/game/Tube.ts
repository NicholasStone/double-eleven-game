import NormalGameObject from '@/game/NormalGameObject'
import Phaser from 'phaser'
import Texture from '@/constants/texture'
import { getRandomNumber } from '@/shared/random'
import { ObjectTypes } from '@/constants/object-types'

function randomTexture(position: 'upper' | 'lower'): Texture.Object {
  const random = getRandomNumber(0, 3)
  if (position === 'upper') {
    return [
      Texture.Object.Top1,
      Texture.Object.Top2,
      Texture.Object.Top3,
      Texture.Object.Top4
    ][random]
  } else {
    return [
      Texture.Object.Ground1,
      Texture.Object.Ground2,
      Texture.Object.Ground3,
      Texture.Object.Ground4
    ][random]
  }
}

export default class Tube extends NormalGameObject {
  effective = true
  tubePosition!: 'upper' | 'lower'

  constructor(scene: Phaser.Scene, x: number, y: number, position: 'upper' | 'lower') {
    super(scene, x, y, randomTexture(position))

    this.objectType = ObjectTypes.Obstacles
    this.tubePosition = position
    this.addBody()
    if (position === 'lower') {
      this.object.setOrigin(0, 1)
      this.objectBody.setOffset(0, -this.object.height)
    }
  }

  handleImpact() {
    this.effective = false
    this.objectBody.setAccelerationY(this.tubePosition === 'upper' ? -2000 : 2000)
  }
}
