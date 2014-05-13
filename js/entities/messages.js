// Printable texts

/*global game,me*/

/**
 * Texts that can appear on the maps.
 *
 * Here's the catch: you create entities on Tiled, with the name
 *                   "message" and an attribute "text" that contains
 *                   what will be shown.
 *                   Then it gets displayed on the map just like
 *                   any other thing :D
 */
game.messageEntity = me.Renderable.extend({

	init : function(x, y, settings) {

		// Creating the parent Rectangle
		// Width/Height doesn't matter now
		this.parent(new me.Vector2d(x, y), 0, 0);

		// The text that will be shown is defined on Tiled
		this.text = settings.text;
	},

	update : function(delta) {
		// No need to redraw every frame
		return false;
	},

	draw : function(context) {

		// To correctly draw the message on the screen
		// we need to know the width/height of the final
		// drawn text.
		var textScreenSize = game.font_white.measureText(context, this.text);

		this.width  = textScreenSize.width;
		this.height = textScreenSize.height;

		game.font_white.draw(context, this.text, this.pos.x, this.pos.y);
	}
});


