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
        loginMaskEl?.classList.add('hidden')
        resolve(player1)
      } else {
        document.querySelector('#error-hint')?.classList.remove('hidden')
      }
    })
  })
}
