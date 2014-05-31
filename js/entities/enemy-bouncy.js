/*global game,me*/

game.enemy = game.enemy || {};

game.enemy.bouncy = game.enemy.bouncy || {};

game.enemy.bouncy.type = {
	HORIZONTAL : "horizontal",
	VERTICAL   : "vertical",
	BOTH       : "both"
};

/**
 * Walks through an axis (vertical, horizontal or both)
 * bouncing on every tile on the map that's solid.
 */
game.enemy.bouncy.entity = me.ObjectEntity.extend({

	/**
	 * Creates the enemy.
	 *
	 * @param settings Hash of options defined on Tiled.
	 *
	 * @note You MUST specify a type for this enemy.
	 *       It can be "horizontal", "vertical" or "both".
	 */
	init : function (x, y, settings) {

		// Defaulting to horizontal enemy
		settings.type = settings.type || game.enemy.bouncy.type.HORIZONTAL;

		settings.image = "enemy-square";
		settings.spritewidth  = settings.width  = 2;
		settings.spriteheight = settings.height = 2;

		this.parent(x, y, settings);

		this.walkLeft = true;
		this.walkUp   = true;

		this.setVelocity(0.12, 0.12);
		this.gravity = 0;
		this.collidable = true;

		this.renderable.addAnimation("walking", [0, 1, 2, 3], 400);
		this.renderable.setCurrentAnimation("walking");

		this.type     = me.game.ENEMY_OBJECT;  // For melonJS
		this.walkType = settings.type;         // For ourselves


		// THIS IS A "BUG" ON MELONJS
		// Since the player is 2 pixels large, it's
		// collision box actually is 3 pixels large!
		// Don't know why but I have to adjust it
		// manually here.
		if (this.walkType === game.enemy.bouncy.type.HORIZONTAL) {

			var shape = this.getShape();
			shape.resize(
				shape.width - 1,
				shape.height
			);
		}
	},

	update : function (delta) {

		// Do nothing if not on the screen
		if (! this.inViewport)
			return false;

		if (this.alive) {

			if (this.walkType !== game.enemy.bouncy.type.HORIZONTAL) {
				// This is either VERTICAL or BOTH

				this.vel.y += ((this.walkUp) ?
						       -this.accel.y :
						       this.accel.y) * me.timer.tick;

			}
			if (this.walkType !== game.enemy.bouncy.type.VERTICAL) {
				// This is either HORIZONTAL or BOTH

				this.vel.x += ((this.walkLeft) ?
						       -this.accel.x :
						       this.accel.x) * me.timer.tick;
			}
		}
		else {
			this.vel.x = this.vel.y = 0;
		}

		// melonJS internal callback
		var collision = this.updateMovement();

		// Collided vertically!
		if (collision.y != 0)
			if (this.walkType === game.enemy.bouncy.type.VERTICAL)
				this.walkUp = (! this.walkUp);

		// Collided horizontally
		if (collision.x != 0)
			if (this.walkType === game.enemy.bouncy.type.HORIZONTAL)
				this.walkLeft = (! this.walkLeft);

		this.parent(delta);
		return true;
	}
});

