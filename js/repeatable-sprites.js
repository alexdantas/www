// This is an extension I did on the melonJS library.
// That's why I don't place it along with my game entities.

/*global game,me*/

/**
 * Displays a sprite on the screen, being able to repeat
 * the image along the vertical and horizontal axis.
 * @class
 * @extends me.SpriteObject
 *
 * It's just like a regular Sprite, but it can repeat an
 * image as much as you want.
 *
 * Here's the idea:
 *
 * You have several spikes on the Tiled map,
 * one right next to another, but it's such a pain
 * in the ass to put them individually...
 *
 * So you create a big `RepeatableSpriteObject` entity,
 * that's the size of all the spikes together, and it
 * will look to the player like it's a lot of spikes
 * when "actually it will be one".
 *
 */
me.RepeatableSpriteObject = me.SpriteObject.extend({

	/**
	 * Creates a repeatable sprite inside a specific area.
	 *
	 * @param spritewidth  Width of the image you want to repeat.
	 * @param spriteheight Height of the image you want to repeat.
	 * @param width        Width of the area that you want to repeat the sprites on.
	 * @param height       Height of the area that you want to repeat the sprites on.
	 *
	 * @note Other parameters are just like on `SpriteObject`.
	 */
	init : function (x, y, image, spritewidth, spriteheight, width, height) {
		this.parent(x, y, image, spritewidth, spriteheight);

		// Let's use this to know the area where
		// to repeat the sprites
		this.fullWidth  = width;
		this.fullHeight = height;

		// These are the repeat area limits.
		// Just a simple visualization:
		//
		//  this.pos.x  _________________ this.limitX
		//  this.pos.y |                |
		//             |                |
		//             |                |
		// this.limitY |________________| this.limitX + this.limitY
		//
		this.limitX = this.pos.x + this.fullWidth;
		this.limitY = this.pos.y + this.fullHeight;
	},

	draw : function(context) {

		// To draw the repeated sprites we'll change
		// our x and y positions.
		//
		// We're storing the original one so we can
		// restore them when done drawing.
		this.originalPos = this.originalPos || this.pos.clone();

		// Finally, here we're repeating all the sprites.
		// Seems strange, but read calmly and you'll get it.
		//
		// Lemme show you the order of drawing.
		// [ ] are not-drawn-yet sprites
		// [X] are drawn sprite
		//
		// 1.[ ][ ]  2.[X][ ]  3.[X][ ]  4.[X][X]  5.[X][X]
		//   [ ][ ]    [ ][ ]    [X][ ]    [X][ ]    [X][X]
		//
		// So we first draw all Y sprites on the first X.
		// Then we repeat for the next X and so on.

		while (this.pos.x < this.limitX) {

			// Need  to reset Y here for each X
			this.pos.y = this.originalPos.y;

			while (this.pos.y < this.limitY) {

				// FINALLY drawing
				// Our parent (SpriteObject) is responsible
				// for placing the Image on the Canvas,
				// according to our `this.pos.x` and `this.pos.y`
				this.parent(context);

				this.pos.y += this.height;
			}

			this.pos.x += this.width;
		}

		// Restoring original position!
 		this.pos.setV(this.originalPos);
	}
});
