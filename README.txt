# Math pour Collège et Lycée — données séparées par niveau et format

## Tester sur Windows
1. Décompressez le ZIP.
2. Ouvrez le dossier `Math-pour-College-et-Lycee-site-developpe`.
3. Double-cliquez sur `index.html` pour tester le site.

## Nouvelle organisation des données
Chaque niveau possède désormais deux fichiers indépendants : un fichier pour les PDF et un autre pour les vidéos.

- `data/PDF/3AC.js` : tous les PDF du niveau 3AC.
- `data/Videos/3AC.js` : toutes les vidéos du niveau 3AC.
- Même organisation pour `1AC`, `2AC`, les niveaux du primaire et ceux du lycée.

Les fichiers HTML, CSS et JavaScript qui contrôlent le design et les boutons sont conservés. `data.js` rassemble automatiquement les données des fichiers séparés ; ne le modifiez normalement pas.

## Ajouter un PDF
Ouvrez le fichier correspondant au niveau, par exemple `data/PDF/3AC.js`, puis ajoutez un objet dans le tableau `window.RESOURCES_3AC_PDF` :

```js
{
  title: "Racines carrées",
  level: "3AC",
  type: "Cours",
  format: "PDF",
  description: "Cours et résumé",
  url: "https://drive.google.com/file/d/ID_DU_PDF/view"
}
```

## Ajouter une vidéo
Ouvrez `data/Videos/3AC.js`, puis ajoutez un objet dans `window.RESOURCES_3AC_VIDEOS` :

```js
{
  title: "Racines carrées — explication",
  level: "3AC",
  type: "Cours",
  format: "Vidéo",
  description: "Explication du chapitre",
  url: "https://www.youtube.com/watch?v=..."
}
```

Remplacez `3AC` par le niveau concerné. Les valeurs de `type` peuvent être `Cours`, `Exercices`, `Devoirs` ou `Examens`. Gardez `format: "PDF"` dans les fichiers PDF et `format: "Vidéo"` dans les fichiers vidéos.

Les 17 titres vidéo de 3AC sont déjà conservés dans `data/Videos/3AC.js`. Leurs liens sont vides : remplacez `url: ""` par les liens réels quand ils seront prêts.

## Liens Google Drive
Pour permettre aux visiteurs d'ouvrir un fichier, réglez le partage Google Drive sur « Toute personne disposant du lien » avec le rôle Lecteur.

## Publier gratuitement avec GitHub Pages
1. Décompressez le ZIP.
2. Téléversez tout le contenu du dossier du site à la racine de votre dépôt GitHub.
3. Vérifiez que `index.html` est directement à la racine du dépôt.
4. Dans Settings > Pages, choisissez Deploy from a branch, `main`, folder `/(root)`, puis Save.
5. Attendez le déploiement et ouvrez le lien du site.

Ne supprimez pas les balises `<script>` de `index.html` : elles chargent tous les fichiers de données séparés avant `data.js` et `script.js`.


NIVEAUX LYCÉE ACTIFS
- TC : Tronc Commun Sciences
- TCL : Tronc Commun Lettres
- 1BACSE : 1BAC Sciences Expérimentales
- 1BACSM : 1BAC Sciences Mathématiques
- 1BACL : 1BAC Lettres
- 2BACSVTPC : 2BAC SVT et PC
- 2BACL : 2BAC Lettres
- 2BACSM : 2BAC Mathématiques

Pour chaque niveau, les fichiers sont séparés par catégorie et format :
data/<Categorie>/<PDF ou Videos>/<CODE>.js
Les liens url restent vides tant que les liens Google Drive ne sont pas fournis.
Les titres de cours déjà fournis pour les niveaux existants sont conservés.


Dernière mise à jour : les 8 niveaux du lycée disposent de titres de leçons préremplis dans chaque catégorie (Cours, Exercices, Devoirs, Examens) et format (PDF, Videos). Les liens sont volontairement laissés vides. Consultez README-DATA.txt.


NOUVELLES RUBRIQUES DE LA PAGE D'ACCUEIL
- Mémorandums ministériels : renseigner data/memorandums.js
- Répartitions annuelles : renseigner data/distributions-annuelles.js
- Fichiers pédagogiques : renseigner data/fichiers-pedagogiques.js
Chaque liste accepte des objets { title, level, url }. Pour Google Drive, utiliser un lien de partage accessible en lecture. Les listes sont vides par défaut car aucun lien PDF n'a été fourni.
