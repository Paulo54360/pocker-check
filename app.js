// Configuration JSONBin.io
// Clé API pour JSONBin (gratuite sur https://jsonbin.io)
const JSONBIN_API_KEY = '$2a$10$oryTUwj3Q.QqAHoMNS488OsST5VPIBlV3woKydduc7UuekH3WkF2m';
const JSONBIN_BASE_URL = 'https://api.jsonbin.io/v3/b';
const JSONBIN_MAIN_BIN_ID_KEY = 'poker_check_main_bin_id';
const JSONBIN_MAIN_BIN_NAME = 'poker_check_all_games';

// BinId fixe pour toute l'association - tous les téléphones utilisent automatiquement le même
// Plus besoin de configuration, tout fonctionne automatiquement !
const SHARED_BIN_ID = '6930d2d9ae596e708f81f296';

// Structure d'une carte
const SUITS = {
    hearts: '♥',
    diamonds: '♦',
    clubs: '♣',
    spades: '♠'
};

const RANKS = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

// Mapping pour le parsing des cartes en texte
const CARD_PARSING = {
    // Rangs français vers anglais
    ranks: {
        'A': 'A',
        'AS': 'A',
        'R': 'K',
        'ROI': 'K',
        'D': 'Q',
        'DAME': 'Q',
        'V': 'J',
        'VALET': 'J',
        '2': '2',
        '3': '3',
        '4': '4',
        '5': '5',
        '6': '6',
        '7': '7',
        '8': '8',
        '9': '9',
        '10': '10'
    },
    // Couleurs français vers anglais
    suits: {
        'T': 'clubs',
        'TR': 'clubs',
        'TREFLE': 'clubs',
        'TRE': 'clubs',
        'P': 'spades',
        'PI': 'spades',
        'PIQUE': 'spades',
        'PIQ': 'spades',
        'C': 'hearts',
        'CO': 'hearts',
        'COEUR': 'hearts',
        'COE': 'hearts',
        'K': 'diamonds',
        'CA': 'diamonds',
        'CARREAU': 'diamonds',
        'CAR': 'diamonds'
    }
};

// Parse une carte depuis un texte (ex: "RT" = Roi Trèfle, "D7" = Dame 7)
function parseCardText(text) {
    if (!text || typeof text !== 'string') {
        return null;
    }

    text = text.trim().toUpperCase().replace(/\s+/g, '');

    if (text.length < 2) {
        return null;
    }

    // Pattern 1: RT, D7, AC (Rang + Couleur)
    // Pattern 2: 7D, 10T (Chiffre + Couleur)

    let rank = null;
    let suit = null;

    // Essayer de trouver un rang en premier
    const rankKeys = Object.keys(CARD_PARSING.ranks).sort((a, b) => b.length - a.length);
    for (const key of rankKeys) {
        if (text.startsWith(key)) {
            rank = CARD_PARSING.ranks[key];
            const suitText = text.substring(key.length);
            const suitKeys = Object.keys(CARD_PARSING.suits).sort((a, b) => b.length - a.length);
            for (const suitKey of suitKeys) {
                if (suitText === suitKey || suitText.startsWith(suitKey)) {
                    suit = CARD_PARSING.suits[suitKey];
                    break;
                }
            }
            break;
        }
    }

    // Si pas trouvé, essayer couleur d'abord (pour format comme 7D)
    if (!rank || !suit) {
        const suitKeys = Object.keys(CARD_PARSING.suits).sort((a, b) => b.length - a.length);
        for (const suitKey of suitKeys) {
            if (text.endsWith(suitKey)) {
                suit = CARD_PARSING.suits[suitKey];
                const rankText = text.substring(0, text.length - suitKey.length);
                if (CARD_PARSING.ranks[rankText]) {
                    rank = CARD_PARSING.ranks[rankText];
                    break;
                }
                // Pour les chiffres
                if (/^\d+$/.test(rankText)) {
                    rank = rankText;
                    break;
                }
            }
        }
    }

    if (rank && suit) {
        return { rank, suit };
    }

    return null;
}

