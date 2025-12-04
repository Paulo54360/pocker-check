# 📋 Contexte du Projet - Poker Check

## 🎯 Vue d'ensemble

**Poker Check** est une application web simple permettant à une association de poker de noter, analyser et commenter leurs parties. L'objectif est de permettre aux joueurs de s'auto-évaluer et d'évaluer les autres en annotant les coups de chaque manche.

### Objectif principal
Créer un outil simple et intuitif où les joueurs peuvent :
- Créer/rejoindre une partie avec un code
- Noter leurs cartes et actions pendant la partie
- Voir le récapitulatif complet à la fin
- Commenter et annoter les coups pour progresser

### Philosophie du projet
- **Simplicité** : Interface épurée, pas de complexité inutile
- **UX orientée joueur** : Pensé comme si on était autour d'une table de poker
- **Mobile-first** : Les joueurs ont leur téléphone à table
- **Rapidité** : Pas besoin de perdre du temps sur l'app

---

## 🏗️ Architecture Technique

### Stack
- **Frontend** : HTML5, CSS3, JavaScript vanilla (ES6+)
- **Stockage** : localStorage (défaut) + JSONBin.io (pour multi-navigateurs)
- **Hébergement** : Vercel (déploiement automatique depuis GitHub)
- **Pas de framework** : Code vanilla pour rester simple et léger

### Structure des fichiers

```
pocker-check/
├── index.html          # Dashboard avec historique des parties
├── create.html         # Création d'une nouvelle partie
├── join.html           # Rejoindre une partie avec code
├── game.html           # Interface de jeu (saisie cartes/board)
├── review.html         # Récapitulatif avec navigation par manche
├── styles.css          # CSS global responsive avec thème poker
├── app.js              # Logique complète (utilisateurs, parties, manches)
├── README.md           # Documentation utilisateur
└── PROJECT_CONTEXT.md  # Ce fichier - contexte technique
```

---

## 📊 Structure de Données

### Structure d'une carte
```javascript
{
  rank: 'K',      // A, 2-10, J, Q, K
  suit: 'clubs'   // hearts, diamonds, clubs, spades
}
```

### Structure d'une partie (Game)
```javascript
{
  gameCode: "ABC123",              // Code unique 6 caractères
  createdAt: "2024-01-15T10:30:00Z",
  creatorId: "user_xxx",           // ID utilisateur créateur
  players: [                        // Liste des joueurs
    {
      id: "player_xxx",
      userId: "user_xxx",           // Référence vers utilisateur
      pseudo: "PokerMaster",
      comments: [],                 // Commentaires reçus
      isCreator: true/false
    }
  ],
  status: "playing" | "finished",
  currentHand: 1,                   // Numéro de la manche courante
  hands: [                          // Tableau des manches
    {
      handNumber: 1,
      status: "playing" | "finished",
      board: {
        flop: [card1, card2, card3],
        turn: card | null,
        river: card | null
      },
      playerData: {                 // Données par joueur pour cette manche
        "playerId1": {
          cards: [card1, card2],
          actions: [
            {
              id: "xxx",
              type: "check" | "call" | "raise" | "fold" | "allin",
              amount: 10 | null,
              timestamp: "2024-01-15T10:35:00Z"
            }
          ]
        }
      },
      startedAt: "2024-01-15T10:30:00Z",
      finishedAt: "2024-01-15T10:45:00Z" | null
    }
  ]
}
```

### Structure d'un utilisateur
```javascript
{
  userId: "user_abc123",           // ID unique
  pseudo: "PokerMaster",           // Pseudo (unique)
  createdAt: "2024-01-15T10:00:00Z",
  gameHistory: ["ABC123", "DEF456"] // Codes des parties jouées
}
```

### Stockage localStorage
```javascript
{
  "poker_check_games": {
    "ABC123": { /* gameData */ },
    "DEF456": { /* gameData */ }
  },
  "poker_users": {
    "user_abc123": { /* userData */ }
  },
  "pseudo_to_userId": {
    "PokerMaster": "user_abc123"
  },
  "current_user": "user_abc123",
  "jsonbin_main_bin_id": "65abc123..."  // Pour JSONBin
}
```

---

## 🔑 Fonctionnalités Clés

### 1. Système d'utilisateurs
- **Création de pseudo** : Vérification d'unicité automatique
- **ID utilisateur persistant** : Stocké dans localStorage
- **Historique automatique** : Toutes les parties sont liées à l'utilisateur
- **Dashboard personnel** : Liste de toutes ses parties

