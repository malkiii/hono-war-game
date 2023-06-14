// prettier-ignore
const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '0', 'J', 'Q', 'K', 'A'];
const suits = ['S', 'C', 'H', 'D'];

class Card {
  constructor(rank, suit) {
    this.rank = rank.toUpperCase();
    this.suit = suit.toUpperCase();
    this.face = `cards/${this.rank + this.suit}.png`;
  }

  compareWith(card) {
    const currentRank = ranks.indexOf(this.rank);
    const cardRank = ranks.indexOf(card.rank);
    return currentRank > cardRank ? 1 : currentRank < cardRank ? -1 : 0;
  }

  flip() {
    this.rank = 'BA';
    this.suit = 'CK';
    this.face = 'cards/BACK.png';
  }
}

function generateDeck() {
  const deck = [];
  suits.forEach(suit => ranks.forEach(rank => deck.push(rank + suit)));

  return deck;
}

function shuffle(deck) {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
}

function getPileArray(array) {
  return array.map(card => card.rank + card.suit);
}
function getCardArray(array) {
  return array.map(card =>
    card === 'BACK' ? new Card('BA', 'CK') : new Card(...card.split(''))
  );
}

module.exports = { Card, generateDeck, shuffle, getPileArray, getCardArray };
