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

		// THIS IS A "BUG" ON MELONJS
		// Since the player is 2 pixels large, it's
		// collision box actually is 3 pixels large!
		// Don't know why but I have to adjust it
		// manually here.
		var shape = this.getShape();
		shape.resize(
			shape.width - 1,
			shape.height
		);

		// Normally things outside the screen (viewport)
		// are not updated.
		// It's not the case of the player.
		this.alwaysUpdate = true;

		// Speed when running
		this.setVelocity(0.29, 0.39);

		// Speed when walking (holding SHIFT)
		this.walkVelocity = new me.Vector2d(0.19, 0.39);

		this.renderable.addAnimation("standing", [0]);
		this.renderable.addAnimation("dying",    [1]);

		this.renderable.setCurrentAnimation("standing");

		// Gravity is the key of this game.
		//
		// @note Independently of this gravity, the player's
		//       vertical position can't go further than
		//       what we set up there.
		this.gravity         = me.sys.gravity;
		this.absoluteGravity = Math.abs(this.gravity);

		// Saving our current position so when
		// we die we return here.
		// (simulating a checkpoint)
		this.checkpoint(this.pos.x, this.pos.y+2, game.checkpoint.type.BOTTOM);

		// Movable platform attached to the Player
		//
		// When the player steps on a movable platform,
		// it'll attach to the player through this variable.
		// We use it to move the Player alongside the platform
		// on `update()`.
		this.platform = null;

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

		// Just for safety's sake, let's save the
		// current player position.
		// If we do move the player, we might use this
		// to change it back to where it was.
		var previousPos = this.pos.clone();

		// This makes the Camera center on the player's
		// position, making sure it'll move 32 pixels
		// at a time.
		me.game.viewport.moveTo(
			Math.floor(this.pos.x/32) * 32,
			Math.floor(this.pos.y/32) * 32
		);

		if (! this.alive)
			return false;

		// Player's death animation is happening
		if (this.dying)
			return true;

		// // Fell into outside the screen
		// if (! this.inViewport) {
		// 	this.die();
		// 	return false;
		// }

		// Now we'll handle input!
		//
		// Invert gravity (only possible when on the floor)
		if (me.input.isKeyPressed("jump"))
			this.flip();

		// Let's see if the player will walk slowly or run
		this.walking = me.input.keyStatus("walk");

		// Run (or Walk)!
		var xSpeedIncrease = ((this.walking) ?
							  this.walkVelocity.x :
							  this.accel.x) * me.timer.tick;

		if      (me.input.isKeyPressed("left"))  this.vel.x = -xSpeedIncrease;
		else if (me.input.isKeyPressed("right")) this.vel.x = xSpeedIncrease;
		else                                     this.vel.x = 0;

		// Panic Button aka. Suicide Key aka. Angel of death aka...
		if (me.input.isKeyPressed("die")) {
			this.die();
			return false;
		}

		// Need to call this so we can update
		// the movement, animation and stuff
		this.parent(delta);

		// Moving Platforms!
		// Here we add the player's velocity
		// if he's on top of a movable platform RIGHT NOW
		if (this.platform) {
			this.vel.x += this.platform.vel.x;
			this.vel.y += this.platform.vel.y;

			// And now that I've updated the speed, let's
			// clear any platforms associated to us.
			// If we're still on top of one, it'll attach
			// to ourselves again anyway.
			this.platform = null;
		}

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

			// NOTE: This is needed, otherwise the collision
			//       system gets screwed up when the player
			//       is upside-down.
			//       That's because although the player is
			//       drawn with pixels, it's position can be
			//       between pixels (like, x=1.333335).
			//       When the player is inverted, it's y
			//       position used to be very strange, leading
			//       to awkward collisions.
			this.pos.y = Math.floor(this.pos.y);

		}
		else
			this.falling = true;

		// Now checking for collision with
		// game objects
		collision = me.game.world.collide(this);

		if (collision) {

			if ((collision.obj.type === me.game.SPIKE_OBJECT) ||
				(collision.obj.type === me.game.ENEMY_OBJECT))
				this.die();

			else if ((collision.obj.type === me.game.PLATFORM_OBJECT) ||
					 (collision.obj.type === me.game.PLATFORM_VANISHING_OBJECT) ||
					 (collision.obj.type === me.game.PLATFORM_MOVABLE_OBJECT)) {

				// Head (or butt) collision with platform
				if (collision.y != 0) {
					this.falling = false;
//					this.pos.y = previousPos.y;

					if (this.gravity < 0)
						this.pos.y = collision.obj.bottom;
					else
						this.pos.y = collision.obj.top    - this.height;
				}

				// Side collision
				if (collision.x != 0) {
//					this.pos.x = previousPos.x;
				}
			}
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

		me.audio.play("jump", false, null, me.save.sfxVolume);
	},

	/**
	 * Starts the player dying animation.
	 * When it finishes, will actually make the player die
	 *
	 * @see #respawn()
	 */
	die : function() {

		game.data.deaths++;

		// Just a nice quirk -- changing the title
		// to the number of times the player died :)
		game.changeWindowTitle(game.data.deaths + " : www");

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

		me.audio.play("death", false, null, me.save.sfxVolume);

		// This is needed so when the player dies we make
		// sure it can go through the level again
		// (if he made some platforms disappear)
		game.platform.vanishing.showAll();
	},

	/**
	 * Saves the current position and stuff so when
	 * we die we return here.
	 */
	checkpoint : function (x, y, checkpointType) {

		// A little separate name space.
		// Just for organizing things
		this.respawn = this.respawn || {};

		// Here we'll store information to reset the player.
		// When he dies, it will mirror what's inside here.

		// It's (x,y) position
		this.respawn.pos   = this.respawn.pos || new me.Vector2d(x, y);
		this.respawn.pos.x = x;
		this.respawn.pos.y = ((checkpointType === game.checkpoint.type.BOTTOM) ?
							  y - 2 :
							  y);

		// Player can die in one map and respawn on another
		this.respawn.area = this.area;

		// Checkpoints on the roof or on the ground?
		// Makes the player gravity.
		this.respawn.gravity = ((checkpointType === game.checkpoint.type.BOTTOM) ?
								this.absoluteGravity :
								-this.absoluteGravity);
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

