/*global game,me*/

game.enemy = game.enemy || {};

game.enemy.path = game.enemy.path || {};

/**
 * Defines possible ways they can move.
 *
 * They can move up-down (vertical) or
 * left-right (horizontal).
 */
game.enemy.path.type = {
	HORIZONTAL : "horizontal",
	VERTICAL   : "vertical"
};

/**
 * Defines where the enemy will start movin'.
 *
 * If the platform is HORIZONTAL:
 * - START: Begin from the left
 * - END:   Begin from the right
 *
 * If the platform is VERTICAL:
 * - START: Begin from the top
 * - END:   Begin from the bottom
 */
game.enemy.path.path = {
	START : "start",
	END   : "end"
};

/**
 * Enemy that walks over a pre-determined path.
 * It can walk over a horizontal or vertical path.
 *
 * The path is specified on Tiled by the entity size.
 *
 * - If it's a vertical enemy, it's Tiled height
 *   is the path.
 * - If it's a horizontal enemy, it's Tiled width
 *   is the path.
 */
game.enemy.path.entity = me.ObjectEntity.extend({

	/**
	 * Creates the enemy.
	 * @param settings Hash of options defined on Tiled.
	 *
	 * @note You MUST specify a type for this enemy.
	 *       It can be "horizontal" or "vertical".
	 */
	init : function(x, y, settings) {

		// Defaulting to horizontal enemy that starts
		// from the right.
		this.path_type  = settings.type || game.enemy.path.type.HORIZONTAL;
		this.path_start = settings.path || game.enemy.path.path.END;

		// There we specify `width` and `height`,
		// which we'll use as the path this enemy will follow;
		// saving it...
		var pathWidth  = settings.width;
		var pathHeight = settings.height;

		// Adjust the size setting to match the sprite size
		settings.image = "enemy-square";
		settings.spritewidth  = settings.width  = 2;
		settings.spriteheight = settings.height = 2;

		this.parent(x, y, settings);

		// Set start/end position based on that initial area
		// size given by Tiled.
		if (this.path_type === game.enemy.path.type.HORIZONTAL) {
			this.startX = this.pos.x;
			this.endX   = this.pos.x + pathWidth - settings.spritewidth;
		}
		else {
			this.startY = this.pos.y;
			this.endY   = this.pos.y + pathHeight - settings.spriteheight;
		}

		// Make him start from the right
		this.walkLeft = this.walkUp = false;

		this.resetPosition();

		// X and Y velocities
		this.setVelocity(0.12, 0.12);

		// This object doesn't respect the laws
		// of physics.
		this.gravity = 0;

		// Animation!
		this.renderable.addAnimation("walking", [0, 1, 2, 3], 400);
		this.renderable.setCurrentAnimation("walking");

		this.collidable = true;
		this.type = me.game.ENEMY_OBJECT;
	},


	/**
	 * Places the enemy back on it's starting position.
	 */
	resetPosition : function () {

		if (this.path_type === game.enemy.path.type.HORIZONTAL) {

			// From the left
			if (this.path_start === game.enemy.path.path.START) {

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
			if (this.path_start === game.enemy.path.path.START) {
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
	 * Called by engine when colliding with other object.
	 * `obj` corresponds to object collided with
	 */
	onCollision : function(res, obj) {

		// They see me rollin'...
		//
		// They hatin'
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
		if (this.path_type === game.enemy.path.type.HORIZONTAL) {

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
	}
});

