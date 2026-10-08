import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { POZA, POZA_INCADRARE, POZA_JUMPSCARE } from '../config.js'
import { burst, clearConfetti, pop } from '../confetti.js'
import { audioReady, loadScreamFile, playBlegh, playScream, startDrone, unlockAudio } from '../audio.js'

const POZE = {
  poza: { file: POZA, src: `${import.meta.env.BASE_URL}${POZA}` },
  scare: { file: POZA_JUMPSCARE, src: `${import.meta.env.BASE_URL}${POZA_JUMPSCARE}` },
}
const SCARE_MS = 1900

// fără diacritice: Metal Mania nu are ă, ș, ț
const CAPTIONS = [
  'Inca un an mai aproape de mormant',
  'Brutal. Batran. Brutal de batran.',
  'Headbang pana la 100',
  'Wall of death la tort',
  'Blast beats, nu batranete',
  'Breakdown-ul anului',
  'Mai vechi decat multe riff-uri',
]

const rand = (min, max) => min + Math.random() * (max - min)

let nextId = 0
function makeClone() {
  return {
    id: nextId++,
    size: Math.round(rand(90, 150)),
    dx: rand(4, 9).toFixed(2),
    dy: rand(3, 7).toFixed(2),
    delay: -rand(0, 10).toFixed(2),
    flip: Math.random() < 0.5,
  }
}

// gate (doar la acces direct, ca să putem porni sunetul) -> loading -> scare -> show
export default function Poza() {
  const [phase, setPhase] = useState(() => (audioReady() ? 'loading' : 'gate'))
  const [loadMs, setLoadMs] = useState(() => rand(2500, 4500))
  const [lipsa, setLipsa] = useState({}) // pozele care nu s-au putut încărca
  const [clones, setClones] = useState(() => Array.from({ length: 3 }, makeClone))
  const [caption, setCaption] = useState(0)
  const [blegh, setBlegh] = useState(0)
  const [hit, setHit] = useState(false)
  const screamFile = useRef(null)
  const hitTimer = useRef()

  useEffect(() => {
    for (const [kind, { src }] of Object.entries(POZE)) {
      const img = new Image()
      img.onerror = () => markLipsa(kind)
      img.src = src
    }
    loadScreamFile().then((buf) => (screamFile.current = buf))
    return () => clearTimeout(hitTimer.current)
  }, [])

  useEffect(() => {
    if (phase === 'loading') {
      clearConfetti()
      const stopDrone = startDrone()
      const t = setTimeout(() => {
        stopDrone()
        playScream(screamFile.current)
        setPhase('scare')
      }, loadMs)
      return () => {
        clearTimeout(t)
        stopDrone()
      }
    }
    if (phase === 'scare') {
      const t = setTimeout(() => {
        setPhase('show')
        burst()
      }, SCARE_MS)
      return () => clearTimeout(t)
    }
    if (phase === 'show') {
      const t = setInterval(() => setCaption((c) => (c + 1) % CAPTIONS.length), 2600)
      return () => clearInterval(t)
    }
  }, [phase, loadMs])

  function scareAgain() {
    unlockAudio()
    setLoadMs(rand(2500, 4500))
    setPhase('loading')
  }

  function onPosterClick(e) {
    playBlegh()
    pop(e.clientX, e.clientY)
    setBlegh((b) => b + 1)
    setClones((cs) => (cs.length >= 25 ? cs : [...cs, makeClone()]))
    setHit(true)
    clearTimeout(hitTimer.current)
    hitTimer.current = setTimeout(() => setHit(false), 450)
  }

  function onCloneClick(e, id) {
    pop(e.clientX, e.clientY)
    setClones((cs) => cs.filter((c) => c.id !== id))
  }

  function markLipsa(kind) {
    setLipsa((l) => (l[kind] ? l : { ...l, [kind]: true }))
  }

  const face = (kind, className, style) =>
    !lipsa[kind] ? (
      <img src={POZE[kind].src} alt="Sărbătoritul" className={className} style={style} onError={() => markLipsa(kind)} draggable="false" />
    ) : (
      <span className={`${className} face-fallback`} role="img" aria-label="Sărbătoritul">💀</span>
    )

  if (phase === 'gate') {
    return (
      <main className="screen">
        <p className="screen-text">Poza sărbătoritului e gata.</p>
        <button className="ghost-btn" onClick={scareAgain}>Arată poza</button>
      </main>
    )
  }

  if (phase === 'loading') {
    return (
      <main className="screen" style={{ '--dur': `${loadMs}ms` }}>
        <p className="screen-text flicker">Se încarcă poza…</p>
        <div className="bar" role="progressbar" aria-label="Se încarcă poza"><span /></div>
      </main>
    )
  }

  if (phase === 'scare') {
    return (
      <div className="scare" aria-hidden="true">
        {face('scare', 'scare-face')}
        <div className="scare-flash" />
      </div>
    )
  }

  return (
    <main className="page poza">
      {clones.map((c) => (
        <div
          key={c.id}
          className="clone-x"
          style={{ '--s': `${c.size}px`, '--dx': `${c.dx}s`, '--dy': `${c.dy}s`, '--delay': `${c.delay}s` }}
        >
          <button
            className="clone-y"
            style={{ '--flip': c.flip ? -1 : 1 }}
            onClick={(e) => onCloneClick(e, c.id)}
            aria-label="Scoate-l din mosh pit"
          >
            {face('scare', 'clone-face')}
          </button>
        </div>
      ))}

      <Link to="/" className="back-btn">Înapoi</Link>

      <div className="stage">
        <button className={`poster ${hit ? 'hit' : ''}`} onClick={onPosterClick} aria-label="Apasă pe poză">
          {face('poza', 'poster-face', { objectPosition: POZA_INCADRARE })}
          {blegh > 0 && <span key={blegh} className="blegh" aria-hidden="true">BLEGH!</span>}
        </button>
        <p key={caption} className="caption">{CAPTIONS[caption]}</p>
        <p className="hint">
          {Object.keys(lipsa).length === 0
            ? 'Apasă pe poză. Apoi pe cei din mosh pit.'
            : `Lipsește din public/: ${Object.keys(lipsa).map((k) => POZE[k].file).join(', ')}`}
        </p>
        <button className="ghost-btn" onClick={scareAgain}>Sperie-mă din nou</button>
      </div>
    </main>
  )
}
