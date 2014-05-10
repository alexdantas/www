// Le player

/*global game,me*/

/* Player entity.
 *
 * The character you control around the game.
 */
game.playerEntity = me.ObjectEntity.extend({

	// Constructor
	init : function(x, y, settings) {

		// Aside from the `settings` passed by Tiled
		settings.image = "player-spritesheet";

		// The collision box will be approximately 1 tile per two
		// But the actual sprites are the following:
		settings.spritewidth  = settings.width  = 2;
		settings.spriteheight = settings.height = 4;

		// Need to create super-class-specific stuff
		this.parent(x, y, settings);

		this.area = "area000";

		// Normally things outside the screen (viewport)
		// are not updated.
		// It's not the case of the player.
		this.alwaysUpdate = true;

		// Initial speed when walking
		this.setVelocity(0.19, 0.39);

		this.renderable.addAnimation("standing", [0]);
		this.renderable.addAnimation("dying",    [1]);

		this.renderable.setCurrentAnimation("standing");

		// Saving our current position so when
		// we die we return here.
		this.checkpoint();

		// Keeping a global reference so we can acccess
		// the player anywhere.
		game.player = this;
		this.type = me.game.PLAYER_OBJECT;
	},

	/**
	 * Called every frame to update the Player's internal state.
	 *
	 * @note Remember, if we return `true` we tell the engine
	 *       to redraw the player. `false` tells it to avoid
	 *       having all the work of doing that.
	 */

	update : function(delta) {

		if (! this.alive)
			return false;

		// Player's death animation is happening
		if (this.dying)
			return true;

		// Fell into outside the screen
		if (! this.inViewport) {
			this.die();
			return false;
		}

		// Invert gravity (only possible when on the floor)
		if (me.input.isKeyPressed("jump"))
			this.flip();

		// Walk!
		var xSpeedIncrease = this.accel.x * me.timer.tick;
		if      (me.input.isKeyPressed("left"))  this.vel.x -= xSpeedIncrease;
		else if (me.input.isKeyPressed("right")) this.vel.x += xSpeedIncrease;
		else                                     this.vel.x  = 0;

		// Need to call this so we can update
		// the movement, animation and stuff
		this.parent(delta);

		// Updating the movement and checking for
		// collisions with the map
		var collision = this.updateMovement();

		// Here we allow the player to change gravity
		// again.
		//
		// We're going to check if we collided on the Y
		// axis. Depending on the current gravity we can
		// tell if the player is falling or not.
		if (collision.y != 0) {

			// The player's falling up and just hit the ceiling
			if ((this.gravity < 0) && (collision.y < 0))
					this.falling = false;

			// The player's falling down and hit the ground
			else if ((this.gravity > 0) && (collision.y > 0))
					this.falling = false;
		}
		else
			this.falling = true;

		// Now checking for collision with game objects
		collision = me.game.world.collide(this);

		if (collision) {

			if (collision.obj.type === me.game.SPIKE_OBJECT)
				this.die();

			else if (collision.obj.type === me.game.ENEMY_OBJECT)
				this.die();

			return false;
		}
		return true;
	},

	/**
	 * Inverts the player's gravity
	 */
	flip : function () {

		// Will only flip if we're touching
		// the ground
		if (this.falling)
			return;

		// Simple as that!
		this.gravity = -this.gravity;

		// Inverting the player sprite
		if (this.gravity < 0)
			this.renderable.flipY(true);
		else
			this.renderable.flipY(false);
	},

	/**
	 * Starts the player dying animation.
	 * When it finishes, will actually make the player die
	 *
	 * @see #respawn()
	 */
	die : function() {

		// No more updating for Mr. Player!
		// (but force the "dying" animation)
		this.dying = true;

		this.renderable.setCurrentAnimation("dying");

		// NOTE: Apparently I can't attach a callback
		//       to Renderable#flicker()... What the FUCK
		this.renderable.flicker(10);

		me.timer.setTimeout(
			function() {
				game.player.dying = false;
				game.player.doRespawn();
			},
			500
		);
	},

	/**
	 * Saves the current position and stuff so when
	 * we die we return here.
	 */
	checkpoint : function () {

		// A little separate namespace.
		// Just for organizing things
		this.respawn = this.respawn || {};

		// Here we'll store information to reset the player.
		// When he dies, it will mirror what's inside here.

		// It's (x,y) position
		this.respawn.pos   = this.respawn.pos || new me.Vector2d(0,0);
		this.respawn.pos.x = this.pos.x;
		this.respawn.pos.y = this.pos.y;

		// Player can die in one map and respawn on another
		this.respawn.area = this.area;

		// Vertical checkpoints!
		this.respawn.gravity = this.gravity;
	},

	/**
	 * Makes the player return to a previously saved
	 * position.
	 *
	 * @note Please don't call this directly... Prefer the
	 *       `die()` animation.
	 */
	doRespawn : function() {
		this.renderable.setCurrentAnimation("standing");

		// Restore player's original position
		this.pos.setV(this.respawn.pos);

		this.falling = false;
		this.area    = this.respawn.area;
		this.gravity = this.respawn.gravity;

		// Inverting the player sprite
		// WARNING: Duplicated code!
		//          See `this.flip()`
		if (this.gravity < 0)
			this.renderable.flipY(true);
		else
			this.renderable.flipY(false);
	}
});

