import Phaser from 'phaser'
import Preloader from '@/scenes/Preloader'
import Ready from '@/scenes/Ready'
import Game from '@/scenes/Game'
import GameOver from '@/scenes/GameOver'
import NumberSettings from '@/constants/number-settings'
import login from '@/panels/login'
import '@/assets/index.css'
import '@/assets/panel.css'
import '@/assets/anime.css'

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
  parent: 'app',
  scene: [Preloader, Ready, Game, GameOver]
}

// const game = new Phaser.Game(config)

login().then(() => {
  const game = new Phaser.Game(config)
})
