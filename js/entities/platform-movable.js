/*global game,me*/

// Making sure this namespace exists
game.platform = game.platform || {};

/**
 * A separate namespace for the movable platforms.
 *
 * It will hold constants and things that control
 * all the vanishing platforms.
 */
game.platform.movable = {

	/**
	 * Defines possible ways they can move.
	 *
	 * They can move up-down (vertical) or
	 * left-right (horizontal).
	 */
	type : {
		HORIZONTAL : "horizontal",
		VERTICAL   : "vertical"
	},

	/**
	 * Defines where the platform will start movin'.
	 *
	 * If the platform is HORIZONTAL:
	 * - START: Begin from the right
	 * - END:   Begin from the left
	 *
	 * If the platform is VERTICAL:
	 * - START: Begin from the top
	 * - END:   Begin from the bottom
	 */
	path : {
		START : "start",
		END   : "end"
	}
};

/**
 * Platform that moves alongside a predetermined path.
 *
 * The path is defined on Tiled.
 *
 *
 */
game.platform.movable.entity = game.platform.entity.extend({

	/**
	 * Create a new movable platform.
	 *
	 * @param settings A hash with options, defined on Tiled.
	 *
	 * @note See the class documentation for properties you
	 *       can define on Tiled.
	 */
	init : function(x, y, settings) {

		// There we specify `width`, which we'll use as the path
		// this enemy will follow; saving it...
		var pathWidth  = settings.width;
		var pathHeight = settings.height;

		// Creating the platform...
		this.parent(x, y, settings);

		// Velocities on the X and Y axis
		this.setVelocity(0.19, 0.19);

		// What kind of platform is this?
		// Falling back to default
		this.walkType = settings.type || game.platform.movable.type.HORIZONTAL;

		// Where should the platform start from?
		// Falling back to default
		this.walkStart = settings.begin || game.platform.movable.path.START;

		if (this.walkType === game.platform.movable.type.HORIZONTAL) {

			// Set start/end position based on that initial area
			// size given by Tiled.
			this.startX = this.pos.x;
			this.endX   = this.pos.x + (pathWidth - settings.spritewidth);

			// Defining where it'll start
			//
			// From the right
			if (this.walkStart === game.platform.movable.path.START) {
				this.pos.x = this.pos.x + pathWidth - settings.spritewidth;
				this.walkLeft = true;
			}
			// From the left
			else {
				this.pos.x = this.pos.x; // WUT m8
				this.walkLeft = false;
			}
		}
		else {
			// TODO
		}

		this.type = me.game.PLATFORM_MOVABLE_OBJECT;
	},

	/**
	 * Manages platform movement.
	 */
	update : function(delta) {

		// Do nothing if not on the screen
		if (! this.inViewport)
			return false;

		// Making it stay between it's boundaries
		if (this.walkType === game.platform.movable.type.HORIZONTAL) {

			if ((this.walkLeft) &&
				(this.pos.x <= this.startX))
				this.walkLeft = false;

			else if ((! this.walkLeft) &&
					 (this.pos.x >= this.endX))
				this.walkLeft = true;

			// Make it walk
			this.vel.x += ((this.walkLeft) ?
						   -this.accel.x :
						   this.accel.x) * me.timer.tick;
		}
		else {
			// TODO
		}
		// MelonJS' internal function to check collisions
		// and stuff
		this.updateMovement();

		// Redraw!
		return true;
	}
});


