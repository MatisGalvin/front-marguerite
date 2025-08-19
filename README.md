# Front Marguerite

Application de gestion des clients pour le back-office Marguerite.

## Sommaire

- [Installation](#installation)
- [Utilisation](#utilisation)
- [Structure du projet](#structure-du-projet)
- [Scripts disponibles](#scripts-disponibles)
- [Tests](#tests)

## Installation

1. **Cloner le projet :**
   ```bash
   git clone https://github.com/votre-utilisateur/front-marguerite.git
   cd front-marguerite
   ```

2. **Installer les dépendances :**
   ```bash
   npm install
   ```

3. **Configurer l’environnement :**
   - Créez un fichier `.env.development` à la racine du projet
   - Renseignez les variables d’environnement nécessaires (URL de l’API, etc.).

---

## Utilisation

1. **Lancer le serveur de développement :**
   ```bash
   npm run docker:dev
   ```
   L’application sera accessible sur [http://localhost:3000](http://localhost:3000).

2. **Fonctionnalités principales :**
   - Visualiser la liste des clients
   - Créer un nouveau client
   - Modifier les informations d’un client
   - Supprimer un client (avec confirmation)
   - Notifications de succès et d’erreur

## Structure du projet

```
front-marguerite/
├── app/                  # Pages principales et routage
│   └── (pages)/(back-office)/(main)/clients/ # Page de gestion des clients
├── components/           # Composants UI réutilisables
│   └── ui/               # Table, alert-dialog, etc.
├── hooks/                # Hooks personnalisés (api, toast, toggle)
├── api/                  # Appels à l’API backend
├── types/                # Types TypeScript (ex : Client)
├── lib/                  # Librairies et outils (ex : react-query)
├── public/               # Fichiers statiques
├── README.md             # Ce fichier
└── package.json          # Dépendances et scripts
```

## Scripts disponibles

- `npm run docker:dev` : Démarre le serveur de développement
- `npm run build` : Génère le build de production
- `npm run lint` : Analyse le code avec ESLint
- `npm run test` : Lance les tests unitaires

## Tests

Des tests unitaires sont présents pour les hooks et composants principaux.  
Pour exécuter les tests :
```bash
npm run test
```