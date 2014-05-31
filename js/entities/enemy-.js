/*global game,me*/

// Making sure this namespace exists
game.enemy = game.enemy || {};

/**
 * Enemy that simply stands there doing nothing.
 */
game.enemy.entity = me.ObjectEntity.extend({

	/**
	 * Create a new Enemy.
	 *
	 * @param settings A hash with options, defined on Tiled.
	 */
	init : function(x, y, settings) {

		// Randomly selecting between enemy-square[1-5]
		var sprite = Number.prototype.random(1, 5);

		settings.image = "enemy-square" + sprite;

		settings.spritewidth  = settings.width  = 2;
		settings.spriteheight = settings.height = 2;

		// Creating the object (melonJS-specific stuff)
		this.parent(x, y, settings);

		// This is needed so it can be shown on the screen.
		this.renderable.addAnimation("walking", [0, 1, 2, 3], 400);
		this.renderable.setCurrentAnimation("walking");

		// This object doesn't respect the laws
		// of physics.
		this.gravity    = 0;
		this.collidable = true;
		this.type       = me.game.ENEMY_OBJECT;
	}

	// No need to overload more functions
	// since the entity will just stand there
});


