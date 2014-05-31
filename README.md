# WWW

![gif](http://alexdantas.net/stuff/wp-content/uploads/2014/05/www-0.5.3.gif)

`WWW` is a low-resolution clone of the [indie game VVVVVV][vvvvvv].

It's an open-source 2D HTML5 platformer,
[made with melonJS][melonjs] and
created for the [2014 Low Resolution GameJam (#lowrezjam 2014)][jam].

## Plot

Viridian, captain of the D.S.S. SoulEye, is having a nice day when suddenly
the ship's navigational systems goes astray. He and his crew mates are
violently thrown into a huge dimensional vortex and everything fades to black.

When he awakes, everything around him seems strange. It's as if the world around
him and himself became blurred, square-ish and kinda... pixelated.

That's when he finds himself on a very familiar situation...

## Gameplay

The game mechanic is [the same as VVVVVV][intro]: you can walk around but
cannot jump. Instead, you can flip gravity and fall upward to the ceiling
(or downward to the floor if you're already on the ceiling).

When you die (either by touching spikes or enemies), you go back to a
nearby checkpoint.

### Controls

| key                        | action        |
| -------------------------- | ------------- |
| Arrow Keys, WASD           | Move          |
| Space, z, x                | Action        |
| Enter, ESC                 | Pause         |
| Shift                      | Walk slowly   |

## Instructions

[To play the game right now, follow this link][play].

If you want your own **offline version**, [download the repository][release],
start a web server and open `index.html` on your favorite browser.

Note that this repository is a **development version** of the game.
It splits the code over several `.js` files.

You can build a **production version**, that compresses all the
`.js` files into minified versions.
This way it'll be way faster to load the game.
It is the recommended way to host it on your own website.

To build, be sure you have [node](http://nodejs.org) installed.
On the project directory, run:

    npm install

And then:

    grunt

## Development

Here's how the code is laid out:

| directory            | contents                                                  |
| -------------------- | --------                                                  |
| `index.html`         | Entry point for the game; visual elements                 |
| `data`               | All resources; images, audio, fonts, maps...              |
| `data/audio`         | All things related to sound                               |
| `data/audio/bgm`     | Background music, songs                                   |
| `data/audio/sfx`     | Sound effects                                             |
| `data/image`         | All images                                                |
| `data/image/font`    | Bitmap fonts                                              |
| `data/image/gui`     | Backgrounds and borders for game screens                  |
| `data/image/tile`    | Tilesets used on the Tiled maps                           |
| `data/image/sprite`  | Spritesheets or single sprites                            |
| `data/map`           | Tiled maps                                                |
| `js`                 | Source code for the whole game; main `.js` files          |
| `js/entities`        | Things that interact with each other (player, enemies...) |
| `js/states`          | Game states (screens that can be shown                    |
| `js/gui`             | Components of the user interface (menu, buttons...)       |
| `lib`                | Libraries used for the game (MelonJS)                     |
| `lib/plugins`        | MelonJS plugins                                           |
| `css`                | Stylesheets                                               |

## Credits

This game is a tribute to [Terry Cavanagh's VVVVVV][vvvvvv], one of the best
games I've ever played. It has [an excellent soundtrack, by SoulEye][pppppp];
I can't stop listening to it on a weekly basis.

* The _in-game font_ was based on the [3x3 Font for Nerds][font].
* Thanks to [deviever][deviever] for organizing [the #lowrezjam2014][jam].
  It gave me the motivation necessary to make this game. Also, thanks for the
  [Atari Box][atari-box] and [Atari Cartridge][atari-cartridge] arts!

Also, I'd like to thank the GitHub community for the
[awesome VVVVVV-based projects][github-vvvvvv].

## Tools

For programming, there's nothing like Emacs; recently installed
[Sr-Speedbar][speedbar] and never looked back.

I used [MelonJS][melonjs] to make this game. It is a great HTML5 game engine;
I highly encourage people who wish to develop HTML5 games to give it a try.
It has a simple, straight-to-the-point [introduction][melonjs-tutorial] and
a [nice community][melonjs-group].

To create the maps I used the [Tiled map editor][tiled].

Art assets were made with Photoshop CS5 and GIMP 2.8.10.

Music was composed with [Guitar Pro 5][gp5] and made chiptune
with [GXSCC 236E][gxscc].

## License

The whole code is released under the *GPLv3*.

Check file `LICENSE.md` for details on what you can and
cannot do with it.

[melonjs]:http://melonjs.org/
[jam]:    http://jams.gamejolt.io/lowrezjam2014
[vvvvvv]: http://thelettervsixtim.es/
[intro]:  http://vvvvvv-wiki.wikispaces.com/Introduction
[play]:   http://alexdantas.net/games/www/
[release]:https://github.com/alexdantas/www/releases
[pppppp]: http://www.souleye.se/pppppp
[github-vvvvvv]: https://github.com/search?q=vvvvvv&type=Repositories&ref=searchresults
[melonjs-tutorial]: http://melonjs.github.io/tutorial/
[melonjs-group]: https://groups.google.com/forum/#!forum/melonjs
[font]: cargocollective.com/slowercase/3x3-Font-for-Nerds
[deviever]: http://deviever.com/
[atari-box]: http://deviever.com/atari-box-pack/
[atari-cartridge]: http://deviever.com/atari-cartridge-photoshop-template/
[gif]: http://screentogif.codeplex.com/
[speedbar]: http://www.emacswiki.org/emacs/SrSpeedbar
[gp5]: http://en.wikipedia.org/wiki/Guitar_Pro
[tiled]: http://www.mapeditor.org/
[gxscc]: http://www.geocities.co.jp/SiliconValley-SanJose/8700/P/GsorigE.htm

