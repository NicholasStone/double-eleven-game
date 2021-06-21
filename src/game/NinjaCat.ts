import Phaser from 'phaser'

import Texture from '@/constants/texture'
import Animates from '@/constants/animates'

export default class NinjaCat extends Phaser.GameObjects.Container {

  protected cat!: Phaser.GameObjects.Sprite
  protected cursors!: Phaser.Types.Input.Keyboard.CursorKeys
  protected animates!: Animates.NinjaCat

  constructor (scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y)

    this.cat = scene.add.sprite(0, 0, Texture.NinjaCat.Walk).setOrigin(0, 0)

    this.add(this.cat)

    scene.physics.add.existing(this)

    const body = this.body as Phaser.Physics.Arcade.Body
    body.setSize(this.cat.width, this.cat.height)

    this.cursors = scene.input.keyboard.createCursorKeys()

    this.act(Animates.NinjaCat.Walk)
  }

  preUpdate () {
    const body = this.body as Phaser.Physics.Arcade.Body
    if (body.blocked.down) {
      this.act(Animates.NinjaCat.Walk, true)
    }

    if (this.cursors.space?.isDown && body.blocked.down) {
      body.setAccelerationY(-600)
      this.act(Animates.NinjaCat.Jump)
      setTimeout(() => {
        body.setAccelerationY(0)
      }, 200)
    }
  }

  act (action: Animates.NinjaCat, ignoreIfPlaying = false) {
    if (this.animates === action) return
    this.animates = action
    this.cat.play(action, ignoreIfPlaying)
  }
}
