# Express War Game

a card war game built using `express` and Node.js, there is two players `player1` and `player2` which is me:

- Any one can play, see [my github profile](https://github.com/malkiii)
- Each one has random 26 cards.
- the game ends when we run out of cards and the one with the highest score wins.
- Click on 👆 pile to play.

## Game Setup

| Routes                    | Description                                                                |
| ------------------------- | -------------------------------------------------------------------------- |
| `/play?callback=<URL>`    | Play the next game (draw a card).                                          |
| `/player/[1 or 2]/:image` | get the current player **image** which can be `card` or `pile` or `score`. |

## License

Distributed under the [MIT](https://github.com/malkiii/express-war-game/blob/master/LICENSE) license.

<a href="https://vercel.com/new/git/external?repository-url=https%3A%2F%2Fgithub.com%2Fdatejer%2Fvercel-badge%2Ftree%2Fmaster"><img alt="Powered by Vercel" src="https://vercel.com/button" /></a>
