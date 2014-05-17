// Le Spike

/*global game,me*/

// Creating a "Spike" namespace
game.spike = game.spike || {};

/**
 * All possible spike types (positions).
 *
 * Check it out:
 * - TOP    Horizontal spike, pointed down (\/)
 * - BOTTOM Horizontal spike, pointed up   (/\)
 * - LEFT   Vertical spike, pointed left   (<)
 * - RIGHT  Vertical spike, pointed right  (>)
 */
game.spike.type = {
	TOP    : "top",
	BOTTOM : "bottom",
	LEFT   : "left",
	RIGHT  : "right"
};

/**
 * Single-tile spike that kills the player on contact.
 *
 * Check out `game.spike.type` right up there for the
 * possible spike types.
 *
 * @note When you create a `spike` on Tiled, if you
 *       span a huge area the spike sprite will repeat
 *       along it.
 */
game.spikeEntity = me.ObjectEntity.extend({

	/**
	 * Create a new Spike.
	 *
	 * @param settings A hash with options, defined on Tiled.
	 */
	init : function(x, y, settings) {

		// If Tiled doesn't specify the spike type,
		// let's default it to pointing up.
		this.type = settings.type || game.spike.type.TOP;

		// The Spike type will define the sprite.
		// Here we set which image will be used to show
		// the spike.

		if ((this.type === game.spike.type.TOP) ||
			(this.type === game.spike.type.BOTTOM))
			settings.image = "spike-sprite-vertical";

		else if ((this.type === game.spike.type.LEFT)
				 (this.type === game.spike.type.RIGHT))
			settings.image = "spike-sprite-horizontal";

		else
			// Sanity check: not allowing other kinds of spikes
			throw 'Unknown Spike type "' + this.type + '"!';

		// Adjust the size setting to match the sprite size
		settings.spritewidth  = 2;
		settings.spriteheight = 2;

		// Creating the object (melonJS-specific stuff)
		this.parent(x, y, settings);

		// Now, instead of having a single spike sprite
		// let's repeat it along the area defined by
		// the player.
		this.renderable = new me.RepeatableSpriteObject(
			this.pos.x, this.pos.y,
			me.loader.getImage(settings.image),
			settings.spritewidth, settings.spriteheight,
			this.width, this.height
		);

		// These are the exceptions
		// Need to flip the sprite since we don't
		// have an image for each type
		if (this.type === game.spike.type.RIGHT)
			this.renderable.flipX();

		else if (this.type === game.spike.type.TOP)
			this.renderable.flipY();

		this.collidable = true;
		this.type = me.game.SPIKE_OBJECT;
	},

	draw : function (context) {
		this.renderable.draw(context);
	}

	// No need to overload more functions
	// since the entity will just stand there
});


