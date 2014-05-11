
/*global game,me*/

game.enemy = game.enemy || {};

/**
 * Simple enemy that walks left and right on a pre-determined path.
 *
 * AKA the red turtle of mario, except it doesn't detect if
 * it's going to fall of a ledge.
 *
 * The path is specified on Tiled by the entity size.
 */
game.enemyPathEntity = me.ObjectEntity.extend({

	init : function(x, y, settings) {

		// The `settings` hash is defined on Tiled.

		// This image is defined on `resources.js`
		settings.image = "enemy-square";

		// There we specify `width`, which we'll use as the path
		// this enemy will follow; saving it...
		var pathWidth  = settings.width;

		// Adjust the size setting to match the sprite size
		settings.spritewidth  = settings.width  = 2;
		settings.spriteheight = settings.height = 2;

		this.parent(x, y, settings);

		// Set start/end position based on that initial area
		// size given by Tiled.
		x = this.pos.x;

		this.startX = x;
		this.endX   = x + pathWidth - settings.spritewidth;

		// Make him start from the right
		this.pos.x    = this.endX;
		this.walkLeft = true;

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
	 * Called by engine when colliding with other object.
	 * `obj` corresponds to object collided with
	 */
	onCollision : function(res, obj) {

		// They see me rollin'...
		//
		// They hatin'
	},

	// Manage enemy movement
	update : function(delta) {

		// Do nothing if not on the screen
		if (! this.inViewport)
			return false;

		if (this.health <= 0) {
			me.game.world.removeChild(this);
			return true;
		}

		// Making it stay between it's boundaries
		if (this.alive) {

			if (this.walkLeft && this.pos.x <= this.startX)
				this.walkLeft = false;

			else if (!this.walkLeft && this.pos.x >= this.endX)
				this.walkLeft = true;

			// Make it walk
			this.vel.x += ((this.walkLeft) ?
						    -this.accel.x :
						     this.accel.x) * me.timer.tick;

			// Flip the sprite if necessary
			this.flipX(this.walkLeft);
		}
		else
			this.vel.x = 0;

		this.updateMovement();

		// Update object animation
		this.parent(delta);
		return true;
	}
});

