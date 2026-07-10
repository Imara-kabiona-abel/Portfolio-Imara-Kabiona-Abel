# Portfolio — IMARA KABIONA Abel

## Déploiement (GitHub Pages)
1. Place ta photo dans `assets/moi.jpeg` (remplace le fichier existant si besoin).
2. Place ton CV en PDF dans `assets/cv_IMARA_KABIONA_Abel.pdf`.
3. Pousse ces fichiers sur ton dépôt GitHub (même structure que ton site ISMGL).
4. Active GitHub Pages sur la branche principale.

## Structure
- `index.html` — toutes les sections (Accueil, Profil, Expérience, Formation, Projets, Contact)
- `css/style.css` — palette bleu marine/ambre, typographie Fraunces + IBM Plex Sans/Mono
- `js/main.js` — navigation entre sections (#hash), bascule FR/EN, compteurs animés

## Notes
- Le menu change de section sans recharger la page (clique sur un lien ou une carte "Explorer" en accueil).
- Les chiffres clés (6+ ans, 4 organisations, 981K€, 4 certifications) s'animent au chargement de la page d'accueil.
- Si `assets/moi.jpeg` est absent, un avatar de secours "IK" s'affiche automatiquement (aucune page cassée).
- Testé en desktop (1440px) et mobile (390px) avec Playwright/Chromium.
