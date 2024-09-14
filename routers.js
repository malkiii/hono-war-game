const { Redis } = require('@upstash/redis');
const dotenv = require('dotenv');
const CardWar = require('./game/index.js');
const fs = require('fs');

dotenv.config();

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN
});

const callbackUrl = 'https://github.com/malkiii';

const GAME = new CardWar();

function getImagePath(pathname) {
  return `${__dirname}/public/${pathname}`;
}

async function getCurrentGame() {
  return await redis.get('game');
}

async function setCurrentGame(game) {
  await redis.set('game', JSON.stringify(game));
}

function sendImageData(res, imagePath, type) {
  fs.readFile(getImagePath(imagePath), (err, data) => {
    if (err) {
      res.status(500).send('Error reading image file');
    } else {
      res.setHeader('Content-Type', 'image/' + type);
      res.setHeader('Cache-Control', 'no-cache,max-age=0');
      res.send(data);
    }
  });
}

async function sendScorePlaceholder(res, textColor, score) {
  try {
    const response = await fetch(
      `https://placehold.co/50x50/0000/${textColor}?text=${score}&font=Open%20Sans`
    );
    if (!response.ok) {
      throw new Error('Failed to fetch image');
    }

    const svgData = await response.text();

    res.setHeader('Content-Type', 'image/svg+xml');
    res.setHeader('Cache-Control', 'no-cache,max-age=0');
    res.send(svgData);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
}

// handle image requests
const imageRouter = async (req, res) => {
  const { player, route } = req.params;
  if (player !== '1' && player !== '2') return res.status(404);

  // const GAME = await getCurrentGame();
  GAME.use(await getCurrentGame());
  const currentPlayer = GAME['player' + player];

  switch (route) {
    case 'pile':
      sendImageData(res, currentPlayer.getPileImage(player === '2'), 'png');
      break;

    case 'card':
      const [player1Card, player2Card] = GAME.playedCards;
      const card = player === '1' ? player1Card : player2Card;
      sendImageData(res, card.face, 'png');
      break;

    case 'score':
      const color = GAME.winner() === player ? '0f0' : 'f03a17';
      const score = currentPlayer.score;
      sendScorePlaceholder(res, color, score);
      break;

    default:
      res.status(404);
      break;
  }
};

// handle play request
const playRouter = async (req, res) => {
  // const GAME = await getCurrentGame();
  GAME.use(await getCurrentGame());

  if (GAME.isGameOver()) GAME.initialGame();
  GAME.play();

  await setCurrentGame(GAME.getCurrentGame());

  res.redirect(callbackUrl);
};

async function inisializeGame() {
  const game = await getCurrentGame();
  if (game) return GAME.use(game);

  game.play();
  await setCurrentGame(GAME.getCurrentGame());
}

module.exports = { imageRouter, playRouter, inisializeGame };
