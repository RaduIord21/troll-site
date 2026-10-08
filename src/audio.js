import { SUNET_JUMPSCARE } from './config.js'

// Browserele blochează sunetul până la primul click al utilizatorului.
// unlockAudio() se cheamă dintr-un click; după aceea putem urla oricând.

let ctx = null
let gestured = false

function getCtx() {
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext
    if (!AC) return null
    ctx = new AC()
  }
  return ctx
}

export function unlockAudio() {
  const c = getCtx()
  if (!c) return
  gestured = true
  if (c.state !== 'running') c.resume()
  // iOS deblochează doar după ce chiar redă ceva
  const s = c.createBufferSource()
  s.buffer = c.createBuffer(1, 1, 22050)
  s.connect(c.destination)
  s.start()
}

export const audioReady = () => gestured || ctx?.state === 'running'

// ---------- fișier opțional din public/ ----------

let filePromise = null

export function loadScreamFile() {
  if (!filePromise) {
    filePromise = fetch(`${import.meta.env.BASE_URL}${SUNET_JUMPSCARE}`)
      .then((res) => {
        // serverul de dev răspunde cu index.html pentru fișiere lipsă
        if (!res.ok || res.headers.get('content-type')?.includes('text/html')) return null
        return res.arrayBuffer()
      })
      .then((data) => (data ? getCtx()?.decodeAudioData(data) : null))
      .catch(() => null)
  }
  return filePromise
}

// ---------- sinteză ----------

function noiseBuffer(c, seconds) {
  const buf = c.createBuffer(1, Math.ceil(c.sampleRate * seconds), c.sampleRate)
  const d = buf.getChannelData(0)
  for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1
  return buf
}

function distortion(c, amount) {
  const ws = c.createWaveShaper()
  const n = 2048
  const curve = new Float32Array(n)
  for (let i = 0; i < n; i++) {
    const x = (i * 2) / n - 1
    curve[i] = ((3 + amount) * x * 20 * (Math.PI / 180)) / (Math.PI + amount * Math.abs(x))
  }
  ws.curve = curve
  ws.oversample = '4x'
  return ws
}

function output(c, volume = 1) {
  const comp = c.createDynamicsCompressor()
  comp.threshold.value = -12
  comp.ratio.value = 10
  const vol = c.createGain()
  vol.gain.value = volume
  comp.connect(vol).connect(c.destination)
  return comp
}

// Drone grav care crește în intensitate. Întoarce o funcție care îl oprește.
export function startDrone() {
  const c = getCtx()
  if (!c) return () => {}
  const t = c.currentTime
  const out = c.createGain()
  out.gain.setValueAtTime(0.03, t)
  out.gain.linearRampToValueAtTime(0.2, t + 3.5)
  const lp = c.createBiquadFilter()
  lp.type = 'lowpass'
  lp.Q.value = 6
  lp.frequency.setValueAtTime(140, t)
  lp.frequency.linearRampToValueAtTime(700, t + 3.5)
  lp.connect(out).connect(c.destination)

  const oscs = [41.2, 41.7, 61.7].map((f) => {
    const o = c.createOscillator()
    o.type = 'sawtooth'
    o.frequency.value = f
    o.connect(lp)
    o.start(t)
    return o
  })

  return () => {
    const now = c.currentTime
    out.gain.cancelScheduledValues(now)
    out.gain.setValueAtTime(out.gain.value, now)
    out.gain.linearRampToValueAtTime(0, now + 0.04)
    oscs.forEach((o) => o.stop(now + 0.05))
  }
}

// Țipătul de jumpscare: boom + screech distorsionat + zgomot.
export function playScream(fileBuffer) {
  const c = getCtx()
  if (!c) return
  const t = c.currentTime
  const out = output(c, 1.7)

  if (fileBuffer) {
    const s = c.createBufferSource()
    s.buffer = fileBuffer
    s.connect(out)
    s.start(t)
    return
  }

  const dur = 1.8
  const env = c.createGain()
  env.gain.setValueAtTime(0, t)
  env.gain.linearRampToValueAtTime(1, t + 0.015)
  env.gain.setValueAtTime(1, t + 1.2)
  env.gain.exponentialRampToValueAtTime(0.001, t + dur)
  const dist = distortion(c, 400)
  dist.connect(env).connect(out)

  // vibrato rapid, ca o voce care urlă
  const vib = c.createOscillator()
  vib.frequency.value = 13
  const vibAmt = c.createGain()
  vibAmt.gain.value = 45
  vib.connect(vibAmt)
  vib.start(t)
  vib.stop(t + dur)

  for (const f of [880, 1245, 1660]) {
    const o = c.createOscillator()
    o.type = 'sawtooth'
    o.frequency.setValueAtTime(f * 0.6, t)
    o.frequency.exponentialRampToValueAtTime(f, t + 0.07)
    o.frequency.exponentialRampToValueAtTime(f * 0.45, t + dur)
    vibAmt.connect(o.frequency)
    const g = c.createGain()
    g.gain.value = 0.22
    o.connect(g).connect(dist)
    o.start(t)
    o.stop(t + dur)
  }

  const noise = c.createBufferSource()
  noise.buffer = noiseBuffer(c, dur)
  const bp = c.createBiquadFilter()
  bp.type = 'bandpass'
  bp.Q.value = 0.8
  bp.frequency.setValueAtTime(2800, t)
  bp.frequency.exponentialRampToValueAtTime(900, t + dur)
  const ng = c.createGain()
  ng.gain.value = 0.6
  noise.connect(bp).connect(ng).connect(dist)
  noise.start(t)

  // impactul de la început
  const boom = c.createOscillator()
  boom.frequency.setValueAtTime(130, t)
  boom.frequency.exponentialRampToValueAtTime(30, t + 0.5)
  const bg = c.createGain()
  bg.gain.setValueAtTime(1, t)
  bg.gain.exponentialRampToValueAtTime(0.001, t + 0.6)
  boom.connect(bg).connect(out)
  boom.start(t)
  boom.stop(t + 0.65)
}

// Un "BLEGH" scurt de deathcore: growl grav, distorsionat.
export function playBlegh() {
  const c = getCtx()
  if (!c) return
  const t = c.currentTime
  const dur = 0.6
  const out = output(c, 1.3)

  const env = c.createGain()
  env.gain.setValueAtTime(0, t)
  env.gain.linearRampToValueAtTime(1, t + 0.03)
  env.gain.setValueAtTime(1, t + 0.35)
  env.gain.exponentialRampToValueAtTime(0.001, t + dur)

  // formantul "e" -> "h" dă senzația de vocal
  const formant = c.createBiquadFilter()
  formant.type = 'bandpass'
  formant.Q.value = 2.5
  formant.frequency.setValueAtTime(650, t)
  formant.frequency.exponentialRampToValueAtTime(320, t + dur)
  const dist = distortion(c, 250)
  formant.connect(dist).connect(env).connect(out)

  for (const f of [72, 73.5]) {
    const o = c.createOscillator()
    o.type = 'sawtooth'
    o.frequency.setValueAtTime(f, t)
    o.frequency.exponentialRampToValueAtTime(f * 0.7, t + dur)
    o.connect(formant)
    o.start(t)
    o.stop(t + dur)
  }

  const noise = c.createBufferSource()
  noise.buffer = noiseBuffer(c, dur)
  const ng = c.createGain()
  ng.gain.value = 0.8
  noise.connect(ng).connect(formant)
  noise.start(t)
}
