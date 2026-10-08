import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import AnimatedTitle from '../components/AnimatedTitle.jsx'
import { LINKURI_SANATATE } from '../config.js'
import { burst } from '../confetti.js'
import { unlockAudio } from '../audio.js'

const TITLU = 'La multi ani Patric'
const random = (arr) => arr[Math.floor(Math.random() * arr.length)]

export default function Home() {
  const [linkSanatate] = useState(() => random(LINKURI_SANATATE))

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

        <a
          href={linkSanatate}
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
