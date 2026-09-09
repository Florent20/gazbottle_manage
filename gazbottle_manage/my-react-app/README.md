# Dépôt de gaz — Gestion des bouteilles

Application React (Vite + Tailwind CSS) pour suivre le stock de bouteilles de gaz
par fournisseur (SCTM, Oilibiya, Tradex, Green Oil, Afrigaz, Total, Plein Gaz,
Glocal Gaz, Bocom, Camgaz), avec un objectif de stock modifiable et une barre
de progression.

## Installation

```bash
npm install
```

## Lancer en développement

```bash
npm run dev
```

Puis ouvrez l'URL affichée dans le terminal (en général http://localhost:5173).

## Générer la version de production

```bash
npm run build
```

Les fichiers optimisés sont générés dans le dossier `dist/`.

## Notes

- Les données (stock et objectif) sont sauvegardées automatiquement dans le
  `localStorage` du navigateur, donc elles persistent entre les sessions sur
  le même appareil/navigateur.
- Les icônes proviennent de la librairie `lucide-react`.