### 2. Gestion des parties
- **Création** : Génération de code unique à 6 caractères (alphanumérique)
- **Rejoindre** : Via code + création de pseudo
- **Suppression** : Possible pour le créateur (dashboard + page de jeu)
- **Historique** : Toutes les parties accessibles depuis le dashboard

### 3. Système de manches multiples
- **Une partie = plusieurs manches** : Structure `hands[]`
- **Navigation** : Indicateur "Manche X/Y" dans l'interface
- **Nouvelle manche** : Le créateur peut créer une nouvelle manche après avoir validé ses cartes et le board
- **Données séparées** : Chaque manche a ses propres données (cartes, actions, board)

### 4. Interface de jeu simplifiée
- **Saisie texte des cartes** : Format abrégé (ex: "RT" = Roi Trèfle)
  - Rangs : A, R (Roi), D (Dame), V (Valet), 2-10
  - Couleurs : T (Trèfle), P (Pique), C (Cœur), K (Carreau)
  - Exemples : "RT D7" = Roi Trèfle + Dame 7
- **Prévisualisation visuelle** : Les cartes s'affichent visuellement en temps réel
- **Validation rapide** : Un clic pour valider et passer à la suite
- **Board pour créateur** : Section séparée pour définir Flop (3 cartes), Turn (1), River (1)

### 5. Récapitulatif avec navigation
- **Navigation par manche** : Tabs pour naviguer entre les manches
- **Affichage visuel** : Cartes affichées comme de vraies cartes (pas en texte)
- **Commentaires** : Possibilité d'ajouter des annotations sur chaque joueur
- **Timeline des actions** : Voir toutes les actions de chaque joueur

---

## 🎨 Règles et Conventions

### Format des cartes en saisie texte
- **Format principal** : `Rang + Couleur` (ex: "RT", "D7", "AC")
- **Exemples acceptés** :
  - `RT` = Roi Trèfle
  - `D7` = Dame 7
  - `AC` = As Cœur
  - `VK` = Valet Carreau
  - `10P` = 10 Pique
- **Séparation** : Espace ou virgule entre plusieurs cartes
- **Affichage final** : Toujours en cartes visuelles dans le récapitulatif

### Règles métier
1. **Un joueur = 2 cartes** : Validation automatique
2. **Board** : 3 cartes flop, 1 turn, 1 river (optionnel)
3. **Cartes privées** : Chaque joueur voit uniquement ses propres cartes pendant la partie
4. **Révélation** : Les cartes ne sont visibles qu'à la fin de la partie (ou pour soi)
5. **Manches** : Une partie peut contenir plusieurs manches
6. **Créateur** : Seul le créateur peut définir le board, créer une nouvelle manche, terminer la partie

### Workflow d'une partie
1. **Création** : Créateur génère un code et partage
2. **Rejoindre** : Joueurs rejoignent avec code + pseudo
3. **Saisie** : Chaque joueur entre ses 2 cartes en texte
4. **Board** : Le créateur définit le board (flop, turn, river)
5. **Nouvelle manche** : Après validation, possibilité de créer une nouvelle manche
6. **Fin de partie** : Le créateur termine la partie
7. **Récapitulatif** : Tout le monde peut voir toutes les cartes et commenter

---

## 🔧 Points Techniques Importants

### Système de parsing des cartes
- **Fonction** : `parseCardText(text)` - Parse "RT" → `{rank: 'K', suit: 'clubs'}`
- **Mapping** : Dictionnaire français → anglais (R → K, D → Q, V → J, etc.)
- **Formatage** : `formatCardText(card)` - Affiche "Roi de Trèfle" depuis `{rank: 'K', suit: 'clubs'}`

### Stockage JSONBin.io
- **Bin principal unique** : Toutes les parties dans un seul bin
- **Bin ID partagé** : Doit être partagé entre navigateurs pour fonctionner
- **Partage** : Via URL `?binId=xxx` ou localStorage
- **Synchronisation** : Auto-sync au démarrage et lors des opérations

### Migration des données
- **Fonction** : `migrateGameToHandsFormat(game)` - Convertit les anciennes parties vers le nouveau format avec manches
- **Rétrocompatibilité** : Les anciennes parties sans `hands[]` sont automatiquement migrées

### Gestion des utilisateurs
- **Création** : `createOrGetUser(pseudo)` - Crée ou récupère un utilisateur
- **Unicité** : Vérification automatique via `pseudo_to_userId` mapping
- **Session** : Stockage dans `sessionStorage` pour la session courante
- **Persistance** : Stockage dans `localStorage` pour l'historique

