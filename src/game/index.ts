import * as cards from './cards';

const deckSizes = ['xs', 'sm', 'md', 'lg'];

class Player {
  pile: cards.Card[];
  score: number;
  constructor(player: { pile: string[]; score: number }) {
    this.pile = cards.getCardArray(player.pile);
    this.score = player.score;
  }

  getPileImage(reverse = false) {
    if (this.pile.length === 0) return 'cards/none.png';

    // a player can't have more than 26 cards
    const rangeSize = 26 / deckSizes.length;
    let currentRange = Math.floor(this.pile.length / rangeSize);

    if (currentRange == 0) return 'cards/BACK.png';
    if (currentRange >= deckSizes.length) currentRange = deckSizes.length - 1;

    return `cards/deck-${deckSizes[currentRange]}${reverse ? '-rev' : ''}.png`;
  }
}

export default class WarGame {
  drawPile: cards.Card[][] = [[], []];
  player1: Player = new Player({ pile: [], score: 0 });
  player2: Player = new Player({ pile: [], score: 0 });
  playedCards: cards.Card[] = [];
  isWar: boolean = false;

  constructor() {
    this.initialGame();
  }

  initialGame() {
    const deck = cards.generateDeck();

    this.drawPile = [[], []];

    cards.shuffle(deck);
    this.player1 = new Player({ pile: deck.splice(0, deck.length / 2), score: 0 });
    this.player2 = new Player({ pile: deck, score: 0 });

    cards.shuffle(this.player1.pile);
    cards.shuffle(this.player2.pile);

    this.playedCards = [];
    this.isWar = false;
  }

  use(state: ReturnType<this['getCurrentGame']>) {
    this.drawPile = [cards.getCardArray(state.dp0), cards.getCardArray(state.dp1)];

    this.player1 = new Player(state.player1);
    this.player2 = new Player(state.player2);

    this.playedCards = cards.getCardArray(state.last_cards);

    this.isWar = state.is_war;
  }

  isGameOver() {
    return this.player1.pile.length === 0;
  }

  winner() {
    if (!this.isGameOver()) return undefined;

    return this.player1.score > this.player2.score
      ? '1'
      : this.player1.score < this.player2.score
      ? '2'
      : '';
  }

  play() {
    if (this.isGameOver()) return;

    const player1Card = this.player1.pile.pop()!;
    const player2Card = this.player2.pile.pop()!;
    this.playedCards = [player1Card, player2Card];

    this.drawPile[0].unshift(player1Card);
    this.drawPile[1].unshift(player2Card);

    if (this.isWar) {
      this.drawPile[0][0].flip();
      this.drawPile[1][0].flip();

      this.playedCards = [this.drawPile[0][0], this.drawPile[1][0]];
      this.isWar = false;
      return;
    }

    this.isWar = player1Card.rank === player2Card.rank;
    if (this.isWar) return;

    const points = this.drawPile[0].length + this.drawPile[1].length;
    const isPlayer1Wins = player1Card.compareWith(player2Card) == 1;

    if (isPlayer1Wins) this.player1.score += points;
    else this.player2.score += points;

    this.drawPile = [[], []];
  }

  getCurrentGame() {
    return {
      dp0: cards.getPileArray(this.drawPile[0]),
      dp1: cards.getPileArray(this.drawPile[1]),
      player1: {
        score: this.player1.score,
        pile: cards.getPileArray(this.player1.pile),
      },
      player2: {
        score: this.player2.score,
        pile: cards.getPileArray(this.player2.pile),
      },
      is_war: this.isWar,
      last_cards: cards.getPileArray(this.playedCards),
    };
  }
}
