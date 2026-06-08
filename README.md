# Vaping Bad - A Game for Teenagers

**Play it here: [vapingbad.netlify.app](https://vapingbad.netlify.app/)**

A serious game designed to educate adolescents (ages 10–14) about the dangers of vaping. Developed as part of the Game Design course at Uppsala University.

## About the Project

Vaping Bad is a browser-based adventure game set inside the body of a long-term vaper. The player navigates through damaged organs — starting with the mouth — encountering the real consequences of vaping through immersive visuals, quizzes, and mini-games.

The game was built on top of [The House Game](https://the-house.arturkot.pl/) by Artur Kot and adapted to deliver vaping prevention content targeting adolescents who are increasingly exposed to vaping culture through peers and social media.

### Why This Game?

Vaping among adolescents is a growing public health concern, with global prevalence estimated at ~16.8%. Vapes contain heavy metals (Cr, Ni, Pb, Mn), pesticides, and toxic chemicals linked to pulmonary, cardiovascular, and neurological harm. Yet many teenagers perceive vaping as harmless.

This game addresses that gap by:
- Delivering engaging, age-appropriate health education through gameplay
- Using horror-inspired visuals of damaged organs to make health consequences memorable
- Rewarding players with coins for completing quizzes, unlocking mini-games
- Offering 3 levels showing a healthy body progressively damaged by vaping

## How It Works

The game is built with **HTML, CSS (Less) and JavaScript (jQuery)**. Each room has HTML markup defining items and click areas, CSS handles the visuals, and JS drives animations, interactions, and game state.

### Scripts

- `js/audio.js` - sound definitions
- `js/data.js` - game state saving
- `js/dialogue_box.js` - popups
- `js/game.js` - top-level game controller
- `js/items.js` - item management
- `js/npcs.js` - non-playable characters
- `js/room.js` - room generation and player movement (uses A* by Andrea Giammarchi)
- `js/scenes.js` - cutscenes
- `js/settings.js` - game settings and reset
- `js/text_cloud.js` - speech balloons
- `js/tooltip.js` - tooltips
- `js/utility.js` - hit-area utility for the game grid
- `js/view.js` - outside views (window lookouts)

## Running Locally

Open `index.html` in a browser. No build step required — all dependencies are loaded via script tags.

For the full hosted version: [https://vapingbad.netlify.app/](https://vapingbad.netlify.app/)

## Credits

### Sound

All sounds from [Freesound.org](http://www.freesound.org):

* ["Distant Shot"](http://www.freesound.org/people/ERH/sounds/32799/) by ERH
* ["Electric Wooshes"](http://www.freesound.org/people/Glaneur%20de%20sons/sounds/34172/) by Glaneur de sons
* ["Sad Pattern Drone"](http://www.freesound.org/people/patchen/sounds/24701/) by patchen
* ["Horror Drone 001"](http://www.freesound.org/people/DJ%20Chronos/sounds/52134/) by DJ Chronos
* ["Creepy Phone"](http://www.freesound.org/people/FreqMan/sounds/25079/) by FreqMan
* And more — see original credits in the source

### JavaScript

* [jQuery](http://jquery.com/), [Modernizr](http://www.modernizr.com/), [SoundManager 2](http://www.schillmania.com/projects/soundmanager2/)
* [A* algorithm](http://devpro.it/examples/astar/) by Andrea Giammarchi
* [Spritely](http://spritely.net/), [jStorage](http://www.jstorage.info/), [jQuery UI](http://jqueryui.com/), [jQuery Transit](http://ricostacruz.com/jquery.transit/)

### Base Game

Built on [The House](https://the-house.arturkot.pl/) by [Artur Kot](https://github.com/arturkot) — MIT License

## License

### Code

MIT License — Copyright (c) 2019 Artur Kot

### Artwork

[Creative Commons Attribution 3.0](http://creativecommons.org/licenses/by/3.0/)
