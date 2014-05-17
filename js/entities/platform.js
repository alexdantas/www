// Le Platform

/*global game,me*/

// Making sure this namespace exists
game.platform = game.platform || {};

/**
 * Floating thing that you can step into.
 */
game.platform.entity = me.ObjectEntity.extend({

	/**
	 * Create a new Platform.
	 *
	 * @param settings A hash with options, defined on Tiled.
	 */
	init : function(x, y, settings) {

		settings.image = "platform";

		settings.spritewidth  = settings.width  = 4;
		settings.spriteheight = settings.height = 1;

		// Creating the object (melonJS-specific stuff)
		this.parent(x, y, settings);

		// This is needed so it can be shown on the screen.
		this.renderable.addAnimation("stand-there-doing-nothing", [0]);
		this.renderable.setCurrentAnimation("stand-there-doing-nothing");

		this.gravity = 0;
		this.collidable = true;
		this.type = me.game.PLATFORM_OBJECT;
	}

	// No need to overload more functions
	// since the entity will just stand there
});