// Parse plusieurs cartes depuis un texte (ex: "RT D7" ou "RT, D7")
function parseCardsText(text) {
    if (!text) return [];

    // Séparer par virgule, espace, ou saut de ligne
    const parts = text.split(/[,\s\n]+/).filter(p => p.trim().length > 0);

    const cards = [];
    for (const part of parts) {
        const card = parseCardText(part);
        if (card) {
            cards.push(card);
        }
    }

    return cards;
}

// Format une carte en texte lisible (ex: {rank: 'K', suit: 'clubs'} -> "Roi de Trèfle")
function formatCardText(card) {
    if (!card || !card.rank || !card.suit) return '';

    const rankNames = {
        'A': 'As',
        '2': '2',
        '3': '3',
        '4': '4',
        '5': '5',
        '6': '6',
        '7': '7',
        '8': '8',
        '9': '9',
        '10': '10',
        'J': 'Valet',
        'Q': 'Dame',
        'K': 'Roi'
    };

    const suitNames = {
        'hearts': 'Cœur',
        'diamonds': 'Carreau',
        'clubs': 'Trèfle',
        'spades': 'Pique'
    };

    const rankName = rankNames[card.rank] || card.rank;
    const suitName = suitNames[card.suit] || card.suit;

    return `${rankName} de ${suitName}`;
}

// Génère un code de partie unique (6 caractères alphanumériques)
function generateGameCode() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
}

