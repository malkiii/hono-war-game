const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '0', 'J', 'Q', 'K', 'A'];
const suits = ['S', 'C', 'H', 'D'];

class Card {
  rank: string;
  suit: string;
  face: string;
  constructor(rank: string, suit: string) {
    this.rank = rank.toUpperCase();
    this.suit = suit.toUpperCase();
    this.face = `cards/${this.rank + this.suit}.png`;
  }

  compareWith(card: this) {
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
  const deck: string[] = [];
  suits.forEach((suit) => ranks.forEach((rank) => deck.push(rank + suit)));

  return deck;
}

function shuffle(deck: string[] | Card[]) {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
}

function getPileArray(array: Card[]) {
  return array.map((card) => card.rank + card.suit);
}

function getCardArray(array: string[]) {
  return array.map((card) => {
    // @ts-ignore
    return card === 'BACK' ? new Card('BA', 'CK') : new Card(...card.split(''));
  });
}

export { Card, generateDeck, shuffle, getPileArray, getCardArray };
