import { Hono, type Context } from 'hono';
import { cache } from 'hono/cache';
import WarGame from './game';

interface Env {
  KV: KVNamespace;
  CALLBACK_URL: string;
}

const app = new Hono<{ Bindings: Env }>();

app.get('/', (c) => c.text('GET /play to play the game.'));

// disable cache for all routes
app.get('*', cache({ cacheName: 'war', cacheControl: 'max-age=0' }));

app.get('/player/:player/:route', async (c) => {
  const { player, route } = c.req.param();
  if (player !== '1' && player !== '2') return c.status(404);

  const GAME = await getCurrentGame(c.env.KV);
  const currentPlayer = GAME[`player${player}`];

  switch (route) {
    case 'pile':
      return sendImageData(c, currentPlayer.getPileImage(player === '2'), 'png');

    case 'card':
      const [player1Card, player2Card] = GAME.playedCards;
      const card = player === '1' ? player1Card : player2Card;
      return sendImageData(c, card.face, 'png');

    case 'score':
      const color = GAME.winner() === player ? '0f0' : 'f03a17';
      const score = currentPlayer.score;
      return sendScorePlaceholder(c, color, score);

    default:
      return c.notFound();
  }
});

app.get('/play', async (c) => {
  const GAME = await getCurrentGame(c.env.KV);

  if (GAME.isGameOver()) GAME.initialGame();
  GAME.play();

  await setCurrentGame(c.env.KV, GAME);

  return c.redirect(c.env.CALLBACK_URL);
});

function getImageURL(pathname: string) {
  return `https://raw.githubusercontent.com/malkiii/hono-war-game/master/assets/${pathname}`;
}

async function getCurrentGame(kv: KVNamespace) {
  const state = await kv.get('game', 'json');
  const game = new WarGame();

  if (state) {
    game.use(state as any);
  } else {
    game.play();
    await setCurrentGame(kv, game);
  }

  return game;
}

async function setCurrentGame(kv: KVNamespace, game: WarGame) {
  await kv.put('game', JSON.stringify(game.getCurrentGame()));
}

async function sendImageData(ctx: Context, imagePath: string, type: 'png' | 'jpg') {
  const response = await fetch(getImageURL(imagePath));
  if (!response.ok) {
    return ctx.text('Error reading image file.', 500);
  }

  const data = await response.arrayBuffer();
  ctx.header('Content-Type', `image/${type}`);
  ctx.header('Cache-Control', 'no-cache,max-age=0');

  return ctx.body(data);
}

async function sendScorePlaceholder(ctx: Context, textColor: string, score: number) {
  try {
    const response = await fetch(
      `https://placehold.co/50x50/0000/${textColor}?text=${score}&font=Open%20Sans`,
    );

    if (!response.ok) {
      throw new Error('Failed to fetch image');
    }

    const svgData = await response.text();

    ctx.header('Content-Type', 'image/svg+xml');
    ctx.header('Cache-Control', 'no-cache,max-age=0');

    return ctx.body(svgData);
  } catch (error: any) {
    ctx.text(error.message, 500);
  }
}

export default app;
