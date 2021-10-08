import axios from 'axios'

export default function login () {
  return new Promise(resolve => {
    const loginMaskEl = document.querySelector('#login-mask')
    const player1El = document.querySelector('#input-player-1') as HTMLInputElement
    const player2El = document.querySelector('#input-player-2') as HTMLInputElement
    const submitEl = document.querySelector('#submit-btn')
    loginMaskEl?.classList.remove('hidden')

    submitEl?.addEventListener('click', evt => {
      evt.preventDefault()
      const player1 = player1El.value
      const player2 = player2El.value

      if (player1 && player2) {
        sessionStorage.setItem('player1', player1)
        sessionStorage.setItem('player2', player2)
        loginMaskEl?.classList.add('hidden')
        postPlayer({ player1, player2 }).then(resolve)
      } else {
        document.querySelector('#error-hint')?.classList.remove('hidden')
      }
    })
  })
}

async function postPlayer (players: Record<string, string>) {
  const { data } = await axios.post('/api/player', { data: players }) as { data: { token: string } }
  const info = Object.assign({}, data, players)
  sessionStorage.setItem(`PLAYER_TOKEN_${players.player1}_${players.player2}`, JSON.stringify(info))
  return info
}
