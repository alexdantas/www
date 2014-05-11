// Le checkpoint

/*global game,me*/

// Separate namespace (just for making things pretty)
game.checkpoint = game.checkpoint || {};

/**
 * Type of this checkpoint: if it's on the roof
 * or on the ground.
 */
game.checkpoint.type = {
	TOP    : "top",
	BOTTOM : "bottom"
};

/**
 * Global reference to the current checkpoint.
 *
 * I know it's a terrible thing to do, but we need
 * to deactivate the previous checkpoint if we activate
 * another.
 */
game.checkpoint.current = null;

/**
 * Thing that enables the player to return to it's position,
 * when collided.
 */
game.checkpointEntity = me.ObjectEntity.extend({

	/**
	 * Create a new Checkpoint.
	 *
	 * @param settings A hash with options, defined on Tiled.
	 */
	init : function(x, y, settings) {

		// If Tiled doesn't specify the checkpoint type,
		// let's default it to stick on the ground.
		this.checkpointType = settings.type || game.checkpoint.type.BOTTOM;

		settings.image        = "checkpoint";
		settings.spritewidth  = settings.width  = 2;
		settings.spriteheight = settings.height = 2;

		// Creating the object (melonJS-specific stuff)
		this.parent(x, y, settings);

		this.renderable.addAnimation("inactive", [0]);
		this.renderable.addAnimation("active",   [1]);

		this.renderable.setCurrentAnimation("inactive");

		this.active = false;

		this.collidable = true;
		this.type = me.game.CHECKPOINT_OBJECT;
	},

	/**
	 * Called when an object collides with us.
	 */
	onCollision : function(collisionVector, otherObject) {

		// Player hit us!
		if (otherObject.type === me.game.PLAYER_OBJECT) {
			this.activate(true);
			otherObject.checkpoint(this.pos.x, this.pos.y, this.checkpointType);
		}
	},

	/**
	 * Turns "on" or "off" this checkpoint.
	 *
	 * @param option Boolean with option activate.
	 */
	activate : function (option) {

		// If we're going to activate this checkpoint,
		// we need to deactivate the previous
		if (option) {

			// No need to activate if this checkpoint
			// is ourselves.
			if ((game.checkpoint.current) &&
				(game.checkpoint.current !== this)) {

				game.checkpoint.current.activate(false);
				me.audio.play("checkpoint", false, null, me.save.sfxVolume);
			}
			game.checkpoint.current = this;
		}

		// Activatin'
		this.active = option;
		this.renderable.setCurrentAnimation((option) ?
											"active" :
											"inactive");
	},

	update : function (delta) {
		return true;
	}
});

