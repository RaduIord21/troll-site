import { Fragment } from 'react'
import { pop } from '../confetti.js'

export default function AnimatedTitle({ text }) {
  let i = 0
  return (
    <h1
      className="title"
      aria-label={text}
      onClick={(e) => pop(e.clientX, e.clientY)}
    >
      {/* cuvintele nu se rup, dar titlul se poate rupe între ele pe mobil */}
      {text.split(' ').map((word, w) => (
        <Fragment key={w}>
          {w > 0 && ' '}
          <span className="title-word" aria-hidden="true">
            {[...word].map((ch) => (
              <span key={i} className="title-letter" style={{ '--i': i++ }}>
                {ch}
              </span>
            ))}
          </span>
        </Fragment>
      ))}
    </h1>
  )
}
