import axios from 'axios'

const $ = document.querySelector
export default function login () {
  return new Promise((resolve, reject) => {
    const loginMaskEl = $('#login-mask')
    const player1El = $('#input-player-1') as HTMLInputElement
    const player2El = $('#input-player-2') as HTMLInputElement
    const submitEl = $('#submit-btn')
    loginMaskEl?.classList.remove('hidden')

    submitEl?.addEventListener('click', () => {
      const player1 = player1El.value
      const player2 = player2El.value

      if (player1 && player2) {

      } else {
        $('#error-hint')?.classList.remove('hidden')
      }
    })
  })
}