// Génère un ID unique pour un joueur
function generatePlayerId() {
    return 'player_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// Génère un ID unique pour un utilisateur
function generateUserId() {
    return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// Stockage local des parties (fallback si JSONBin échoue)
const LOCAL_STORAGE_KEY = 'poker_check_games';
const USERS_STORAGE_KEY = 'poker_users';
const PSEUDO_MAPPING_KEY = 'pseudo_to_userId';
const CURRENT_USER_KEY = 'current_user';

// Système JSONBin avec bin principal unique pour toutes les parties
// NOTE: Pour partager entre navigateurs, tous doivent utiliser le même binId principal
// Le bin principal est créé au premier lancement et stocké dans localStorage
// Pour partager, copiez l'ID du bin depuis localStorage: 'jsonbin_main_bin_id'

async function getOrCreateMainBinId() {
    if (!JSONBIN_API_KEY || JSONBIN_API_KEY === 'YOUR_JSONBIN_API_KEY') {
        return null;
    }

    // SIMPLICITÉ MAXIMALE : Utiliser le binId fixe directement
    // Tous les téléphones utilisent automatiquement le même bin, zéro configuration !
    return SHARED_BIN_ID;
}

async function getAllGamesFromJSONBin() {
    if (!JSONBIN_API_KEY || JSONBIN_API_KEY === 'YOUR_JSONBIN_API_KEY') {
        return null;
    }

    const mainBinId = await getOrCreateMainBinId();
    if (!mainBinId) return null;

    try {
        const response = await fetch(`${JSONBIN_BASE_URL}/${mainBinId}/latest`, {
            headers: {
                'X-Master-Key': JSONBIN_API_KEY
            }
        });

        if (response.ok) {
            const result = await response.json();
            return result.record || {};
        }
    } catch (error) {
        console.warn('Erreur récupération JSONBin:', error);
    }

    return null;
}

async function saveAllGamesToJSONBin(games) {
    if (!JSONBIN_API_KEY || JSONBIN_API_KEY === 'YOUR_JSONBIN_API_KEY') {
        return false;
    }

    const mainBinId = await getOrCreateMainBinId();
    if (!mainBinId) return false;

    try {
        const response = await fetch(`${JSONBIN_BASE_URL}/${mainBinId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'X-Master-Key': JSONBIN_API_KEY
            },
            body: JSON.stringify(games)
        });

        return response.ok;
    } catch (error) {
        console.warn('Erreur sauvegarde JSONBin:', error);
        return false;
    }
}

// Récupère toutes les parties du localStorage
function getLocalGames() {
    try {
        const games = localStorage.getItem(LOCAL_STORAGE_KEY);
        return games ? JSON.parse(games) : {};
    } catch (e) {
        return {};
    }
}

// Synchronise les parties depuis JSONBin vers localStorage
async function syncGamesFromJSONBin() {
    if (!JSONBIN_API_KEY || JSONBIN_API_KEY === 'YOUR_JSONBIN_API_KEY') {
        console.log('ℹ️ JSONBin non configuré. L\'app fonctionne en mode local uniquement.');
        return;
    }

    try {
        const jsonbinGames = await getAllGamesFromJSONBin();
        if (jsonbinGames && Object.keys(jsonbinGames).length > 0) {
            const localGames = getLocalGames();
            // Fusionner (JSONBin prioritaire)
            const mergedGames = {...localGames, ...jsonbinGames };
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(mergedGames));
            console.log('✅ Synchronisation JSONBin réussie');
        } else {
            console.log('ℹ️ Aucune partie sur JSONBin. L\'app fonctionne en mode local.');
        }
    } catch (error) {
        console.warn('⚠️ Erreur synchronisation JSONBin (l\'app continue en mode local):', error);
        // L'app continue de fonctionner avec localStorage uniquement
    }
}

// Sauvegarde une partie dans localStorage
function saveLocalGame(gameCode, gameData) {
    try {
        const games = getLocalGames();
        games[gameCode] = gameData;
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(games));

        // Sauvegarder aussi dans JSONBin si disponible
        if (JSONBIN_API_KEY && JSONBIN_API_KEY !== 'YOUR_JSONBIN_API_KEY') {
            saveAllGamesToJSONBin(games).catch(err => {
                console.warn('Erreur sauvegarde JSONBin (non bloquant):', err);
            });
        }

        return true;
    } catch (e) {
        console.error('Erreur sauvegarde locale:', e);
        return false;
    }
}

// Récupère une partie depuis localStorage
function getLocalGame(gameCode) {
    const games = getLocalGames();
    return games[gameCode] || null;
}

// Crée une partie (JSONBin ou localStorage selon disponibilité)
async function createGame(code, creatorUserId) {
    const creator = getUserById(creatorUserId);
    if (!creator) {
        return { success: false, error: 'Utilisateur introuvable' };
    }

    const gameData = {
        gameCode: code,
        createdAt: new Date().toISOString(),
        creatorId: creatorUserId,
        players: [],
        status: 'playing',
        currentHand: 1,
        hands: [{
            handNumber: 1,
            status: 'playing',
            board: {
                flop: [],
                turn: null,
                river: null
            },
            playerData: {},
            startedAt: new Date().toISOString()
        }]
    };

    // Ajouter le créateur comme joueur
    const playerId = generatePlayerId();
    gameData.players.push({
        id: playerId,
        userId: creatorUserId,
        pseudo: creator.pseudo,
        comments: [],
        isCreator: true
    });

    gameData.hands[0].playerData[playerId] = {
        cards: [],
        actions: []
    };

    // Ajouter la partie à l'historique de l'utilisateur
    addGameToUserHistory(creatorUserId, code);

    // Sauvegarder (localStorage + JSONBin si disponible)
    saveLocalGame(code, gameData);

    return { success: true, gameData, binId: null };
}

// Récupère une partie
async function getGame(gameCode) {
    // Essayer JSONBin d'abord
    if (JSONBIN_API_KEY && JSONBIN_API_KEY !== 'YOUR_JSONBIN_API_KEY') {
        try {
            const allGames = await getAllGamesFromJSONBin();
            if (allGames && allGames[gameCode]) {
                // Synchroniser avec localStorage
                saveLocalGame(gameCode, allGames[gameCode]);
                return allGames[gameCode];
            }
        } catch (error) {
            console.warn('Erreur JSONBin, fallback localStorage:', error);
        }
    }

    // Fallback localStorage
    const localGame = getLocalGame(gameCode);
    if (localGame) {
        return localGame;
    }

    return null;
}

// Met à jour une partie
async function updateGame(gameCode, updateData) {
    const game = await getGame(gameCode);
    if (!game) {
        return { success: false, error: 'Partie introuvable' };
    }

    const migratedGame = migrateGameToHandsFormat(game);
    if (!migratedGame) {
        return { success: false, error: 'Erreur lors du chargement de la partie' };
    }

    // Fusionner les données
    Object.assign(migratedGame, updateData);

    // Sauvegarder
    saveLocalGame(gameCode, migratedGame);

    return { success: true, gameData: migratedGame };
}

// Rejoint une partie
async function joinGame(gameCode, userId) {
    const user = getUserById(userId);
    if (!user) {
        return { success: false, error: 'Utilisateur introuvable' };
    }

    const game = await getGame(gameCode);

    if (!game) {
        return { success: false, error: 'Partie introuvable. Vérifiez que le code est correct.' };
    }

    const migratedGame = migrateGameToHandsFormat(game);

    if (!migratedGame) {
        return { success: false, error: 'Erreur lors du chargement de la partie' };
    }

    if (migratedGame.status === 'finished') {
        return { success: false, error: 'Cette partie est terminée' };
    }

    // Vérifier si l'utilisateur joue déjà
    const existingPlayer = migratedGame.players.find(p => p.userId === userId);
    if (existingPlayer) {
        return { success: false, error: 'Vous participez déjà à cette partie' };
    }

    // Ajouter le joueur
    const playerId = generatePlayerId();
    migratedGame.players.push({
        id: playerId,
        userId: userId,
        pseudo: user.pseudo,
        comments: [],
        isCreator: false
    });

    // Ajouter le joueur à la manche courante
    const currentHand = migratedGame.hands.find(h => h.handNumber === migratedGame.currentHand);
    if (currentHand) {
        if (!currentHand.playerData) {
            currentHand.playerData = {};
        }
        currentHand.playerData[playerId] = {
            cards: [],
            actions: []
        };
    }

    const result = await updateGame(gameCode, migratedGame);

    // Ajouter la partie à l'historique de l'utilisateur
    if (result.success) {
        addGameToUserHistory(userId, gameCode);
        return { success: true, playerId, gameData: result.gameData };
    }

    return { success: false, error: 'Erreur lors de la connexion' };
}

// Sauvegarde les cartes d'un joueur pour la manche courante
async function savePlayerCards(gameCode, playerId, cards) {
    const game = await getGame(gameCode);
    if (!game) {
        return { success: false, error: 'Partie introuvable' };
    }

    const migratedGame = migrateGameToHandsFormat(game);
    const currentHandNum = migratedGame.currentHand || 1;

    return await savePlayerDataForHand(gameCode, currentHandNum, playerId, { cards });
}

// Sauvegarde une action d'un joueur pour la manche courante
async function savePlayerAction(gameCode, playerId, action) {
    const game = await getGame(gameCode);
    if (!game) {
        return { success: false, error: 'Partie introuvable' };
    }

    const migratedGame = migrateGameToHandsFormat(game);
    const currentHandNum = migratedGame.currentHand || 1;
    const currentHand = migratedGame.hands.find(h => h.handNumber === currentHandNum);

    if (!currentHand || !currentHand.playerData || !currentHand.playerData[playerId]) {
        return { success: false, error: 'Joueur ou manche introuvable' };
    }

    const actionData = {
        id: Date.now().toString(),
        type: action.type,
        amount: action.amount || null,
        timestamp: new Date().toISOString()
    };

    currentHand.playerData[playerId].actions.push(actionData);

    return await updateGame(gameCode, migratedGame);
}

// Met à jour le board (pour compatibilité, utilise la manche courante)
async function updateBoard(gameCode, board) {
    const game = await getGame(gameCode);
    if (!game) {
        return { success: false, error: 'Partie introuvable' };
    }

    const migratedGame = migrateGameToHandsFormat(game);
    const currentHandNum = migratedGame.currentHand || 1;

    return await updateBoardForHand(gameCode, currentHandNum, board);
}

// Termine une partie
async function finishGame(gameCode) {
    return await updateGame(gameCode, { status: 'finished' });
}

// Supprime une partie
async function deleteGame(gameCode) {
    try {
        const games = getLocalGames();

        if (!games[gameCode]) {
            return { success: false, error: 'Partie introuvable' };
        }

        // Supprimer la partie
        delete games[gameCode];
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(games));

        // Sauvegarder dans JSONBin
        if (JSONBIN_API_KEY && JSONBIN_API_KEY !== 'YOUR_JSONBIN_API_KEY') {
            await saveAllGamesToJSONBin(games);
        }

        // Retirer la partie de l'historique de tous les utilisateurs
        const allUsers = getAllUsers();
        for (const userId in allUsers) {
            const user = allUsers[userId];
            if (user.gameHistory && user.gameHistory.includes(gameCode)) {
                user.gameHistory = user.gameHistory.filter(code => code !== gameCode);
                saveUser(user);
            }
        }

        return { success: true };
    } catch (e) {
        console.error('Erreur suppression partie:', e);
        return { success: false, error: 'Erreur lors de la suppression' };
    }
}

// Ajoute un commentaire à un joueur
async function addComment(gameCode, targetPlayerId, authorPseudo, comment) {
    const game = await getGame(gameCode);
    if (!game) {
        return { success: false, error: 'Partie introuvable' };
    }

    const targetPlayer = game.players.find(p => p.id === targetPlayerId);
    if (!targetPlayer) {
        return { success: false, error: 'Joueur introuvable' };
    }

    const commentData = {
        id: Date.now().toString(),
        author: authorPseudo,
        text: comment,
        timestamp: new Date().toISOString()
    };

    if (!targetPlayer.comments) {
        targetPlayer.comments = [];
    }

    targetPlayer.comments.push(commentData);

    return await updateGame(gameCode, { players: game.players });
}

// ==================== SYSTÈME D'UTILISATEURS ====================

// Récupère tous les utilisateurs
function getAllUsers() {
    try {
        const users = localStorage.getItem(USERS_STORAGE_KEY);
        return users ? JSON.parse(users) : {};
    } catch (e) {
        return {};
    }
}

// Récupère le mapping pseudo -> userId
function getPseudoMapping() {
    try {
        const mapping = localStorage.getItem(PSEUDO_MAPPING_KEY);
        return mapping ? JSON.parse(mapping) : {};
    } catch (e) {
        return {};
    }
}

// Sauvegarde un utilisateur
function saveUser(user) {
    try {
        const users = getAllUsers();
        const mapping = getPseudoMapping();

        users[user.userId] = user;
        mapping[user.pseudo.toLowerCase()] = user.userId;

        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
        localStorage.setItem(PSEUDO_MAPPING_KEY, JSON.stringify(mapping));

        return true;
    } catch (e) {
        console.error('Erreur sauvegarde utilisateur:', e);
        return false;
    }
}

// Récupère un utilisateur par ID
function getUserById(userId) {
    const users = getAllUsers();
    return users[userId] || null;
}

// Récupère un utilisateur par pseudo
function getUserByPseudo(pseudo) {
    const mapping = getPseudoMapping();
    const userId = mapping[pseudo.toLowerCase()];
    if (userId) {
        return getUserById(userId);
    }
    return null;
}

// Vérifie si un pseudo existe déjà
function pseudoExists(pseudo) {
    const mapping = getPseudoMapping();
    return mapping.hasOwnProperty(pseudo.toLowerCase());
}

// Crée ou récupère un utilisateur
function createOrGetUser(pseudo) {
    // Vérifier si le pseudo existe déjà
    const existingUser = getUserByPseudo(pseudo);
    if (existingUser) {
        return { success: true, user: existingUser, isNew: false };
    }

    // Créer un nouvel utilisateur
    const userId = generateUserId();
    const newUser = {
        userId: userId,
        pseudo: pseudo,
        createdAt: new Date().toISOString(),
        gameHistory: []
    };

    if (saveUser(newUser)) {
        return { success: true, user: newUser, isNew: true };
    }

    return { success: false, error: 'Erreur lors de la création de l\'utilisateur' };
}

// Définit l'utilisateur courant
function setCurrentUser(userId) {
    localStorage.setItem(CURRENT_USER_KEY, userId);
}

// Récupère l'utilisateur courant
function getCurrentUser() {
    const userId = localStorage.getItem(CURRENT_USER_KEY);
    if (userId) {
        return getUserById(userId);
    }
    return null;
}

// Ajoute une partie à l'historique d'un utilisateur
function addGameToUserHistory(userId, gameCode) {
    const user = getUserById(userId);
    if (!user) return false;

    if (!user.gameHistory.includes(gameCode)) {
        user.gameHistory.push(gameCode);
        return saveUser(user);
    }
    return true;
}

// Récupère toutes les parties d'un utilisateur
function getUserGames(userId) {
    const user = getUserById(userId);
    if (!user || !user.gameHistory) return [];

    const games = [];
    user.gameHistory.forEach(gameCode => {
        const game = getLocalGame(gameCode);
        if (game) {
            games.push(game);
        }
    });

    // Trier par date de création (plus récent en premier)
    games.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return games;
}

// ==================== SYSTÈME DE MANCHES ====================

// Migre une partie ancienne vers le nouveau format avec manches
function migrateGameToHandsFormat(game) {
    if (!game) {
        return null;
    }

    if (game.hands && Array.isArray(game.hands)) {
        return game; // Déjà migré
    }

    // Créer la première manche avec les données existantes
    const firstHand = {
        handNumber: 1,
        status: game.status === 'finished' ? 'finished' : 'playing',
        board: game.board || { flop: [], turn: null, river: null },
        playerData: {},
        finishedAt: game.status === 'finished' ? (game.finishedAt || new Date().toISOString()) : null
    };

    // Migrer les données des joueurs
    if (game.players && game.players.length > 0) {
        game.players.forEach(player => {
            firstHand.playerData[player.id] = {
                cards: player.cards || [],
                actions: player.actions || []
            };
        });
    }

    game.hands = [firstHand];
    game.currentHand = 1;

    // Garder la structure players pour compatibilité
    if (!game.players) {
        game.players = [];
    }

    return game;
}

// Récupère la manche courante d'une partie
async function getCurrentHand(gameCode) {
    const game = await getGame(gameCode);
    if (!game) return null;

    const migratedGame = migrateGameToHandsFormat(game);
    const currentHandNum = migratedGame.currentHand || 1;

    return migratedGame.hands.find(h => h.handNumber === currentHandNum) || null;
}

// Récupère toutes les manches d'une partie
async function getAllHands(gameCode) {
    const game = await getGame(gameCode);
    if (!game) return [];

    const migratedGame = migrateGameToHandsFormat(game);
    return migratedGame.hands || [];
}

// Commence une nouvelle manche
async function startNewHand(gameCode) {
    const game = await getGame(gameCode);
    if (!game) {
        return { success: false, error: 'Partie introuvable' };
    }

    const migratedGame = migrateGameToHandsFormat(game);

    // Terminer la manche courante si elle existe
    const currentHand = migratedGame.hands.find(h => h.handNumber === migratedGame.currentHand);
    if (currentHand && currentHand.status === 'playing') {
        currentHand.status = 'finished';
        currentHand.finishedAt = new Date().toISOString();
    }

    // Créer une nouvelle manche
    const newHandNumber = migratedGame.hands.length + 1;
    const newHand = {
        handNumber: newHandNumber,
        status: 'playing',
        board: { flop: [], turn: null, river: null },
        playerData: {},
        startedAt: new Date().toISOString()
    };

    migratedGame.hands.push(newHand);
    migratedGame.currentHand = newHandNumber;

    const result = await updateGame(gameCode, migratedGame);
    return { success: result.success, hand: newHand, gameData: result.gameData };
}

// Termine la manche courante
async function finishCurrentHand(gameCode) {
    const game = await getGame(gameCode);
    if (!game) {
        return { success: false, error: 'Partie introuvable' };
    }

    const migratedGame = migrateGameToHandsFormat(game);
    const currentHand = migratedGame.hands.find(h => h.handNumber === migratedGame.currentHand);

    if (!currentHand) {
        return { success: false, error: 'Manche introuvable' };
    }

    currentHand.status = 'finished';
    currentHand.finishedAt = new Date().toISOString();

    const result = await updateGame(gameCode, migratedGame);
    return { success: result.success, gameData: result.gameData };
}

// Sauvegarde les données d'un joueur pour la manche courante
async function savePlayerDataForHand(gameCode, handNumber, playerId, data) {
    const game = await getGame(gameCode);
    if (!game) {
        return { success: false, error: 'Partie introuvable' };
    }

    const migratedGame = migrateGameToHandsFormat(game);
    const hand = migratedGame.hands.find(h => h.handNumber === handNumber);

    if (!hand) {
        return { success: false, error: 'Manche introuvable' };
    }

    if (!hand.playerData) {
        hand.playerData = {};
    }

    if (!hand.playerData[playerId]) {
        hand.playerData[playerId] = { cards: [], actions: [] };
    }

    // Fusionner les données
    if (data.cards !== undefined) {
        hand.playerData[playerId].cards = data.cards;
    }
    if (data.actions !== undefined) {
        hand.playerData[playerId].actions = data.actions;
    }

    const result = await updateGame(gameCode, migratedGame);
    return { success: result.success, gameData: result.gameData };
}

// Met à jour le board d'une manche
async function updateBoardForHand(gameCode, handNumber, boardData) {
    const game = await getGame(gameCode);
    if (!game) {
        return { success: false, error: 'Partie introuvable' };
    }

    const migratedGame = migrateGameToHandsFormat(game);
    const hand = migratedGame.hands.find(h => h.handNumber === handNumber);

    if (!hand) {
        return { success: false, error: 'Manche introuvable' };
    }

    hand.board = {...hand.board, ...boardData };

    const result = await updateGame(gameCode, migratedGame);
    return { success: result.success, gameData: result.gameData };
}

// Utilitaires pour les cartes
function getCardDisplay(card) {
    if (!card || !card.rank || !card.suit) return '';
    const suitSymbol = SUITS[card.suit] || '';
    const isRed = card.suit === 'hearts' || card.suit === 'diamonds';
    return {
        rank: card.rank,
        suit: suitSymbol,
        isRed: isRed
    };
}

function createCardElement(card, size = 'normal') {
    const display = getCardDisplay(card);
    if (!display.rank) return null;

    const cardDiv = document.createElement('div');
    cardDiv.className = `card ${display.isRed ? 'red' : 'black'}`;
    if (size === 'small') {
        cardDiv.style.width = '60px';
    }

    cardDiv.innerHTML = `
        <div class="card-rank">${display.rank}</div>
        <div class="card-suit">${display.suit}</div>
    `;

    return cardDiv;
}

// Stockage session pour le joueur actuel
function saveCurrentPlayer(gameCode, playerId, pseudo) {
    sessionStorage.setItem('currentGameCode', gameCode);
    sessionStorage.setItem('currentPlayerId', playerId);
    sessionStorage.setItem('currentPlayerPseudo', pseudo);
}

function getCurrentPlayer() {
    return {
        gameCode: sessionStorage.getItem('currentGameCode'),
        playerId: sessionStorage.getItem('currentPlayerId'),
        pseudo: sessionStorage.getItem('currentPlayerPseudo')
    };
}

function clearCurrentPlayer() {
    sessionStorage.removeItem('currentGameCode');
    sessionStorage.removeItem('currentPlayerId');
    sessionStorage.removeItem('currentPlayerPseudo');
}

// Utilitaires d'affichage
function showAlert(message, type = 'info') {
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.textContent = message;

    const container = document.querySelector('.container') || document.body;
    const firstChild = container.firstElementChild;
    if (firstChild) {
        container.insertBefore(alert, firstChild);
    } else {
        container.appendChild(alert);
    }

    setTimeout(() => {
        alert.remove();
    }, 5000);
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Export des fonctions (pour utilisation dans les pages)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        generateGameCode,
        createGame,
        joinGame,
        getGame,
        updateGame,
        savePlayerCards,
        savePlayerAction,
        updateBoard,
        finishGame,
        deleteGame,
        addComment,
        saveCurrentPlayer,
        getCurrentPlayer,
        clearCurrentPlayer,
        getCardDisplay,
        createCardElement,
        showAlert,
        formatDate,
        parseCardText,
        parseCardsText,
        formatCardText,
        SUITS,
        RANKS
    };
}