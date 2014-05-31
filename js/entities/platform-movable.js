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
	 * - START: Begin from the left
	 * - END:   Begin from the right
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
 * The path is defined on Tiled by the entities' width
 * and height. Plus, you have to define the following
 * properties:
 *
 * Name:  "type"       : what kind of movement
 * Value: "horizontal" : moves horizontally (along x axis)
 * Value: "vertical"   : moves vertically (along y axis)
 *
 * Name:  "begin" : from where the movement starts
 * Value: "start" : starts from left or top (according to "type")
 * Value: "end"   : starts from right or bottom (according to "type")
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
		// It's position (x, y) and size (width, height) will
		// be set as the default for all platforms.
		this.parent(x, y, settings);

		// Velocities on the X and Y axis
		this.setVelocity(0.17, 0.17);

		// What kind of platform is this?
		// Falling back to default
		this.walkType = settings["type"] || game.platform.movable.type.HORIZONTAL;

		// Where should the platform start from?
		// Falling back to default
		this.walkStart = settings["begin"] || game.platform.movable.path.START;

		// Set start/end position based on that initial area
		// size given by Tiled.
		if (this.walkType === game.platform.movable.type.HORIZONTAL) {
			this.startX = this.pos.x;
			this.endX   = this.pos.x + (pathWidth - settings.spritewidth);
		}
		else {
			this.startY = this.pos.y;
			this.endY   = this.pos.y + (pathHeight - settings.spriteheight);
		}

		// These flags are used to determine which
		// direction it's moving right now.
		// They will get initialized on...
		this.walkLeft = this.walkUp = false;

		// ...this function.
		// Place it at the beginning, ready to move!
		this.resetPosition();

		this.type = me.game.PLATFORM_MOVABLE_OBJECT;
	},

	/**
	 * Places the platform back on it's starting position.
	 */
	resetPosition : function () {

		if (this.walkType === game.platform.movable.type.HORIZONTAL) {

			// From the left
			if (this.walkStart === game.platform.movable.path.START) {

				this.pos.x    = this.startX;
				this.walkLeft = false;
			}
			// From the right
			else {

				this.pos.x    = this.endX;
				this.walkLeft = true;
			}
		}
		else {

			// From the top
			if (this.walkStart === game.platform.movable.path.START) {
				this.pos.y  = this.startY;
				this.walkUp = false;
			}

			// From the bottom
			else {
				this.pos.y  = this.endY;
				this.walkUp = true;
			}
		}
	},

	/**
	 * Manages platform movement.
	 */
	update : function(delta) {

		// Do nothing if not on the screen
		if (! this.inViewport) {
			return false;
		}

		var previousPosition = this.pos.clone();

		// Making it stay between it's boundaries
		if (this.walkType === game.platform.movable.type.HORIZONTAL) {

			if ((this.walkLeft) &&
				(this.pos.x <= this.startX))
				this.walkLeft = false;

			else if ((! this.walkLeft) &&
					 (this.pos.x >= this.endX))
				this.walkLeft = true;

			// Make it walk
			// Note that it's a stiff movement,
			// with only two possible speeds.
			this.vel.x = ((this.walkLeft) ?
						  -this.accel.x :
						  this.accel.x) * me.timer.tick;
		}
		else {

			if ((this.walkUp) &&
				(this.pos.y <= this.startY))
				this.walkUp = false;

			else if ((! this.walkUp) &&
					 (this.pos.y >= this.endY))
				this.walkUp = true;

			this.vel.y = ((this.walkUp) ?
						  -this.accel.y :
						  this.accel.y) * me.timer.tick;
		}

		// MelonJS' internal function to check collisions
		// and stuff against the map.
		var collision = this.updateMovement();

		// Just hit the map.
		// Let's invert the movement instead of get stuck.
		if (collision.y != 0) this.walkUp   = !this.walkUp;
		if (collision.x != 0) this.walkLeft = !this.walkLeft;

		this.deltaPos = this.deltaPos || {};
		this.deltaPos.x = this.pos.x - previousPosition.x;
		this.deltaPos.y = this.pos.y - previousPosition.y;

		// Redraw!
		return true;
	},

	/**
	 * Called when anything collide with us.
	 *
	 * Probably the player, so let's attach ourselves
	 * to it.
	 * This way it can keep up with our speed.
	 */
	onCollision : function(collision, other) {

		// Only vanish if it's the Player
		if (other.type === me.game.PLAYER_OBJECT)

			// Only vanish if collided with the head
			// or butt - never on the Player's sides.
			if (collision.y != 0)

				other.platform = this;
	}
});


