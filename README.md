# La mulți ani! 🎂

Site-cadou (React + Vite), frontend-only, publicat pe GitHub Pages.

- `/` – „La multi ani !” în stil logo thrash + 2 butoane mari
- `/#/poza` – „Se încarcă poza…” cu un drone care crește, apoi jumpscare cu țipăt:
  poza pe tot ecranul. După aceea rămâne afișată în stil fotocopie roșu-negru;
  click pe ea = „BLEGH!”, iar clonele lui sar prin ecran (mosh pit).

## Personalizare

1. Două poze în `public/` (numele sunt setate în `src/config.js`):
   - `jumpscare.png` – sare în față la jumpscare; din ea se fac și clonele.
     Una decupată pe fundal transparent arată cel mai bine.
   - `poza.jpeg` – rămâne afișată după jumpscare, într-un cadru portret (3:4).
     Partea care intră în cadru se reglează din `POZA_INCADRARE`.

   Dacă una lipsește, în locul ei apare un 💀.
2. Sunetul e sintetizat în browser. Dacă vrei alt țipăt, pune un fișier în
   `public/jumpscare.mp3` și va fi folosit automat.
3. Linkurile de YouTube și numele fișierelor sunt în `src/config.js`.

Sunetul pornește doar după un click (regulă a browserelor). Venind de pe pagina
principală, click-ul pe buton e suficient. Dacă cineva deschide direct `/#/poza`,
vede întâi un buton „Arată poza”.

## Local

```bash
npm install
npm run dev
```

## Deploy pe GitHub Pages

1. Creează un repo pe GitHub și urcă proiectul pe branch-ul `main`.
2. În repo: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. La fiecare push pe `main`, workflow-ul `.github/workflows/deploy.yml` face build și publică.

Site-ul va fi la `https://<user>.github.io/<repo>/`. Merge cu orice nume de repo
(`base: './'` + `HashRouter`), deci nu trebuie configurat nimic în plus.
