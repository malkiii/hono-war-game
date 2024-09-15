# Hono War Game

built using Hono, CF workers and bun. There is two players `player1` and `player2`:

- Any one can play, see [my github profile](https://github.com/malkiii).
- Each one has random 26 cards.
- the game ends when we run out of cards and the one with the highest score wins.
- Click on your pile to play.

## Local Usage

1. after installing dependencies using `bun install`, login to you cloudflare account using:

   ```sh
   bunx wrangler login
   ```

2. rename remove .sample from `.dev.vars.sample` file and paste your upstash ENV variables.
3. in the `wrangler.toml` file, add your `CALLBACK_URL` for the `/play` request.
4. start the development server on [localhost:8787](http://localhost:8787/) using:
   ```sh
   bun run dev
   ```

## Game Setup

| Routes                    | Description                                                           |
| ------------------------- | --------------------------------------------------------------------- |
| `/play`                   | Play the next game (draw a card).                                     |
| `/player/[1 or 2]/:image` | get the current player asset which can be `card`, `pile`, or `score`. |

## License

Distributed under the [MIT](https://github.com/malkiii/hono-war-game/blob/master/LICENSE) license.
