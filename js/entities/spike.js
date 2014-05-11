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

		if (this.type === game.spike.type.TOP)
			settings.image = "spike-sprite-vertical";

		else if (this.type === game.spike.type.BOTTOM)
			settings.image = "spike-sprite-vertical";

		else if (this.type === game.spike.type.LEFT)
			settings.image = "spike-sprite-horizontal";

		else if (this.type === game.spike.type.RIGHT)
			settings.image = "spike-sprite-horizontal";

		else
			// Sanity check: not allowing other kinds of spikes
			throw 'Unknown Spike type "' + this.type + '"!';

		// Adjust the size setting to match the sprite size
		settings.spritewidth  = settings.width  = 2;
		settings.spriteheight = settings.height = 2;

		// Creating the object (melonJS-specific stuff)
		this.parent(x, y, settings);

		// These are the exceptions
		// Need to flip the sprite since we don't
		// have an image for each type
		if (this.type === game.spike.type.RIGHT)
			this.renderable.flipX();

		else if (this.type === game.spike.type.TOP)
			this.renderable.flipY();

		this.renderable.addAnimation("stand-there-doing-nothing", [0]);
		this.renderable.setCurrentAnimation("stand-there-doing-nothing");

		this.collidable = true;
		this.type = me.game.SPIKE_OBJECT;
	}

	// No need to overload more functions
	// since the entity will just stand there
});

/**
 * Group of spikes.
 *
 * The idea is the following: instead of you having to
 * place Spike by Spike on Tiled, you put a SpikeGroup
 * and it creates a lot of spikes for you.
 */
game.spikeGroupEntity = me.ObjectEntity.extend({

	/**
	 * Creates all spikes inside itself and
	 * suicides.
	 */
	init : function (x, y, settings) {

		// Creating all Spikes inside ourselves
		for (var i = x; i < (settings.width + x); i++)
			for (var j = y; j < (settings.height + y); j++) {

				// Creating on specific tile
				var spike = me.pool.pull("spike", i*2, j*2, settings);

				me.game.world.addChild(spike);
			}

		// We don't need to keep a reference
		// to ourselves.
		// (although it doesn't seem to have any effect)
//		me.game.world.removeChild(this);
	},

	update : function(dt) {
		return false;
	},
	draw : function(context) {

	}
});


