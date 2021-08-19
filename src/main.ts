import Phaser from 'phaser'
import Preloader from '@/scenes/Preloader'
import Ready from '@/scenes/Ready'
import Game from '@/scenes/Game'
import GameOver from '@/scenes/GameOver'
import NumberSettings from '@/constants/number-settings'
import '@/assets/index.css'

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: NumberSettings.Width,
  height: NumberSettings.Height,
  physics: {
    default: 'arcade',
    arcade: {
      debug: false
    }
  },
  parent: 'app',
  scene: [Preloader, Ready, Game, GameOver]
}

export default new Phaser.Game(config)
