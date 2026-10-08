import confetti from 'canvas-confetti'

const CULORI = ['#a10a16', '#ece6d6', '#8a8d91', '#4a0d12', '#000000']

export function burst() {
  const opts = { particleCount: 70, spread: 70, startVelocity: 60, colors: CULORI, shapes: ['square'] }
  confetti({ ...opts, angle: 60, origin: { x: 0, y: 0.8 } })
  confetti({ ...opts, angle: 120, origin: { x: 1, y: 0.8 } })
}

export function pop(x, y) {
  confetti({
    particleCount: 60,
    spread: 360,
    startVelocity: 30,
    colors: CULORI,
    shapes: ['square'],
    origin: { x: x / window.innerWidth, y: y / window.innerHeight },
  })
}

export const clearConfetti = () => confetti.reset()
