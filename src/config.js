// Tot ce e de personalizat e aici.

// Pozele sărbătoritului, puse în folderul `public/` cu numele astea:
// - cea care sare în față la jumpscare (și din care se fac clonele din mosh pit)
export const POZA_JUMPSCARE = 'jumpscare.png'
// - cea afișată după jumpscare
export const POZA = 'poza.jpeg'
// Ce parte din ea intră în cadru: 0% = sus, 100% = jos.
export const POZA_INCADRARE = 'center 15%'

// Sunetul de jumpscare (opțional): pune un fișier audio în `public/` cu numele ăsta.
// Dacă lipsește, se folosește un țipăt sintetizat direct în browser.
export const SUNET_JUMPSCARE = 'jumpscare.mp3'

// Butonul "sănătos": la fiecare încărcare se alege aleator unul din linkuri.
export const LINKURI_SANATATE = [
  'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  'https://www.youtube.com/watch?v=Wu9rzt3WaWE',
]
