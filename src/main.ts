import Phaser from 'phaser'
import Game from '@/scenes/Game'
import Preloader from '@/scenes/Preloader'
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
      debug: true
    }
  },
  scene: [Preloader, Game, GameOver]
}

export default new Phaser.Game(config)
