import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import AnimatedTitle from '../components/AnimatedTitle.jsx'
import { LINKURI_SANATATE } from '../config.js'
import { burst } from '../confetti.js'
import { unlockAudio } from '../audio.js'

const TITLU = 'La multi ani Patric'
const random = (arr) => arr[Math.floor(Math.random() * arr.length)]

// schimbă href-ul chiar înainte ca browserul să deschidă linkul
const alegeLink = (e) => {
  e.currentTarget.href = random(LINKURI_SANATATE)
}

export default function Home() {
  // confetti când aterizează ultima literă din titlu
  useEffect(() => {
    const t = setTimeout(burst, 200 + TITLU.length * 90)
    return () => clearTimeout(t)
  }, [])

  return (
    <main className="page home">
      <AnimatedTitle text={TITLU} />
      <p className="subtitle">Două butoane. Niciunul nu e sigur.</p>

      <div className="buttons">
        {/* click-ul deblochează sunetul pentru jumpscare-ul de pe pagina următoare */}
        <Link to="/poza" className="big-btn btn-poza" onClick={unlockAudio}>
          <span className="paper">Deschide cadoul</span>
        </Link>

        {/* linkul se alege din nou la fiecare click (și la click pe rotiță) */}
        <a
          href={LINKURI_SANATATE[0]}
          onClick={alegeLink}
          onAuxClick={alegeLink}
          target="_blank"
          rel="noopener noreferrer"
          className="big-btn btn-sanatate"
        >
          <span className="paper">Apasa aici ca sa fii sanatos si anu asta !</span>
        </a>
      </div>
    </main>
  )
}
