# 🃏 Poker Check

Une application web simple et intuitive pour noter, analyser et commenter vos parties de poker entre amis.

## 📋 Description

Poker Check permet aux joueurs de :
- Créer une partie avec un code unique
- Rejoindre une partie via un code
- Noter leurs cartes et actions en temps réel
- Consulter le récapitulatif de la partie à la fin
- Ajouter des commentaires et annotations sur les coups

## 🚀 Déploiement sur Vercel

### Prérequis
- Un compte GitHub
- Un compte Vercel (gratuit)

### Étapes

1. **Pousser le code sur GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/VOTRE_USERNAME/pocker-check.git
   git push -u origin main
   ```

2. **Déployer sur Vercel**
   - Allez sur [vercel.com](https://vercel.com)
   - Connectez-vous avec GitHub
   - Cliquez sur "New Project"
   - Importez votre repository `pocker-check`
   - Vercel détectera automatiquement les fichiers statiques
   - Cliquez sur "Deploy"

3. **Configuration (optionnelle)**
   - L'application utilise localStorage par défaut (données stockées localement)
   - Pour un stockage persistant partagé, vous pouvez configurer JSONBin.io (voir section Stockage)

## 💾 Stockage des données

### Option 1 : localStorage (défaut)
L'application fonctionne par défaut avec localStorage. Les données sont stockées dans le navigateur du créateur de la partie.

**Avantages :**
- Aucune configuration nécessaire
- Fonctionne immédiatement

**Inconvénients :**
- Les données ne sont accessibles que depuis le même navigateur
- Pas de synchronisation entre appareils

### Option 2 : JSONBin.io (recommandé pour la production)

Pour un stockage persistant et partagé :

1. **Créer un compte gratuit sur JSONBin.io**
   - Allez sur [jsonbin.io](https://jsonbin.io)
   - Créez un compte (gratuit)
   - Obtenez votre clé API dans les paramètres

2. **Configurer la clé API**
   - Ouvrez `app.js`
   - Remplacez `YOUR_JSONBIN_API_KEY` par votre clé API :
   ```javascript
   const JSONBIN_API_KEY = 'votre-cle-api-ici';
   ```

3. **Partager le bin ID entre navigateurs** (IMPORTANT pour jouer avec plusieurs téléphones)
   
   Pour que tout le monde voie les mêmes parties :
   
   **Méthode simple (recommandée)** :
   - Le premier utilisateur (créateur de l'association) ouvre l'app
   - L'app crée automatiquement un ID de partage
   - Sur la page d'accueil, dans la section "🔗 Configuration de partage", cliquez sur "📋 Copier"
   - Partagez cet ID avec tous les membres (via WhatsApp, email, etc.)
   - Les autres membres collent cet ID dans le champ "Collez l'ID de partage ici" et cliquent sur "Enregistrer"
   - C'est tout ! Tout le monde voit maintenant les mêmes parties
   
   **Alternative** : Via l'URL
   - Ajoutez `?binId=xxxxxx` à l'URL de l'application
   - Exemple : `https://votre-app.vercel.app/?binId=65abc123...`

**Note :** Sans partage du bin ID, chaque téléphone crée son propre espace de stockage et les parties ne seront pas visibles entre téléphones.

## 📁 Structure du projet

```
pocker-check/
├── index.html          # Page d'accueil
├── create.html         # Création de partie
├── join.html           # Rejoindre une partie
├── game.html           # Interface de jeu
├── review.html         # Récapitulatif
├── styles.css          # Styles CSS
├── app.js              # Logique principale
└── README.md           # Documentation
```

## 🎮 Utilisation

### Pour le créateur de la partie

1. Accédez à l'application
2. Cliquez sur "Créer une partie"
3. Entrez votre pseudo
4. Cliquez sur "Créer la partie"
5. Copiez le code généré et partagez-le avec vos amis
6. Cliquez sur "Rejoindre la partie" pour commencer

### Pour les participants

1. Accédez à l'application
2. Cliquez sur "Rejoindre une partie"
3. Entrez le code de la partie et votre pseudo
4. Cliquez sur "Rejoindre"

### Pendant la partie

- **Sélectionnez vos cartes** : Cliquez sur 2 cartes dans la grille
- **Enregistrez vos actions** : Cliquez sur Check, Call, Raise, Fold ou All-in
- **Terminez la partie** : Le créateur peut cliquer sur "Terminer la partie"

### Après la partie

- Consultez le récapitulatif avec toutes les cartes et actions
- Ajoutez des commentaires sur les coups des autres joueurs
- Analysez et progressez ensemble

## 🎨 Fonctionnalités

- ✅ Création/rejoindre une partie avec code unique
- ✅ Sélection visuelle des cartes
- ✅ Enregistrement des actions (Check, Call, Raise, Fold, All-in)
- ✅ Récapitulatif complet après la partie
- ✅ Système de commentaires et annotations
- ✅ Design responsive (mobile-friendly)
- ✅ Interface intuitive et moderne

## 🔧 Technologies utilisées

- HTML5
- CSS3 (responsive, animations)
- JavaScript vanilla (ES6+)
- localStorage / JSONBin.io pour le stockage
- Vercel pour l'hébergement

## 📝 Limitations du POC

- Pas de synchronisation temps réel (refresh automatique toutes les 5 secondes)
- Pas d'authentification (juste pseudos)
- Stockage limité par localStorage ou limites JSONBin.io gratuites

## 🚧 Améliorations futures possibles

- Synchronisation temps réel avec WebSockets
- Historique des parties
- Statistiques des joueurs
- Support multi-mains
- Calcul automatique des mains gagnantes
- Mode offline amélioré

## 📄 Licence

Projet personnel pour usage associatif.

## 👥 Contribution

Ce projet est un POC pour une association de poker. Les contributions et suggestions sont les bienvenues !

---

**Note :** Cette application est conçue pour être simple et fonctionnelle. L'objectif est de permettre aux joueurs de noter et analyser leurs parties facilement, sans complexité inutile.
