import NormalGameObject from '@/game/NormalGameObject'
import Phaser from 'phaser'
import Texture from '@/constants/texture'

export default class TubeShort extends NormalGameObject {
  constructor (scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, Texture.Object.TubeShort)
  }
}