### Auto-refresh
- **game.html** : Refresh automatique toutes les 5 secondes
- **review.html** : Refresh automatique toutes les 10 secondes
- Permet une synchronisation basique entre joueurs

---

## 🎮 Flux Utilisateur Complet

### 1. Premier accès
```
index.html → Créer pseudo → Dashboard affiché
```

### 2. Créer une partie
```
Dashboard → Créer partie → Code généré → Copier code → Rejoindre partie
```

### 3. Rejoindre une partie
```
Dashboard → Rejoindre → Code + Pseudo → Validation → game.html
```

### 4. Pendant le jeu
```
game.html → Saisir cartes (texte) → Valider → (Créateur: définir board) → Nouvelle manche
```

### 5. Fin de partie
```
game.html → Terminer partie → review.html → Voir récapitulatif → Commenter
```

### 6. Récapitulatif
```
review.html → Sélectionner manche → Voir cartes/actions → Ajouter commentaires
```

---

## 📝 Fonctions Principales dans app.js

### Gestion des utilisateurs
- `createOrGetUser(pseudo)` - Crée ou récupère un utilisateur
- `getUserByPseudo(pseudo)` - Récupère par pseudo
- `pseudoExists(pseudo)` - Vérifie l'unicité
- `getUserGames(userId)` - Récupère toutes les parties d'un utilisateur
- `setCurrentUser(userId)` / `getCurrentUser()` - Session courante

### Gestion des parties
- `createGame(code, creatorUserId)` - Crée une partie
- `joinGame(gameCode, userId)` - Rejoint une partie
- `getGame(gameCode)` - Récupère une partie (JSONBin puis localStorage)
- `updateGame(gameCode, updateData)` - Met à jour une partie
- `deleteGame(gameCode)` - Supprime une partie

### Gestion des manches
- `startNewHand(gameCode)` - Commence une nouvelle manche
- `finishCurrentHand(gameCode)` - Termine la manche courante
- `getCurrentHand(gameCode)` - Récupère la manche courante
- `getAllHands(gameCode)` - Récupère toutes les manches
- `migrateGameToHandsFormat(game)` - Migration automatique

### Gestion des données joueur
- `savePlayerCards(gameCode, playerId, cards)` - Sauvegarde les cartes (pour manche courante)
- `savePlayerAction(gameCode, playerId, action)` - Sauvegarde une action (pour manche courante)
- `savePlayerDataForHand(gameCode, handNumber, playerId, data)` - Sauvegarde données pour une manche spécifique

### Gestion du board
- `updateBoardForHand(gameCode, handNumber, boardData)` - Met à jour le board d'une manche
- `updateBoard(gameCode, board)` - Métadonnée (utilise manche courante)

### Parsing des cartes
- `parseCardText(text)` - Parse "RT" → objet carte
- `parseCardsText(text)` - Parse "RT D7" → tableau de cartes
- `formatCardText(card)` - Format "Roi de Trèfle"
- `formatCardToText(card)` - Format court "RT" depuis objet carte

### JSONBin.io
- `getOrCreateMainBinId()` - Récupère ou crée le bin principal
- `getAllGamesFromJSONBin()` - Récupère toutes les parties depuis JSONBin
- `saveAllGamesToJSONBin(games)` - Sauvegarde toutes les parties dans JSONBin
- `syncGamesFromJSONBin()` - Synchronise depuis JSONBin vers localStorage

### Utilitaires
- `getCardDisplay(card)` - Retourne le texte affiché d'une carte
- `createCardElement(card, size)` - Crée un élément DOM pour afficher une carte visuellement
- `saveCurrentPlayer(gameCode, playerId, pseudo)` - Sauvegarde le joueur courant dans sessionStorage
- `getCurrentPlayer()` - Récupère le joueur courant depuis sessionStorage
- `clearCurrentPlayer()` - Efface le joueur courant
- `showAlert(message, type)` - Affiche une alerte à l'utilisateur
- `formatDate(dateString)` - Formate une date en français

### Liste complète des fonctions (48 fonctions dans app.js)
**Parsing & Cartes** : `parseCardText`, `parseCardsText`, `formatCardText`, `formatCardToText`, `getCardDisplay`, `createCardElement`

**Génération IDs** : `generateGameCode`, `generatePlayerId`, `generateUserId`

**JSONBin.io** : `getOrCreateMainBinId`, `getAllGamesFromJSONBin`, `saveAllGamesToJSONBin`, `syncGamesFromJSONBin`

