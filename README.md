![](https://img.shields.io/badge/Microverse-blueviolet)

# Husler

> Husler is a game developed on the Phaser 3 framework. Our hero runs around, collecting Gems before they and he run out of lives. A villain could be hiding in any of the Gems, and there is no way to tell. If he collects the gold coin, he will become rich. But if the villain catches him, he dies.

![screenshot](./screenshot.png)

## Built With

- Phaser 3
- JavaScript
- HTML
- SCSS
- Webpack

## Live Demo

[Game](https://husler.netlify.app/)

## Getting Started

To get a local copy of the project up and running, follow these simple steps on the command line.

```bash

  # Clone the project from it's github repo.

  $ git clone https://github.com/chasscepts/phaser-game

  # Change directory to the root of project

  $ cd phaser-game

  # Install all dependencies

  $ npm install

  # Start webpack-dev-server (This will open the page in your browser)

  $ npm run serve

  # Run Tests

  $ npm run test

  # To build the project for production

  $ npm run build

```

## How to play

After the game has finished loading, you are taking to the title page. Enter your name in the field provided and click the "Play Game" button.
Use the left, right, up, and down arrow keys to control the hero's movement. Collect the gems to increase your score. Sometimes a villain will hide in one of the gems, and if you collect such Gem, your character will die. Your score will be multiplied by 50 if you succeed in collecting the gold coin. But it is protected by a door that an unknown force periodically opens. The game ends when any of the following occurs.

- The game period of 5 minutes elapses.
- You collect a villain that is hiding in a gem.
- You collect the gold coin.

At the end of a game, the application uploads the score to an external API. You can retrieve and view the scores in the Leaderboard scene that you access through the title page.

## Game Development Design

#### I drafted the following guide at the beginning of the project. It served as a guide to the features implemented in the project. You can find a copy of the document [here](./GDD.md). Though I have not implemented all the features outlined here, I strictly followed the guideline while developing the game.

# Trapped in a maze

- Our hero is trapped in a maze.
- He can collect silver and bronze coins that randomly appear (these disappear after some time).
- The gold coin is locked away in a room.
- The door to the gold room sometimes opens. The game has a duration, and though the door opens at random times, it should open the same number of times in a game.
- There are many rooms in the maze, some with one, others with two doors. These doors can randomly close at any time.
- The villain is out to trap our hero in a room.
- The villain has assistance who sometimes appears as an innocent coin.
- If our hero can collect the gold before time elapses, his score is multiplied by 100.
- The odds of our hero becoming trapped if he waits outside the gold room door should be made high.
- The game ends if
  1. Game time elapses.
  2. Our hero collides with the villain.
  3. Our hero collects the villain's assistance hidden in a coin.
- Silver and Bronze coins are worth 30 and 10 points each.

### Accomplishments so far

I have been able to implement most of the features I initially set out in the GDD. The only major one that is remaining is making the villain intelligent. The GDD vaguely referenced this in point 9. Currently, the villain does not know where the hero nor the gold coin is on the board. If I can make the villain intelligent, I can add levels to the game by increasing how difficult it is for the hero to survive at higher levels.
But I ran out of time and was not able to accomplish all that.

## Authors

👤 **Obetta Francis**

[![](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/chasscepts) [![](https://img.shields.io/badge/Twitter-1DA1F2?style=for-the-badge&logo=twitter&logoColor=white)](https://twitter.com/chasscepts) [![](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/chasscepts/)

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

Feel free to check the [issues page](https://github.com/chasscepts/phaser-game/issues).

## Show your support

Give a ⭐️ if you like this project!

## Acknowledgments

- hero sprite by [pondomaniac](https://opengameart.org/users/pondomaniac) lincesed under [CC0](https://creativecommons.org/publicdomain/zero/1.0/)

- ladder, wood by [R3tr0BoiDX](https://opengameart.org/users/r3tr0boidx) lincesed under [CC0](https://creativecommons.org/publicdomain/zero/1.0/)

- space by [Scribe](https://opengameart.org/users/r3tr0boidx) lincesed under [CC0](https://creativecommons.org/publicdomain/zero/1.0/)

- rock by [Tiny Speck](http://glitchthegame.com/) lincesed under [CC0](https://creativecommons.org/publicdomain/zero/1.0/)

- gem 1 and gem 2 by [codeinfernogames](https://opengameart.org/users/scribe) lincesed under [CC](https://creativecommons.org/licenses/by/3.0/)

- coin by [WarmGuy](https://opengameart.org/users/warmguy) lincesed under [CC](https://creativecommons.org/licenses/by/3.0/)

- villain by [k-skills](https://opengameart.org/users/k-skills) lincesed under [CC](https://creativecommons.org/licenses/by/3.0/)

- gold coin by [Tweetfold](https://opengameart.org/users/tweetfold) lincesed under [CC](https://creativecommons.org/licenses/by/3.0/)

- pinball by [Heather McKean](https://unsplash.com/@hjmckean?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/s/photos/3d-game?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)

- title-frame by [Johannes Plenio](https://unsplash.com/@jplenio?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/s/photos/frames?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)

- gold-frame, gold-btn from [pngwing.com](https://www.pngwing.com/en/free-png-bmijr/download)

- x-btn by [publicdomainvectors.org](https://publicdomainvectors.org/en/free-clipart/Dark-red-button-in-gray-frame/25778.html)

- score-bg by [Sigmund](https://unsplash.com/@sigmund?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)

- body-bg by [Claudio Testa](https://unsplash.com/@claudiotesta?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/s/photos/forest-background?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)

- Microverse Community
- Everyone whose code was used in this project

## 📝 License

This project is [MIT licensed](./LICENSE)
