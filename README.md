# www

32x32-pixel clone of the famous VVVVVV game.

## Gameplay


### Controls

| key                        | action        |
| -------------------------- | ------------- |
| Arrow Keys/WASD            | Move          |
| Space, z, x                | Action        |

## Instructions

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

## License

The whole code is released under the *GPLv3*.

Check file `LICENSE.md` for details on what you can and
cannot do with it.

