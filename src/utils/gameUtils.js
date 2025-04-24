// src/utils/gameUtils.js

export const createDeck = () => {
    const suits = ['♥︎', '♦︎', '♣️', '♠︎'];
    const ranks = ['A', 'K', 'Q', 'J', '10', '9', '8', '7'];
    const deck = [];

    for (const suit of suits) {
        for (const rank of ranks) {
            deck.push({ suit, rank });
        }
    }
    return deck;
};

export const shuffleDeck = (deck) => {
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    return deck;
};