**localStorage** : `getLocalGames`, `saveLocalGame`, `getLocalGame`

**Parties** : `createGame`, `getGame`, `updateGame`, `joinGame`, `finishGame`, `deleteGame`

**Manches** : `getCurrentHand`, `getAllHands`, `startNewHand`, `finishCurrentHand`, `migrateGameToHandsFormat`

**Données joueur** : `savePlayerCards`, `savePlayerAction`, `savePlayerDataForHand`

**Board** : `updateBoard`, `updateBoardForHand`

**Utilisateurs** : `getAllUsers`, `getPseudoMapping`, `saveUser`, `getUserById`, `getUserByPseudo`, `pseudoExists`, `createOrGetUser`, `setCurrentUser`, `getCurrentUser`, `addGameToUserHistory`, `getUserGames`

**Session** : `saveCurrentPlayer`, `getCurrentPlayer`, `clearCurrentPlayer`

**Commentaires** : `addComment`

**Utilitaires** : `showAlert`, `formatDate`

**Constantes** : `SUITS`, `RANKS`, `CARD_PARSING`

---

## ⚙️ Configuration JSONBin.io

### Clé API
- **Fichier** : `app.js` ligne 3
- **Variable** : `JSONBIN_API_KEY`
- **Actuellement** : `'$2a$10$6c90s.Zet6RZY9KavaUMOe45XzGcXpCO3iWp1FgWikSDgAkj3Oxfm'`

### Partage entre navigateurs
1. Premier navigateur crée le bin → ID affiché dans console
2. Autres navigateurs ajoutent `?binId=xxx` à l'URL
3. Ou via console : `localStorage.setItem('jsonbin_main_bin_id', 'xxx')`

---

## 🔑 Constantes et Clés de Stockage

### Clés localStorage
- `LOCAL_STORAGE_KEY` = `"poker_check_games"` - Toutes les parties
- `USERS_STORAGE_KEY` = `"poker_users"` - Tous les utilisateurs
- `PSEUDO_MAPPING_KEY` = `"pseudo_to_userId"` - Mapping pseudo → userId
- `CURRENT_USER_KEY` = `"current_user"` - Utilisateur connecté
- `JSONBIN_MAIN_BIN_ID_KEY` = `"poker_check_main_bin_id"` - ID du bin JSONBin

### Clés sessionStorage
- `CURRENT_GAME_KEY` = `"current_game_code"` - Code de la partie en cours
- `CURRENT_PLAYER_KEY` = `"current_player"` - {id, pseudo} du joueur courant

### Constantes JSONBin.io
- `JSONBIN_BASE_URL` = `"https://api.jsonbin.io/v3/b"`
- `JSONBIN_MAIN_BIN_NAME` = `"poker_check_all_games"`

### Constantes cartes
- `SUITS` : {hearts: '♥', diamonds: '♦', clubs: '♣', spades: '♠'}
- `RANKS` : ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K']
- `CARD_PARSING` : Mapping français → anglais pour le parsing

---

## 🎯 Design et UX

### Palette de couleurs
- **Vert principal** : `#0d7a52` (feutre de poker)
- **Vert foncé** : `#0a5c3d`
- **Vert clair** : `#14a870`
- **Rouge cartes** : `#d32f2f`
- **Noir cartes** : `#212121`
- **Fond** : Gradient vert

### Principes UX
- **Mobile-first** : Téléphone à table = interface adaptée
- **Boutons grands** : Faciles à cliquer
- **Feedback visuel** : Confirmations d'actions
- **Moins de scroll** : Interface compacte et organisée
- **Saisie rapide** : Format texte pour les cartes (pas de clics multiples)

---

## 🔍 Problèmes Connus et Solutions

### Problème : Partie introuvable entre navigateurs
**Cause** : localStorage est local à chaque navigateur
**Solution** : Utiliser JSONBin.io et partager le bin ID via URL

### Problème : Synchronisation entre joueurs
**Cause** : Pas de temps réel
**Solution actuelle** : Auto-refresh toutes les 5 secondes
**Solution future** : WebSockets

### Problème : Chaque navigateur crée son propre bin JSONBin
**Cause** : Le bin ID n'est pas partagé
**Solution** : Partager le bin ID via URL ou localStorage manuellement

---

## 🚀 Guide pour Continuer le Développement

### Pour ajouter une fonctionnalité

1. **Comprendre la structure** : Lire ce fichier et la structure de données
2. **Identifier les fichiers** : Voir quelle page/JS est concerné
3. **Respecter les conventions** :
   - Données liées à une manche = dans `hand.playerData`
   - Utilisateurs = système avec userId persistant
   - Sauvegarde = localStorage + JSONBin (si disponible)

### Points d'attention

- **Toujours migrer** : Utiliser `migrateGameToHandsFormat()` avant de travailler sur une partie
- **Vérifier le créateur** : Certaines actions sont réservées au créateur
- **Gérer les erreurs** : JSONBin peut échouer, toujours avoir un fallback localStorage
- **Mobile-first** : Tester sur mobile, les joueurs sont à table

### Fichiers à modifier pour...

**Ajouter une fonctionnalité utilisateur** :
- `app.js` : Fonctions utilisateurs
- `index.html` : Dashboard

**Modifier l'interface de jeu** :
- `game.html` : Interface principale
- `app.js` : Fonctions de sauvegarde

**Améliorer le récapitulatif** :
- `review.html` : Affichage
- `app.js` : Fonctions de récupération

**Changer le design** :
- `styles.css` : Tous les styles

---

## 📌 Points Critiques à Retenir

1. **Données liées aux manches** : Cartes et actions sont dans `hand.playerData[playerId]`, pas dans `player.cards`
2. **Migration automatique** : Les anciennes parties sont migrées automatiquement
3. **Saisie texte** : Les cartes sont saisies en format texte mais affichées visuellement
4. **Partage JSONBin** : Nécessite le partage du bin ID entre navigateurs
5. **Créateur unique** : Seul le créateur peut définir board, nouvelles manches, terminer
6. **Pseudo unique** : Un pseudo ne peut être utilisé qu'une fois (vérification automatique)
7. **Auto-refresh** : Les pages se rafraîchissent automatiquement pour la synchronisation

---

## 🎲 Exemple d'Utilisation Complète

### Scénario : Partie avec 3 joueurs

1. **Joueur 1 (créateur)** :
   - Crée pseudo "Alice"
   - Crée partie → Code "XYZ789"
   - Partage le code + URL avec binId

2. **Joueur 2** :
   - Ouvre l'app avec URL + binId
   - Rejoint avec code "XYZ789" + pseudo "Bob"

3. **Joueur 3** :
   - Ouvre l'app avec URL + binId
   - Rejoint avec code "XYZ789" + pseudo "Charlie"

4. **Manche 1** :
   - Alice saisit "RT D7" → Valide
   - Bob saisit "AC 10K" → Valide
   - Charlie saisit "VK 9P" → Valide
   - Alice définit board : Flop "2T 3C 4P", Turn "5K", River "6T"
   - Alice clique "Nouvelle manche"

5. **Manche 2** :
   - Tous saisissent leurs nouvelles cartes
   - ...

6. **Fin** :
   - Alice termine la partie
   - Tous voient le récapitulatif avec toutes les manches
   - Ajoutent des commentaires

---

## 🔐 Sécurité et Limitations

### Sécurité
- **Pas d'authentification** : Juste pseudos (POC)
- **Pas de validation serveur** : Tout côté client
- **Données publiques** : JSONBin avec `X-Bin-Private: false` (parties accessibles si on a le code)

### Limitations
- **Stockage** : Limites localStorage (5-10MB) ou JSONBin gratuit
- **Synchronisation** : Pas de temps réel (refresh périodique)
- **Pas de protection** : N'importe qui avec le code peut rejoindre
- **Pas de chiffrement** : Données en clair

---

## 📚 Références Utiles

### Documentation JSONBin.io
- API v3 : https://jsonbin.io/api-reference
- Créer un compte : https://jsonbin.io

### Vercel
- Déploiement : https://vercel.com/docs
- Variables d'environnement : Pour la clé API (à configurer si besoin)

---

## ✅ Checklist pour Nouvelle Conversation

Quand vous reprenez ce projet dans une nouvelle conversation, vérifiez :

- [ ] Structure de données des parties (avec manches)
- [ ] Système d'utilisateurs avec ID persistant
- [ ] Format de saisie des cartes (texte → visuel)
- [ ] Configuration JSONBin.io (clé API + partage bin ID)
- [ ] Navigation entre manches
- [ ] Récapitulatif avec commentaires
- [ ] Dashboard avec historique
- [ ] Système de suppression de parties

---

**Dernière mise à jour** : Version avec manches multiples, système utilisateurs, saisie texte des cartes, JSONBin.io configuré

